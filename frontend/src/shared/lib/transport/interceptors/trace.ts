import type { InternalAxiosRequestConfig } from "axios";

/**
 * Trace interceptor — stamps every request with an `x-request-id`.
 * Backend echoes the same id in error responses, so support can
 * pivot from a user-reported failure to logs in seconds.
 */
function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Lightweight fallback for older browsers / SSR.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function attachTraceHeader(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  if (config.headers) {
    config.headers.set("x-request-id", uuid());
  }
  return config;
}
