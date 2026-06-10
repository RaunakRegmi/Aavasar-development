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
import { routes } from "@shared/config/routes";

type Role = "student" | "recruiter";

export default function SignUpPage() {
  const navigate = useNavigate();
  const toast = useToast();
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
          Create your account
        </h1>
        <p
          style={{
            fontFamily: "var(--font-text)",
            fontSize: 16,
            color: "var(--text-muted)",
            margin: 0,
          }}
        >
          Join the community and start your journey today.
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
            I want to join as a:
          </div>
          <SegmentedControl<Role>
            value={role}
            onChange={setRole}
            options={[
              { value: "student", label: "Student", icon: <Icon name="GraduationCap" size={18} /> },
              { value: "recruiter", label: "Recruiter", icon: <Icon name="Briefcase" size={18} /> },
            ]}
          />
        </div>

        <Input
          label="Full Name"
          placeholder="John Doe"
          autoComplete="name"
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <Input
          label={role === "student" ? "Campus Email" : "Work Email"}
          type="email"
          placeholder={
            role === "student" ? "you@university.edu" : "you@company.com"
          }
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          passwordToggle
          autoComplete="new-password"
          helper="8+ characters, with at least one letter and one number."
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Confirm Password"
          passwordToggle
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Checkbox
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          label="I agree to the Terms of Service and Privacy Policy."
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          full
          disabled={!agree || isSubmitting}
        >
          {isSubmitting ? "Creating Account…" : "Create Account"}
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
            OR CONTINUE WITH
          </span>
          <span style={{ flex: 1, height: 1, background: "var(--border-default)" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {/* TODO[oauth]: wire to /auth/oauth/{google,linkedin}/start once backend exists */}
          <Button
            variant="outline"
            type="button"
            onClick={() =>
              toast.info("Coming soon", {
                description: "Google sign-in is being wired up.",
              })
            }
          >
            Google
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() =>
              toast.info("Coming soon", {
                description: "LinkedIn sign-in is being wired up.",
              })
            }
          >
            LinkedIn
          </Button>
        </div>

        <div
          style={{
            textAlign: "center",
            fontFamily: "var(--font-text)",
            fontSize: 14,
            color: "var(--text-muted)",
          }}
        >
          Already have an account?{" "}
          <Link
            to={routes.logIn}
            style={{
              color: "var(--brand-700)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Log in
          </Link>
        </div>
      </form>
    </AuthSplitLayout>
  );
}
