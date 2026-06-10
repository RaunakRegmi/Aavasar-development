import type { InternalAxiosRequestConfig } from "axios";

/**
 * Auth interceptor — attaches the bearer token from the auth store
 * to every outbound request. Reading from the store (not a closure)
 * means the token is always fresh after refresh / login / logout.
 */
type TokenProvider = () => string | null;

let getToken: TokenProvider = () => null;

export function registerTokenProvider(provider: TokenProvider): void {
  getToken = provider;
}

export function attachAuthHeader(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  const token = getToken();
  if (token && config.headers) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
}
