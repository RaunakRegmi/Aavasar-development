/**
 * Sign-up page — exercises ALL six layers in one form submission:
 *
 *   L1 Presentation (this file, RHF + zodResolver)
 *      └─▶ L2 useSignUp() hook  (features/auth/hooks)
 *          └─▶ L3 signUp() use case  (features/auth/application)
 *              ├─ L6 SignUpRequestSchema.parse(input)  (contracts)
 *              └─▶ L4 authService.signUp(payload)  (api)
 *                  └─▶ L5 http POST /auth/sign-up  (transport)
 *                      ↓ wire ↑
 *                  L5 interceptor — refresh-on-401, normalize errors
 *                  L4 AuthSessionSchema.parse(response)
 *                  L3 useAuthStore.setSession(session)
 *                  L2 React Query invalidation
 *                  L1 navigate → /onboarding (or dashboard)
 *
 * Error reporting: validation errors are RHF-driven (live inline);
 * server errors are surfaced as toasts via the global ToastProvider.
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button, Checkbox, Input, SegmentedControl, useToast } from "@shared/ui";
import { AuthSplitLayout } from "@shared/layouts";
import { Icon } from "@shared/icons";
import {
  SignUpFormSchema,
  useSignUp,
  type SignUpFormValues,
  type SignUpRequest,
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

type Role = "student" | "recruiter";

export default function SignUpPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation();
  const [role, setRole] = useState<Role>("student");
  const [agree, setAgree] = useState(false);
  const signUp = useSignUp();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    // `confirmPassword` is UX-only — it never crosses the wire.
    const { confirmPassword: _confirmPassword, ...rest } = values;
    void _confirmPassword;
    const payload: SignUpRequest = {
      ...rest,
      role,
      agreedToTerms: true,
    };
    try {
      const session = await signUp.mutateAsync(payload);
      toast.success("Account created", {
        description: `Welcome to Aavasar, ${session.user.fullName.split(" ")[0]}.`,
      });
      if (!session.user.onboardingCompleted) navigate(routes.onboarding);
      else if (session.user.role === "recruiter")
        navigate(routes.recruiterDashboard);
      else navigate(routes.studentDashboard);
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.body.fields) {
          for (const [field, msgs] of Object.entries(e.body.fields)) {
            // Only surface field errors that map onto our form schema.
            if (field === "fullName" || field === "email" || field === "password") {
              setError(field as keyof SignUpFormValues, {
                type: "server",
                message: msgs.join(" "),
              });
            }
          }
        }
        toast.error("Couldn't create your account", {
          description: e.body.message,
        });
      } else if (e instanceof Error) {
        toast.error("Sign up failed", { description: e.message });
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
          {t("signUp.title")}
        </h1>
        <p
          style={{
            fontFamily: "var(--font-text)",
            fontSize: 16,
            color: "var(--text-muted)",
            margin: 0,
          }}
        >
          {t("signUp.subtitle")}
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 20 }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-text)",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text-strong)",
              marginBottom: 8,
            }}
          >
            {t("signUp.joinAs")}
          </div>
          <SegmentedControl<Role>
            value={role}
            onChange={setRole}
            options={[
              { value: "student", label: t("signUp.student"), icon: <Icon name="GraduationCap" size={18} /> },
              { value: "recruiter", label: t("signUp.recruiter"), icon: <Icon name="Briefcase" size={18} /> },
            ]}
          />
        </div>

        <Input
          label={t("signUp.fullName")}
          placeholder={t("signUp.fullNamePlaceholder")}
          autoComplete="name"
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <Input
          label={role === "student" ? t("signUp.campusEmail") : t("signUp.workEmail")}
          type="email"
          placeholder={
            role === "student" ? t("signUp.studentEmailPlaceholder") : t("signUp.recruiterEmailPlaceholder")
          }
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label={t("signUp.password")}
          passwordToggle
          autoComplete="new-password"
          helper={t("signUp.passwordHelper")}
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label={t("signUp.confirmPassword")}
          passwordToggle
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Checkbox
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          label={t("signUp.agree")}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          full
          disabled={!agree || isSubmitting}
        >
          {isSubmitting ? t("signUp.submitting") : t("signUp.submit")}
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
          {t("signUp.haveAccount")}{" "}
          <Link
            to={routes.logIn}
            style={{
              color: "var(--brand-700)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            {t("signUp.loginLink")}
          </Link>
        </div>
      </form>
    </AuthSplitLayout>
  );
}
