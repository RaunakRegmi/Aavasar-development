/**
 * Messaging WebSocket client — a small singleton that keeps one live
 * connection to `/ws` while the user is authenticated and fans inbound
 * message events out to subscribers (the MessagingProvider wires them
 * into the react-query cache). Writes go over REST; this is push-only.
 */
import { env } from "@shared/lib/env";
import {
  RealtimeMessageEventSchema,
  type RealtimeMessageEvent,
} from "./contracts/message.contract";

type Handler = (evt: RealtimeMessageEvent) => void;
type TokenProvider = () => string | null;

function wsUrl(token: string): string {
  // apiBaseUrl looks like http://host:8080/api/v1 — the WS lives at the
  // origin root (/ws), so derive origin and swap the protocol to ws(s).
  const origin = new URL(env.apiBaseUrl).origin.replace(/^http/, "ws");
  return `${origin}/ws?token=${encodeURIComponent(token)}`;
}

class MessagingRealtime {
  private ws: WebSocket | null = null;
  private handlers = new Set<Handler>();
  private getToken: TokenProvider = () => null;
  private stopped = true;
  private backoff = 1000;
  private retry: ReturnType<typeof setTimeout> | null = null;

  setTokenProvider(fn: TokenProvider): void {
    this.getToken = fn;
  }

  subscribe(handler: Handler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  start(): void {
    this.stopped = false;
    if (this.ws) return;
    this.connect();
  }

  stop(): void {
    this.stopped = true;
    if (this.retry) clearTimeout(this.retry);
    this.retry = null;
    this.ws?.close();
    this.ws = null;
  }

  private connect(): void {
    const token = this.getToken();
    if (!token || this.stopped) return;

    let ws: WebSocket;
    try {
      ws = new WebSocket(wsUrl(token));
    } catch {
      this.scheduleReconnect();
      return;
    }
    this.ws = ws;

    ws.onopen = () => {
      this.backoff = 1000;
    };
    ws.onmessage = (e) => {
      try {
        const parsed = RealtimeMessageEventSchema.safeParse(JSON.parse(e.data));
        if (parsed.success) this.handlers.forEach((h) => h(parsed.data));
      } catch {
        /* ignore malformed frames */
      }
    };
    ws.onclose = () => {
      this.ws = null;
      if (!this.stopped) this.scheduleReconnect();
    };
    ws.onerror = () => {
      /* close handler drives reconnect */
    };
  }

  private scheduleReconnect(): void {
    if (this.retry) clearTimeout(this.retry);
    this.retry = setTimeout(() => this.connect(), this.backoff);
    this.backoff = Math.min(this.backoff * 2, 15_000);
  }
}

export const messagingRealtime = new MessagingRealtime();
