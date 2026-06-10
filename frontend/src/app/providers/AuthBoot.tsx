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

    // (1) tokens
    registerTokenProvider(selectAccessToken);

    // (4) boot-time session sweep — runs before any query fires
    if (useAuthStore.getState().clearIfExpired()) {
      toast.info("Your session expired", {
        description: "Please sign in again to continue.",
      });
    }

    // (2) refresh / auto-logout
    wireRefresh(refreshSession, () => {
      useAuthStore.getState().clear();
      qc.clear();
      toast.error("Signed out", {
        description: "Your session ended. Please log in to continue.",
      });
    });

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

    // (5) expiry watchdog — clear automatically while the tab is open
    const interval = window.setInterval(() => {
      if (isSessionExpired()) {
        useAuthStore.getState().clear();
        toast.info("Your session expired", {
          description: "Sign in again to keep working.",
        });
      }
    }, 60_000);

    return () => {
      unsubQueries();
      window.clearInterval(interval);
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
