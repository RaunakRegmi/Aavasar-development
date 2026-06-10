/**
 * Forgot-password / reset-password use cases. Recovery never logs the user
 * in by itself — the reset step issues a fresh AuthSession, but the
 * "request a link" step is a no-op success even if the email isn't
 * registered (privacy: don't leak which addresses exist).
 */
import { authService } from "../api/auth.service";
import {
  ForgotPasswordRequestSchema,
  ResetPasswordRequestSchema,
  type AuthSession,
  type ForgotPasswordRequest,
  type ResetPasswordRequest,
} from "../contracts/auth.contract";
import { useAuthStore } from "../store/auth.store";

export async function requestPasswordReset(
  input: ForgotPasswordRequest,
): Promise<void> {
  const payload = ForgotPasswordRequestSchema.parse(input);
  await authService.forgotPassword(payload);
}

export async function resetPassword(
  input: ResetPasswordRequest,
): Promise<AuthSession> {
  const payload = ResetPasswordRequestSchema.parse(input);
  const session = await authService.resetPassword(payload);
  useAuthStore.getState().setSession(session);
  return session;
}
