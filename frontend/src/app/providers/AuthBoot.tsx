import { useEffect, useRef, type ReactNode } from "react";
import {
  registerTokenProvider,
  wireRefresh,
  ApiError,
  NetworkError,
  TimeoutError,
  UnauthorizedError,
} from "@shared/lib/transport";
import {
  selectAccessToken,
  useAuthStore,
  refreshSession,
  isSessionExpired,
} from "@features/auth";
import { useToast } from "@shared/ui";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Wire the transport's auth concerns at MODULE LOAD — i.e. the moment this
 * module is imported, before any component renders or any query fires.
 *
 * This is critical: the auth store rehydrates synchronously, so an authed
 * page's `/me` query is `enabled` and fires on first paint. If the token
 * provider were only registered inside a `useEffect` (which runs AFTER
 * children mount), that first request would go out with the default
 * `getToken = () => null` → no `Authorization` header → "Missing bearer
 * token", and the refresh interceptor wouldn't be installed yet to recover.
 */
registerTokenProvider(selectAccessToken);

/**
 * Auto-logout finalization, enriched (clear query cache + toast) once React
 * mounts via AuthBoot's effect. `refreshSession()` itself owns the decision
 * to clear the session (only on a definitive 401/403), so the default here
 * is a no-op — clearing unconditionally would log the user out on a
 * transient failure. We reassign this variable rather than re-installing the
 * interceptor, so `wireRefresh` is called exactly once (at module load).
 */
let onAuthFailure: () => void = () => {
  /* refreshSession owns the clear decision; nothing to finalize pre-React. */
};
wireRefresh(refreshSession, () => onAuthFailure());

/**
 * One-time wiring of cross-cutting concerns into the L5 transport:
 *
 *   1. Token provider — interceptor reads the latest access token.
 *   2. Refresh interceptor — 401 → exchange refresh token → retry once.
 *   3. Global query-error reporter — pushes a toast for any QUERY that
 *      fails. Mutations are NOT globally reported; pages catch those
 *      locally so the user gets one toast per action, not two.
 *   4. Boot-time expiry sweep — clears stale persisted sessions before
 *      the first request can fire with an expired token.
 *   5. Expiry watchdog — clears the session if it expires while the tab
 *      is still open.
 */
export function AuthBoot({ children }: { children: ReactNode }) {
  const toast = useToast();
  const qc = useQueryClient();
  const wiredRef = useRef(false);

  useEffect(() => {
    // Guard against StrictMode's intentional double-effect-invoke.
    if (wiredRef.current) return;
    wiredRef.current = true;

    // (1+2) Token provider + refresh interceptor are already wired at module
    //       load (see top of file). Here we just enrich the logout handler
    //       now that the query client + toast are available.
    onAuthFailure = () => {
      // refreshSession() owns the clear decision: it clears the store ONLY
      // on a definitive auth rejection (401/403). If a session still exists
      // here, the refresh failed transiently (server down / network) — keep
      // the user logged in and don't toast. Otherwise finalize the logout UX.
      if (useAuthStore.getState().session) return;
      qc.clear();
      toast.error("Signed out", {
        description: "Your session ended. Please log in to continue.",
      });
    };

    // (4) boot-time recovery — if a persisted access token is already
    //     expired, DON'T log the user out. Exchange the refresh token for
    //     a fresh session instead. refreshSession() self-heals: it sets a
    //     new session on success and clears only when the refresh token is
    //     missing/expired/rejected. This is what keeps a page reload from
    //     kicking the user out.
    const booted = useAuthStore.getState().session;
    if (booted && isSessionExpired()) {
      if (booted.refreshToken) {
        void refreshSession().then((token) => {
          // refreshSession clears the store ONLY on a definitive auth
          // failure (401/403). A transient failure (server down / network)
          // returns null but KEEPS the session — so only warn "expired" if
          // we were actually logged out. Otherwise it's a false alarm.
          if (!token && !useAuthStore.getState().session) {
            toast.info("Your session expired", {
              description: "Please sign in again to continue.",
            });
          }
        });
      } else {
        useAuthStore.getState().clear();
        toast.info("Your session expired", {
          description: "Please sign in again to continue.",
        });
      }
    }

    // (3) global query-error reporter — surfaces background fetch failures
    //     that no page is actively awaiting. Mutations have page-level
    //     catches; reporting them here would double-toast.
    const unsubQueries = qc.getQueryCache().subscribe((event) => {
      if (event.type !== "updated") return;
      if (event.query.state.status !== "error") return;
      const err = event.query.state.error;
      if (!err) return;
      reportTransportError(err, toast);
    });

    // (5) keep-alive watchdog — proactively refresh well before the access
    //     token expires so an open tab is never kicked out mid-session.
    //     Generous buffer (5 minutes) means even a long-running render or
    //     a flurry of concurrent queries can't race expiry. The watchdog
    //     ALSO fires on visibility-change so a tab that was backgrounded
    //     (laptop sleep, alt-tab) refreshes the moment it's foregrounded.
    //     Only fall back to a clean logout when there's no refresh token
    //     to renew with.
    const REFRESH_BUFFER_MS = 5 * 60_000;
    const tick = () => {
      const sess = useAuthStore.getState().session;
      if (!sess) return;
      const msLeft = Date.parse(sess.expiresAt) - Date.now();
      if (msLeft > REFRESH_BUFFER_MS) return; // not near expiry yet
      if (sess.refreshToken) {
        void refreshSession();
      } else if (msLeft <= 0) {
        // Truly expired AND no way to renew → finalize the logout.
        useAuthStore.getState().clear();
        toast.info("Your session expired", {
          description: "Sign in again to keep working.",
        });
      }
    };
    const interval = window.setInterval(tick, 30_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);

    return () => {
      unsubQueries();
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [toast, qc]);

  return <>{children}</>;
}

function reportTransportError(
  err: unknown,
  toast: ReturnType<typeof useToast>,
) {
  if (err instanceof UnauthorizedError) {
    // Suppress — the refresh interceptor handles this case explicitly.
    return;
  }
  if (err instanceof NetworkError) {
    toast.error("Network unreachable", {
      description: "Check your connection and try again.",
    });
    return;
  }
  if (err instanceof TimeoutError) {
    toast.warning("Request timed out", {
      description: "We'll keep trying — refresh if it persists.",
    });
    return;
  }
  if (err instanceof ApiError) {
    toast.error(err.body.message, {
      description: err.body.traceId ? `Trace: ${err.body.traceId}` : undefined,
    });
    return;
  }
  if (err instanceof Error && err.message) {
    toast.error("Something went wrong", { description: err.message });
  }
}
