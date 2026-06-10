/**
 * Refresh use case — read by the L5 transport interceptor when a request
 * returns 401. Single-flight: while a refresh is in progress, every other
 * 401 awaits the same promise instead of each issuing its own refresh.
 *
 * Returns the new access token, or null when no refresh is possible
 * (which signals the interceptor to log the user out).
 */
import { authService } from "../api/auth.service";
import { useAuthStore } from "../store/auth.store";

let inFlight: Promise<string | null> | null = null;

export function refreshSession(): Promise<string | null> {
  if (inFlight) return inFlight;

  inFlight = (async () => {
    const session = useAuthStore.getState().session;
    if (!session?.refreshToken) return null;
    try {
      const next = await authService.refreshSession({
        refreshToken: session.refreshToken,
      });
      useAuthStore.getState().setSession(next);
      return next.accessToken;
    } catch {
      useAuthStore.getState().clear();
      return null;
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}

/** Read-only check used at boot to clear stale persisted sessions. */
export function isSessionExpired(): boolean {
  const session = useAuthStore.getState().session;
  if (!session) return false;
  return Date.parse(session.expiresAt) <= Date.now();
}
