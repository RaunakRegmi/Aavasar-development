import type { AxiosError, AxiosResponse } from "axios";
import {
  ApiError,
  ForbiddenError,
  NetworkError,
  TimeoutError,
  UnauthorizedError,
  type ApiErrorBody,
} from "../errors";

/**
 * Response interceptor — normalizes everything to either a clean
 * AxiosResponse or one of our domain error classes. Upstream code
 * never sees raw AxiosError again.
 */
export function passthrough<T>(response: AxiosResponse<T>): AxiosResponse<T> {
  return response;
}

export function normalizeError(error: AxiosError<Partial<ApiErrorBody>>): Promise<never> {
  // Network failure (no response received)
  if (error.code === "ERR_NETWORK") {
    return Promise.reject(new NetworkError());
  }
  if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
    return Promise.reject(new TimeoutError());
  }

  const status = error.response?.status ?? 0;
  const data = error.response?.data ?? {};
  const body: ApiErrorBody = {
    code: data.code ?? "UNKNOWN",
    message: data.message ?? error.message ?? "Request failed",
    fields: data.fields,
    traceId: data.traceId,
  };

  if (status === 401) return Promise.reject(new UnauthorizedError(body));
  if (status === 403) return Promise.reject(new ForbiddenError(body));
  return Promise.reject(new ApiError(status, body));
}
