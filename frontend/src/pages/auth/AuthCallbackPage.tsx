import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@features/auth";
import { authService } from "@features/auth/api/auth.service";
import { routes } from "@shared/config/routes";
import { PageLoader } from "@shared/ui/PageLoader";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (!accessToken) {
      navigate(routes.logIn, { replace: true });
      return;
    }

    const { setSession } = useAuthStore.getState();

    authService
      .getCurrentUser()
      .then((user) => {
        const expiresAt = new Date(
          Date.now() + 60 * 60 * 1000,
        ).toISOString();
        setSession({
          accessToken,
          refreshToken: refreshToken ?? undefined,
          expiresAt,
          user,
        });
        if (!user.onboardingCompleted) {
          navigate(routes.onboarding, { replace: true });
        } else if (user.role === "recruiter") {
          navigate(routes.recruiterDashboard, { replace: true });
        } else {
          navigate(routes.studentDashboard, { replace: true });
        }
      })
      .catch(() => {
        navigate(routes.logIn, { replace: true });
      });
  }, [navigate, params]);

  return <PageLoader />;
}
