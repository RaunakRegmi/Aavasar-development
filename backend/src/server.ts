/**
 * Process entrypoint.
 *
 * - Boots the Express app.
 * - Binds graceful shutdown handlers so a SIGTERM (from a container
 *   orchestrator or `Ctrl-C`) drains in-flight requests and closes the
 *   DB pool before exiting. Worker pods that exit cleanly avoid
 *   in-flight 5xx during deploys.
 * - Turns any uncaught exception / unhandled rejection into a fatal
 *   log + exit (per "let it crash" — supervisord/k8s restarts us).
 */
import { createServer } from "node:http";
import { env } from "@config/env";
import { logger } from "@config/logger";
import { prisma } from "@config/prisma";
import { makeApp } from "@/app";
import { attachWebSocketServer } from "@lib/ws";

const app = makeApp();
const server = createServer(app);

// Live messaging — shares the HTTP server (clients connect to /ws).
attachWebSocketServer(server);

server.listen(env.port, () => {
  logger.info(
    { event: "server.listen", port: env.port, env: env.nodeEnv, base: env.apiBasePath },
    `Aavasar API listening on :${env.port}${env.apiBasePath}`,
  );
});

const shutdown = (signal: string) => {
  logger.info({ event: "server.shutdown", signal }, "Shutting down…");
  // Stop accepting new connections, drain existing ones.
  server.close(async (err) => {
    if (err) {
      logger.error({ event: "server.close.error", err });
      process.exit(1);
    }
    try {
      await prisma.$disconnect();
    } catch (e) {
      logger.error({ event: "prisma.disconnect.error", err: e });
    }
    process.exit(0);
  });
  // Hard exit if drain takes too long.
  setTimeout(() => {
    logger.error({ event: "server.shutdown.timeout" }, "Force-exiting after 10s drain.");
    process.exit(1);
  }, 10_000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  logger.fatal({ event: "process.unhandledRejection", reason });
  // Operational shutdown — let the orchestrator restart us.
  shutdown("unhandledRejection");
});

process.on("uncaughtException", (err) => {
  logger.fatal({ event: "process.uncaughtException", err });
  shutdown("uncaughtException");
});
