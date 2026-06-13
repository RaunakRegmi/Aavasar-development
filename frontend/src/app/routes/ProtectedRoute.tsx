import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCurrentUser, useIsAuthenticated, type SessionUser } from "@features/auth";
import type { Role } from "@shared/lib/contracts";
import { routes } from "@shared/config/routes";

interface ProtectedRouteProps {
  /** When set, the route is only accessible to these roles. */
  allow?: Role[];
}

/**
 * Route guard. Rules, evaluated in order — first match wins:
 *
 *   (1) Not signed in              → bounce to /sign-up (remember origin
 *                                    in `location.state.from` for the
 *                                    post-login redirect).
 *
 *   (2) Signed in, onboarding NOT  → bounce to /onboarding (the only
 *       complete                      route an un-onboarded user may visit).
 *
 *   (3) Signed in, onboarding IS   → bounce AWAY from /onboarding to
 *       complete, AND on /onboarding   the appropriate dashboard. This is
 *                                    the "anti-loop" rule — without it, a
 *                                    user whose `onboardingCompleted` flag
 *                                    just flipped true is still on
 *                                    `/onboarding` and the wizard happily
 *                                    re-renders step 1.
 *
 *   (4) Wrong role                 → bounce to their own dashboard.
 *
 *   (5) Otherwise                  → render the nested route.
 */
export function ProtectedRoute({ allow }: ProtectedRouteProps) {
  const authed = useIsAuthenticated();
  const user = useCurrentUser();
  const location = useLocation();

  // (1) Auth gate
  if (!authed || !user) {
    return <Navigate to={routes.signUp} replace state={{ from: location.pathname }} />;
  }

  // (2) Force un-onboarded users onto the wizard
  //     Carry a `reason` in location.state so the onboarding page can
  //     display a contextual message ("finish setup before browsing").
  if (!user.onboardingCompleted && location.pathname !== routes.onboarding) {
    return (
      <Navigate
        to={routes.onboarding}
        replace
        state={{ onboardingReason: "incomplete" }}
      />
    );
  }

  // (3) Anti-loop: kick onboarded users OFF the wizard
  if (user.onboardingCompleted && location.pathname === routes.onboarding) {
    return <Navigate to={dashboardFor(user)} replace />;
  }

  // (4) Role gate
  if (allow && !allow.includes(user.role)) {
    return <Navigate to={dashboardFor(user)} replace />;
  }

  return <Outlet />;
}

/** Single source of truth for "where does this user belong by default?" */
function dashboardFor(user: SessionUser): string {
  return user.role === "recruiter" ? routes.recruiterDashboard : routes.studentDashboard;
}

/**
 * Inverse of ProtectedRoute — for the landing / log-in / sign-up routes.
 * If a remembered session is already present (it rehydrates synchronously
 * from localStorage on boot), send the user straight to where they belong
 * instead of showing the marketing/auth page. This is what makes "reopen
 * the tab → land on my dashboard" work within the 30-day remember window.
 */
export function GuestOnly() {
  const authed = useIsAuthenticated();
  const user = useCurrentUser();

  if (authed && user) {
    if (!user.onboardingCompleted) {
      return <Navigate to={routes.onboarding} replace />;
    }
    return <Navigate to={dashboardFor(user)} replace />;
  }

  return <Outlet />;
}
