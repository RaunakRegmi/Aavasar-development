import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, useToast } from "@shared/ui";
import { AuthSplitLayout } from "@shared/layouts";
import { Icon } from "@shared/icons";
import {
  ForgotPasswordRequestSchema,
  useForgotPassword,
  type ForgotPasswordRequest,
} from "@features/auth";
import { routes } from "@shared/config/routes";

export default function ForgotPasswordPage() {
  const toast = useToast();
  const forgot = useForgotPassword();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(ForgotPasswordRequestSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    await forgot.mutateAsync(values);
    setSent(true);
    toast.success("Check your inbox", {
      description: "If the address is registered, a reset link is on its way.",
    });
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
          Reset your password
        </h1>
        <p
          style={{
            fontFamily: "var(--font-text)",
            fontSize: 16,
            color: "var(--text-muted)",
            margin: 0,
          }}
        >
          Enter your email and we&apos;ll send you a link to set a new one.
        </p>
      </div>

      {sent ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            alignItems: "flex-start",
            background: "var(--surface-1)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-md)",
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "var(--success-600)",
              fontFamily: "var(--font-text)",
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            <Icon name="MailCheck" size={20} />
            Check your inbox
          </div>
          <p
            style={{
              fontFamily: "var(--font-text)",
              fontSize: 14,
              lineHeight: 1.5,
              color: "var(--text-muted)",
              margin: 0,
            }}
          >
            If an account exists for this address, we&apos;ve sent reset
            instructions. The link expires in 30 minutes.
          </p>
          <Link
            to={routes.logIn}
            style={{
              fontFamily: "var(--font-text)",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--brand-700)",
              textDecoration: "none",
            }}
          >
            ← Back to sign in
          </Link>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          <Input
            label="Email"
            type="email"
            placeholder="you@university.edu"
            autoComplete="email"
            leading={<Icon name="Mail" size={18} />}
            error={errors.email?.message}
            {...register("email")}
          />
          <Button
            type="submit"
            variant="primary"
            size="lg"
            full
            disabled={isSubmitting}
            iconRight={<Icon name="ArrowRight" size={18} />}
          >
            {isSubmitting ? "Sending…" : "Send Reset Link"}
          </Button>
          <Link
            to={routes.logIn}
            style={{
              fontFamily: "var(--font-text)",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--brand-700)",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            ← Back to sign in
          </Link>
        </form>
      )}
    </AuthSplitLayout>
  );
}
