/**
 * LAYER 4 — Auth service (feature API adapter)
 * --------------------------------------------------------------
 * Maps endpoints to domain calls. Responsibilities:
 *   • know the URL of each auth endpoint (and nothing else)
 *   • use L5 `http` to make the call
 *   • parse the wire payload through L6 Zod schemas
 *   • throw if the contract is violated (loud, not silent)
 *
 * Services NEVER mutate global state. They return promises.
 * Use-cases (L3) and hooks (L2) handle side effects.
 */
import { request } from "@shared/lib/transport";
import {
  AuthSessionSchema,
  type AuthSession,
  type ForgotPasswordRequest,
  type LogInRequest,
  type RefreshSessionRequest,
  type ResetPasswordRequest,
  type SessionUser,
  type SignUpRequest,
  SessionUserSchema,
  type UpdateProfileRequest,
} from "../contracts/auth.contract";

export const authService = {
  async signUp(payload: SignUpRequest): Promise<AuthSession> {
    const raw = await request<unknown>({
      method: "POST",
      url: "/auth/sign-up",
      data: payload,
    });
    return AuthSessionSchema.parse(raw);
  },

  async logIn(payload: LogInRequest): Promise<AuthSession> {
    const raw = await request<unknown>({
      method: "POST",
      url: "/auth/log-in",
      data: payload,
    });
    return AuthSessionSchema.parse(raw);
  },

  async logOut(): Promise<void> {
    await request<unknown>({ method: "POST", url: "/auth/log-out" });
  },

  async getCurrentUser(): Promise<SessionUser> {
    const raw = await request<unknown>({ method: "GET", url: "/auth/me" });
    return SessionUserSchema.parse(raw);
  },

  async updateProfile(payload: UpdateProfileRequest): Promise<SessionUser> {
    const raw = await request<unknown>({
      method: "PATCH",
      url: "/auth/me",
      data: payload,
    });
    return SessionUserSchema.parse(raw);
  },

  async changePassword(payload: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<void> {
    await request<unknown>({
      method: "PATCH",
      url: "/auth/password",
      data: payload,
    });
  },

  async forgotPassword(payload: ForgotPasswordRequest): Promise<void> {
    await request<unknown>({
      method: "POST",
      url: "/auth/forgot-password",
      data: payload,
    });
  },

  async resetPassword(payload: ResetPasswordRequest): Promise<AuthSession> {
    const raw = await request<unknown>({
      method: "POST",
      url: "/auth/reset-password",
      data: { token: payload.token, password: payload.password },
    });
    return AuthSessionSchema.parse(raw);
  },

  /**
   * Refresh exchange — kept SEPARATE from the L5 retry interceptor so that
   * it doesn't itself trigger a refresh loop on 401. The interceptor calls
   * this method directly, never through the normal http pipeline guards.
   */
  async refreshSession(payload: RefreshSessionRequest): Promise<AuthSession> {
    const raw = await request<unknown>({
      method: "POST",
      url: "/auth/refresh",
      data: payload,
      // signal a "do not refresh me" intent — read by refresh interceptor
      headers: { "x-skip-auth-refresh": "1" },
    });
    return AuthSessionSchema.parse(raw);
  },
};

export type AuthService = typeof authService;
