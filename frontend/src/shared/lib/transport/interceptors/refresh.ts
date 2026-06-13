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

/**
 * Defensive header read — `config.headers` in axios v1 is an `AxiosHeaders`
 * instance whose property-name normalization isn't guaranteed across the
 * request lifecycle (set via plain object → may not expose bracket access
 * post-merge). `.get()` is the documented contract; bracket access is a
 * fallback for the unusual case where headers ended up as a plain object.
 */
function readHeader(
  headers: InternalAxiosRequestConfig["headers"] | undefined,
  name: string,
): string | undefined {
  if (!headers) return undefined;
  const fromGet =
    typeof (headers as { get?: (n: string) => unknown }).get === "function"
      ? (headers as { get: (n: string) => unknown }).get(name)
      : undefined;
  if (fromGet != null) return String(fromGet);
  const raw = (headers as Record<string, unknown>)[name];
  return raw == null ? undefined : String(raw);
}

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

      const skip = readHeader(original?.headers, "x-skip-auth-refresh") === "1";
      const alreadyRetried = original?._retryOnce === true;

      if (status !== 401 || !original || skip || alreadyRetried) {
        return Promise.reject(error);
      }

      original._retryOnce = true;

      // refresh() is single-flight upstream — concurrent 401s all await the
      // same promise, so we issue at most one /auth/refresh per expiry.
      const nextToken = await refresh();
      if (!nextToken) {
        onAuthFailure();
        return Promise.reject(error);
      }

      // Replay with the new bearer. attachAuthHeader will ALSO set this on
      // re-entry (from the live store), so both paths agree on the same
      // freshly-issued token.
      if (original.headers) {
        original.headers.set("Authorization", `Bearer ${nextToken}`);
      }
      return instance.request(original);
    },
  );
}
