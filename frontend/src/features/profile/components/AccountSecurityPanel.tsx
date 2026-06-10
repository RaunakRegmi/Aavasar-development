/**
 * AccountSecurityPanel — the "Account Security" tile on every Profile
 * Dashboard. Two concerns:
 *
 *   (1) Change Password — uses `useChangePassword`. On success the hook
 *       clears the auth store + query cache, so the page navigates back
 *       to /log-in via the route guard (Rule 1: not signed in).
 *
 *   (2) Linked OAuth Providers — a read-only display for now. The list
 *       of provider identities lives on the backend (User → Account[])
 *       but is not yet exposed through /me; stubbing here keeps the
 *       layout honest and gives the panel a clear extension point.
 *
 * Validation: `ChangePasswordRequestSchema` is the SAME schema the
 * backend validates with — refines for "passwords match" and "new !=
 * current" run client-side too, so the user gets inline feedback
 * before the network round-trip.
 */
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Input, useToast } from "@shared/ui";
import { Icon, type IconName } from "@shared/icons";
import {
  ChangePasswordRequestSchema,
  useChangePassword,
  type ChangePasswordRequest,
} from "@features/auth";
import { ApiError } from "@shared/lib/transport";
import { routes } from "@shared/config/routes";

interface LinkedProvider {
  id: "google" | "github" | "linkedin";
  label: string;
  icon: IconName;
  linked: boolean;
}

/**
 * Until /me surfaces the Account rows, we render the catalogue as
 * "not linked". The buttons route the user through the standard OAuth
 * start endpoint — backend wires the same `account` row whether the
 * user lands via login or via this profile-level link.
 */
const PROVIDERS: ReadonlyArray<LinkedProvider> = [
  { id: "google", label: "Google", icon: "Mail", linked: false },
  { id: "github", label: "GitHub", icon: "Code", linked: false },
  { id: "linkedin", label: "LinkedIn", icon: "Linkedin", linked: false },
];

export function AccountSecurityPanel() {
  const navigate = useNavigate();
  const changePwd = useChangePassword();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordRequest>({
    resolver: zodResolver(ChangePasswordRequestSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await changePwd.mutateAsync(values);
      reset();
      toast.success("Password updated", {
        description: "Sign in again with your new password.",
      });
      // Hook already cleared the auth store; bounce to log-in explicitly
      // so the user sees the right page instead of the post-cache flash.
      navigate(routes.logIn, { replace: true });
    } catch (e) {
      if (e instanceof ApiError) {
        toast.error("Couldn't change password", { description: e.body.message });
      } else if (e instanceof Error) {
        toast.error("Update failed", { description: e.message });
      }
    }
  });

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {/* ---- Change password ---- */}
      <Card padding={28}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 6,
          }}
        >
          <Icon name="Lock" size={20} style={{ color: "var(--brand-700)" }} />
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 20,
              color: "var(--text-strong)",
              margin: 0,
            }}
          >
            Change Password
          </h3>
        </div>
        <p
          style={{
            fontFamily: "var(--font-text)",
            fontSize: 14,
            color: "var(--text-muted)",
            margin: "0 0 18px",
          }}
        >
          You'll be signed out of all devices after a successful change.
        </p>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 14, maxWidth: 480 }}>
          <Input
            label="Current Password"
            type="password"
            passwordToggle
            autoComplete="current-password"
            error={errors.currentPassword?.message}
            {...register("currentPassword")}
          />
          <Input
            label="New Password"
            type="password"
            passwordToggle
            autoComplete="new-password"
            helper="At least 8 characters with a letter and a number."
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />
          <Input
            label="Confirm New Password"
            type="password"
            passwordToggle
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <div>
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting || changePwd.isPending}
              iconLeft={<Icon name="Check" size={16} />}
            >
              {changePwd.isPending ? "Updating…" : "Update Password"}
            </Button>
          </div>
        </form>
      </Card>

      {/* ---- Linked OAuth providers ---- */}
      <Card padding={28}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <Icon name="Link" size={20} style={{ color: "var(--brand-700)" }} />
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 20,
              color: "var(--text-strong)",
              margin: 0,
            }}
          >
            Linked Accounts
          </h3>
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          {PROVIDERS.map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-sm)",
                padding: "14px 16px",
              }}
            >
              <span
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "var(--radius-sm)",
                  background: "var(--surface-2)",
                  color: "var(--ink-600)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon name={p.icon} size={20} />
              </span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "var(--font-text)",
                    fontWeight: 600,
                    fontSize: 15,
                    color: "var(--text-strong)",
                  }}
                >
                  {p.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-text)",
                    fontSize: 13,
                    color: "var(--text-subtle)",
                  }}
                >
                  {p.linked ? "Connected" : "Not connected"}
                </div>
              </div>
              <Button variant="outline" size="sm" type="button" disabled>
                {p.linked ? "Disconnect" : "Coming soon"}
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
