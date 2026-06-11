/**
 * WebSocket hub — live message delivery.
 *
 * Attached to the same HTTP server as Express (see server.ts). Clients
 * connect to `/ws?token=<access JWT>`; we authenticate on connect and
 * keep a `userId → sockets` map. Domain code (the message service) calls
 * `pushToUser` after persisting a message so the recipient's open tabs
 * receive it instantly. Writes still go over REST — WS is push-only.
 */
import type { Server } from "node:http";
import { WebSocketServer, WebSocket } from "ws";
import { verifyAccessToken } from "./jwt";
import { logger } from "@config/logger";

const userSockets = new Map<string, Set<WebSocket>>();

/** Send a JSON payload to every open socket a user has. No-op if offline. */
export function pushToUser(userId: string, payload: unknown): void {
  const sockets = userSockets.get(userId);
  if (!sockets || sockets.size === 0) return;
  const data = JSON.stringify(payload);
  for (const ws of sockets) {
    if (ws.readyState === WebSocket.OPEN) ws.send(data);
  }
}

export function attachWebSocketServer(server: Server): void {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws, req) => {
    let userId: string;
    try {
      const url = new URL(req.url ?? "", "http://localhost");
      const token = url.searchParams.get("token");
      if (!token) throw new Error("missing token");
      userId = verifyAccessToken(token).sub;
    } catch {
      ws.close(4001, "Unauthorized");
      return;
    }

    let set = userSockets.get(userId);
    if (!set) {
      set = new Set();
      userSockets.set(userId, set);
    }
    set.add(ws);

    ws.on("close", () => {
      const s = userSockets.get(userId);
      if (!s) return;
      s.delete(ws);
      if (s.size === 0) userSockets.delete(userId);
    });
    ws.on("error", () => {
      /* connection-level errors are non-fatal; cleanup happens on close */
    });

    ws.send(JSON.stringify({ type: "connected" }));
  });

  logger.info({ event: "ws.listen", path: "/ws" }, "WebSocket server attached at /ws");
}
