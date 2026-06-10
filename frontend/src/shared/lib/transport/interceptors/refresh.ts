/**
 * Refresh interceptor — catches 401 responses and tries ONE refresh round
 * before propagating the failure. The refresh use-case itself uses an
 * `x-skip-auth-refresh: 1` header so we don't recursively refresh the
 * refresh call.
 *
 * Wired into the L5 transport at boot via `installRefreshInterceptor`.
 * Kept here (not in `http.ts`) so the transport stays a thin shell —
 * everything auth-aware lives in this file.
 */
import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

interface RetryConfig extends InternalAxiosRequestConfig {
  _retryOnce?: boolean;
}

type RefreshFn = () => Promise<string | null>;
type LogoutFn = () => void;

export function installRefreshInterceptor(
  instance: AxiosInstance,
  refresh: RefreshFn,
  onAuthFailure: LogoutFn,
): void {
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const original = error.config as RetryConfig | undefined;
      const status = error.response?.status;

      const skip = original?.headers?.["x-skip-auth-refresh"] === "1";
      const alreadyRetried = original?._retryOnce === true;

      if (status !== 401 || !original || skip || alreadyRetried) {
        return Promise.reject(error);
      }

      original._retryOnce = true;

      const nextToken = await refresh();
      if (!nextToken) {
        onAuthFailure();
        return Promise.reject(error);
      }

      // Replay with the new bearer.
      if (original.headers) {
        original.headers.set("Authorization", `Bearer ${nextToken}`);
      }
      return instance.request(original);
    },
  );
}
