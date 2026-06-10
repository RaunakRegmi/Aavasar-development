import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, useToast } from "@shared/ui";
import { AuthSplitLayout } from "@shared/layouts";
import { Icon } from "@shared/icons";
import {
  ResetPasswordRequestSchema,
  useResetPassword,
  type ResetPasswordRequest,
} from "@features/auth";
import { ApiError } from "@shared/lib/transport";
import { routes } from "@shared/config/routes";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [params] = useSearchParams();
  const reset = useResetPassword();
  const token = params.get("token") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordRequest>({
    resolver: zodResolver(ResetPasswordRequestSchema),
    defaultValues: { token, password: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (!token) {
      toast.warning("Missing reset token", {
        description: "Open the reset link from your email again.",
      });
    }
  }, [token, toast]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const session = await reset.mutateAsync(values);
      toast.success("Password updated", {
        description: `Welcome back, ${session.user.fullName.split(" ")[0]}.`,
      });
      if (!session.user.onboardingCompleted) navigate(routes.onboarding);
      else if (session.user.role === "recruiter")
        navigate(routes.recruiterDashboard);
      else navigate(routes.studentDashboard);
    } catch (e) {
      if (e instanceof ApiError) {
        toast.error("Couldn't reset password", {
          description: e.body.message,
        });
      } else if (e instanceof Error) {
        toast.error("Reset failed", { description: e.message });
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
          Set a new password
        </h1>
        <p
          style={{
            fontFamily: "var(--font-text)",
            fontSize: 16,
            color: "var(--text-muted)",
            margin: 0,
          }}
        >
          Choose a password you haven&apos;t used before. We&apos;ll sign you in once you save.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 20 }}
      >
        <input type="hidden" {...register("token")} />
        <Input
          label="New password"
          passwordToggle
          autoComplete="new-password"
          helper="Must be at least 8 characters."
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Confirm new password"
          passwordToggle
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Button
          type="submit"
          variant="primary"
          size="lg"
          full
          disabled={isSubmitting || !token}
          iconRight={<Icon name="Check" size={18} />}
        >
          {isSubmitting ? "Saving…" : "Save & Sign In"}
        </Button>
      </form>
    </AuthSplitLayout>
  );
}
