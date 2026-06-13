/**
 * Log In page — previously the /log-in route aliased to <SignUpPage>,
 * which shipped a broken Log In experience. This file replaces that
 * alias with a real form that runs the full L1→L6 pipeline:
 *
 *   L1  this file (RHF + zodResolver)
 *   L2  useLogIn() mutation hook
 *   L3  logIn() use case
 *   L4  authService.logIn()
 *   L5  http POST /auth/log-in (with refresh-on-401 wired)
 *   L6  LogInRequestSchema parsed in front, AuthSessionSchema parsed back
 */
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button, Checkbox, Input, useToast } from "@shared/ui";
import { AuthSplitLayout } from "@shared/layouts";
import { Icon } from "@shared/icons";
import {
  useLogIn,
  LogInRequestSchema,
  type LogInRequest,
} from "@features/auth";
import { ApiError } from "@shared/lib/transport";
import { env } from "@shared/lib/env";
import { routes } from "@shared/config/routes";

const OAUTH_PROVIDERS = [
  { name: "Google", provider: "google" },
  { name: "LinkedIn", provider: "linkedin" },
  { name: "GitHub", provider: "github" },
] as const;

function startOAuth(provider: string) {
  window.location.href = `${env.apiBaseUrl}/auth/oauth/${provider}/start`;
}

interface LocationState {
  from?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();
  const { t } = useTranslation();
  const logIn = useLogIn();
  const from = (location.state as LocationState | null)?.from;
  const oauthError = searchParams.get("error") === "oauth";

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LogInRequest>({
    resolver: zodResolver(LogInRequestSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const session = await logIn.mutateAsync(values);
      toast.success("Welcome back", {
        description: `Signed in as ${session.user.fullName}`,
      });
      if (from) {
        navigate(from, { replace: true });
        return;
      }
      if (!session.user.onboardingCompleted) navigate(routes.onboarding);
      else if (session.user.role === "recruiter")
        navigate(routes.recruiterDashboard);
      else navigate(routes.studentDashboard);
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.body.fields) {
          for (const [field, msgs] of Object.entries(e.body.fields)) {
            setError(field as keyof LogInRequest, {
              type: "server",
              message: msgs.join(" "),
            });
          }
        }
        toast.error("Couldn't sign you in", { description: e.body.message });
      } else if (e instanceof Error) {
        toast.error("Sign in failed", { description: e.message });
      }
    }
  });

  return (
    <AuthSplitLayout>
      <div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 34,
            color: "var(--text-strong)",
            margin: "0 0 6px",
          }}
        >
          {t("login.title")}
        </h1>
        <p
          style={{
            fontFamily: "var(--font-text)",
            fontSize: 16,
            color: "var(--text-muted)",
            margin: 0,
          }}
        >
          {t("login.subtitle")}
        </p>
      </div>

      {oauthError && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "var(--radius-md)",
            background: "var(--danger-50)",
            border: "1px solid var(--danger-200)",
            color: "var(--danger-800)",
            fontFamily: "var(--font-text)",
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <span>
            {t("login.oauthFailed")}
          </span>
          <button
            onClick={() => setSearchParams({})}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "inherit",
              padding: 0,
              lineHeight: 1,
            }}
            aria-label={t("login.dismiss")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      <form
        onSubmit={onSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 20 }}
      >
        <Input
          label={t("login.email")}
          type="email"
          placeholder={t("login.emailPlaceholder")}
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label={t("login.password")}
          passwordToggle
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Controller
            control={control}
            name="remember"
            render={({ field }) => (
              <Checkbox
                checked={field.value ?? false}
                onChange={(e) => field.onChange(e.target.checked)}
                label={t("login.remember")}
              />
            )}
          />
          <Link
            to={routes.forgotPassword}
            style={{
              fontFamily: "var(--font-text)",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--brand-700)",
              textDecoration: "none",
            }}
          >
            {t("login.forgot")}
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          full
          disabled={isSubmitting}
          iconRight={<Icon name="ArrowRight" size={18} />}
        >
          {isSubmitting ? t("login.submitting") : t("login.submit")}
        </Button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "var(--text-subtle)",
          }}
        >
          <span style={{ flex: 1, height: 1, background: "var(--border-default)" }} />
          <span
            style={{
              fontFamily: "var(--font-text)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.06em",
            }}
          >
            {t("common.or")}
          </span>
          <span style={{ flex: 1, height: 1, background: "var(--border-default)" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
          {OAUTH_PROVIDERS.map(({ name, provider }) => (
            <Button
              key={provider}
              variant="outline"
              type="button"
              onClick={() => startOAuth(provider)}
            >
              {name}
            </Button>
          ))}
        </div>

        <div
          style={{
            textAlign: "center",
            fontFamily: "var(--font-text)",
            fontSize: 14,
            color: "var(--text-muted)",
          }}
        >
          {t("login.noAccount")}{" "}
          <Link
            to={routes.signUp}
            style={{
              color: "var(--brand-700)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            {t("login.signUpLink")}
          </Link>
        </div>
      </form>
    </AuthSplitLayout>
  );
}
