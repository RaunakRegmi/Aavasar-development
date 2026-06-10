/**
 * LAYER 2 — Session hooks
 * --------------------------------------------------------------
 * Thin React-Query / Zustand binding layer. Components only ever
 * touch the auth domain through these hooks — they never import
 * from `api/`, `application/`, or `store/` directly.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth.store";
import { signUp } from "../application/signUp.usecase";
import { logIn, logOut } from "../application/logIn.usecase";
import {
  requestPasswordReset,
  resetPassword,
} from "../application/forgotPassword.usecase";
import { updateProfile } from "../application/updateProfile.usecase";
import { changePassword } from "../application/changePassword.usecase";
import type {
  AuthSession,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LogInRequest,
  ResetPasswordRequest,
  SessionUser,
  SignUpRequest,
  UpdateProfileRequest,
} from "../contracts/auth.contract";

export function useSession(): AuthSession | null {
  return useAuthStore((s) => s.session);
}

export function useCurrentUser(): SessionUser | null {
  return useAuthStore((s) => s.session?.user ?? null);
}

export function useIsAuthenticated(): boolean {
  return useAuthStore((s) => s.session !== null);
}

export function useSignUp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SignUpRequest) => signUp(payload),
    onSuccess: () => {
      // Any queries that depend on auth state should be refetched.
      qc.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

export function useLogIn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: LogInRequest) => logIn(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["auth"] }),
  });
}

export function useLogOut() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: logOut,
    onSettled: () => qc.clear(),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordRequest) => requestPasswordReset(payload),
  });
}

export function useResetPassword() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ResetPasswordRequest) => resetPassword(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["auth"] }),
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfileRequest) => updateProfile(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["auth", "me"] }),
  });
}

export function useChangePassword() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) => changePassword(payload),
    // changePassword clears the auth store; drop every cached query so
    // the next navigation can't read stale data tied to the old session.
    onSettled: () => qc.clear(),
  });
}
