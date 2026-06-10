/**
 * Single Prisma client instance per process.
 *
 * Why a singleton: each PrismaClient holds its own pool. Re-creating it
 * on every import (which `tsx watch` would do via HMR) leaks connections
 * and starves the database. The global cache trick survives reloads in
 * dev and is a no-op in prod where the process is fresh each time.
 */
import { PrismaClient } from "@prisma/client";
import { env } from "./env";
import { logger } from "./logger";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

interface PrismaLogEvent {
  timestamp: Date;
  message: string;
  target: string;
}

function createClient(): PrismaClient {
  const client = new PrismaClient({
    log: env.isProd
      ? [
          { emit: "event", level: "error" },
          { emit: "event", level: "warn" },
        ]
      : [
          { emit: "event", level: "error" },
          { emit: "event", level: "warn" },
        ],
  });

  // The Prisma `$on` signature is a complicated literal union; cast to
  // a narrower callback shape so we don't depend on the generated
  // overload and keep callers type-safe.
  const listenable = client as unknown as {
    $on: (event: "error" | "warn", cb: (e: PrismaLogEvent) => void) => void;
  };
  listenable.$on("error", (e) =>
    logger.error({ event: "prisma.error", message: e.message, target: e.target }),
  );
  listenable.$on("warn", (e) =>
    logger.warn({ event: "prisma.warn", message: e.message, target: e.target }),
  );
  return client;
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (!env.isProd) globalForPrisma.prisma = prisma;

export type Db = typeof prisma;
