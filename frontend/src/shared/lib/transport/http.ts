/**
 * LAYER 5 — Transport
 * --------------------------------------------------------------
 * The single axios instance every feature uses. Owns:
 *   • base URL + timeout
 *   • auth header injection
 *   • trace id stamping
 *   • normalized error mapping (ApiError / NetworkError / TimeoutError)
 *   • JSON envelope unwrap (we expect `{ data, meta }` from backend)
 *
 * Services (L4) NEVER call axios directly — they import `http` from here.
 * That keeps cross-cutting concerns (retries, telemetry, logging) in one
 * place instead of leaking into every feature.
 */
import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { env } from "../env";
import { attachAuthHeader } from "./interceptors/auth";
import { attachTraceHeader } from "./interceptors/trace";
import { normalizeError, passthrough } from "./interceptors/error";
import { installRefreshInterceptor } from "./interceptors/refresh";
import { logRequest, logResponse } from "./interceptors/devLog";

export interface ApiEnvelope<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
    [k: string]: unknown;
  };
}

function createHttp(): AxiosInstance {
  const instance = axios.create({
    baseURL: env.apiBaseUrl,
    timeout: 15_000,
    withCredentials: false,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  instance.interceptors.request.use(attachAuthHeader);
  instance.interceptors.request.use(attachTraceHeader);
  instance.interceptors.request.use(logRequest);
  // Note: order matters — the refresh interceptor must run BEFORE error
  // normalization, so it sees a raw AxiosError (still has `.config`) and
  // can retry once with the new bearer. Normalization is registered later
  // via `wireResponseInterceptors` so the refresh chain has been installed
  // by the auth boot provider.
  instance.interceptors.response.use(logResponse);
  instance.interceptors.response.use(passthrough, normalizeError);

  return instance;
}

export const http = createHttp();

/**
 * Wire the refresh-on-401 + auto-logout flow into the live axios instance.
 * Called once at boot (AuthBoot provider). Kept as a function rather than
 * a side-effect so tests can install their own behavior.
 */
export function wireRefresh(
  refresh: () => Promise<string | null>,
  onAuthFailure: () => void,
): void {
  installRefreshInterceptor(http, refresh, onAuthFailure);
}

/**
 * Helper that unwraps the standard `{ data, meta }` envelope.
 * Services compose this so they return domain objects directly.
 */
export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const res = await http.request<ApiEnvelope<T>>(config);
  return res.data.data;
}

/**
 * Same as `request` but returns the full envelope when meta (pagination,
 * cursors) is needed by the caller.
 */
export async function requestEnvelope<T>(
  config: AxiosRequestConfig,
): Promise<ApiEnvelope<T>> {
  const res = await http.request<ApiEnvelope<T>>(config);
  return res.data;
}
