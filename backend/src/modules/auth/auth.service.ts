/**
 * AuthService — pure business logic for the auth flows.
 *
 * Knows nothing about Express. Takes its dependencies via the
 * constructor so we can swap any of them in tests for a fake/stub
 * (this is the heart of the platform's testability story).
 *
 * Public API (only what the controller needs):
 *   signUp, logIn, refresh, logOut, getCurrentUser,
 *   requestPasswordReset, resetPassword,
 *   loginOAuthUser  // called by the Passport callback path
 */
import crypto from "node:crypto";
import { UserRole } from "@prisma/client";
import {
  hashRefreshToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@lib/jwt";
import { hashPassword, verifyPassword } from "@lib/password";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@lib/errors";
import { env } from "@config/env";
import { logger } from "@config/logger";
import { email } from "@lib/email";
import { toSessionUser, type SessionUserDto } from "@modules/users/user.mapper";
import { UserRepository } from "@modules/users/user.repository";
import { AuthRepository } from "./auth.repository";
import type {
  ForgotPasswordRequest,
  LogInRequest,
  ResetPasswordRequest,
  SignUpRequest,
  UpdateProfileRequest,
} from "./auth.contracts";

export interface AuthSessionDto {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: SessionUserDto;
}

export class AuthService {
  constructor(
    private readonly users: UserRepository,
    private readonly authRepo: AuthRepository,
  ) {}

  // ---------- Sign up ----------

  async signUp(input: SignUpRequest): Promise<AuthSessionDto> {
    const existing = await this.users.findByEmail(input.email);
    if (existing) {
      throw new ConflictError("An account with that email already exists.", {
        fields: { email: ["This email is already registered."] },
      });
    }

    const passwordHash = await hashPassword(input.password);
    const user = await this.users.create({
      email: input.email,
      fullName: input.fullName,
      role: input.role as UserRole,
      passwordHash,
    });

    return this.issueSession(user.id, user.role, user.email, user.tokenVersion, user);
  }

  // ---------- Log in ----------

  async logIn(input: LogInRequest): Promise<AuthSessionDto> {
    const user = await this.users.findByEmail(input.email);
    if (!user || !user.passwordHash) {
      // Same error regardless of which side is wrong — no enumeration.
      throw new UnauthorizedError("Email or password is incorrect.");
    }
    const ok = await verifyPassword(input.password, user.passwordHash);
    if (!ok) throw new UnauthorizedError("Email or password is incorrect.");

    return this.issueSession(user.id, user.role, user.email, user.tokenVersion, user, input.remember);
  }

  // ---------- Refresh ----------

  async refresh(rawRefreshToken: string): Promise<AuthSessionDto> {
    let claims;
    try {
      claims = verifyRefreshToken(rawRefreshToken);
    } catch {
      throw new UnauthorizedError("Refresh token is invalid or expired.");
    }

    const record = await this.authRepo.findRefreshTokenById(claims.jti);
    const tokenHash = hashRefreshToken(rawRefreshToken);

    // We do NOT rotate the refresh token on every refresh. Rotation +
    // "invalidate all sessions on replay" caused a cascading lockout:
    // two tabs (or StrictMode, or a retried request) would present the
    // same just-rotated token, trip replay, bump tokenVersion, and reject
    // every outstanding token until a fresh login. A stable refresh token
    // (short access token + sliding 30-day refresh window) avoids that.
    // On a mismatch we reject THIS request only — never burn the family.
    if (!record || record.tokenHash !== tokenHash || record.revokedAt) {
      logger.warn({ event: "auth.refresh.rejected", userId: claims.sub });
      throw new UnauthorizedError("Refresh token rejected.");
    }
    if (record.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedError("Refresh token expired.");
    }

    const user = await this.users.findById(claims.sub);
    if (!user) throw new UnauthorizedError("Account not found.");
    // tokenVersion still hard-invalidates on password change / logout-all.
    if (user.tokenVersion !== claims.tokenVersion) {
      throw new UnauthorizedError("Session ended by a security event.");
    }

    // Keep the SAME refresh token; just slide its expiry forward so an
    // active "remember me" session stays alive. Re-issue only the short
    // access token.
    const remember = claims.remember ?? true;
    const ttl = remember
      ? env.jwt.refreshTtlRememberSeconds
      : env.jwt.refreshTtlSessionSeconds;
    await this.authRepo.touchRefreshToken(record.id, new Date(Date.now() + ttl * 1000));

    const accessToken = signAccessToken({ sub: user.id, role: user.role, email: user.email });
    return {
      accessToken,
      refreshToken: rawRefreshToken,
      expiresAt: new Date(Date.now() + env.jwt.accessTtlSeconds * 1000).toISOString(),
      user: toSessionUser(user),
    };
  }

  // ---------- Log out ----------

  async logOut(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      try {
        const claims = verifyRefreshToken(refreshToken);
        if (claims.sub === userId) {
          await this.authRepo.revokeById(claims.jti);
          return;
        }
      } catch {
        // Fall through — best-effort cleanup.
      }
    }
    await this.authRepo.revokeAllForUser(userId);
  }

  // ---------- Me ----------

  async getCurrentUser(userId: string): Promise<SessionUserDto> {
    const user = await this.users.findById(userId);
    if (!user) throw new NotFoundError("User no longer exists.");
    return toSessionUser(user);
  }

  // ---------- Update profile ----------

  /**
   * Patch the current user's profile. Used by:
   *   • onboarding wizard — to push `avatarUrl` after the upload
   *     succeeds and to flip `onboardingCompleted` at finalize time
   *   • the future /profile/edit page
   *
   * Caller is identified by `userId` — the controller resolves it from
   * the bearer token, so a user can only patch themselves.
   *
   * Precondition: when `onboardingCompleted` is being set to `true` the
   * user MUST already have a non-empty `headline` and at least one
   * `skill`. The Zod schema on the wire already requires these in the
   * same request; this check also covers the case where a rogue caller
   * sends `onboardingCompleted: true` with nothing else.
   */
  async updateProfile(userId: string, patch: UpdateProfileRequest): Promise<SessionUserDto> {
    const user = await this.users.findById(userId);
    if (!user) throw new NotFoundError("User no longer exists.");

    if (patch.onboardingCompleted === true) {
      const resolvedHeadline = patch.headline ?? user.headline;
      const resolvedSkills = patch.skills ?? user.skills;
      if (!resolvedHeadline || !resolvedSkills || resolvedSkills.length === 0) {
        throw new ValidationError(
          {
            onboardingCompleted: [
              "To complete onboarding you must provide a professional headline and at least one skill.",
            ],
          },
          "Onboarding cannot be completed — required fields are missing.",
        );
      }
    }

    const updated = await this.users.update(userId, {
      ...(patch.fullName !== undefined ? { fullName: patch.fullName } : {}),
      ...(patch.avatarUrl !== undefined ? { avatarUrl: patch.avatarUrl } : {}),
      ...(patch.bannerUrl !== undefined ? { bannerUrl: patch.bannerUrl } : {}),
      ...(patch.headline !== undefined ? { headline: patch.headline } : {}),
      ...(patch.bio !== undefined ? { bio: patch.bio } : {}),
      ...(patch.skills !== undefined ? { skills: patch.skills } : {}),
      ...(patch.onboardingCompleted !== undefined
        ? { onboardingCompleted: patch.onboardingCompleted }
        : {}),
    });
    return toSessionUser(updated);
  }

  // ---------- Change password (authenticated user) ----------

  async changePassword(
    userId: string,
    input: { currentPassword: string; newPassword: string },
  ): Promise<void> {
    const user = await this.users.findById(userId);
    if (!user || !user.passwordHash) {
      // OAuth-only user trying to "change" a password they never had.
      throw new UnauthorizedError("Set a password from your account settings first.");
    }
    const ok = await verifyPassword(input.currentPassword, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedError("Current password is incorrect.");
    }
    const newHash = await hashPassword(input.newPassword);
    // tokenVersion bump = force every other device to re-auth.
    await this.users.update(userId, {
      passwordHash: newHash,
      tokenVersion: { increment: 1 },
    });
    // Revoke all refresh tokens for completeness — bump is the strong
    // guarantee, this is the visible/auditable signal.
    await this.authRepo.revokeAllForUser(userId);
  }

  // ---------- Forgot password ----------

  /**
   * NEVER reveals whether the email is registered (account-enumeration
   * defence). Always resolves successfully.
   */
  async requestPasswordReset(input: ForgotPasswordRequest): Promise<void> {
    const user = await this.users.findByEmail(input.email);
    if (!user) {
      logger.info({ event: "auth.password.reset.miss", email: input.email });
      return;
    }
    const rawToken = crypto.randomBytes(32).toString("base64url");
    await this.authRepo.createPasswordReset({
      userId: user.id,
      tokenHash: crypto.createHash("sha256").update(rawToken).digest("hex"),
      expiresAt: new Date(Date.now() + 30 * 60_000), // 30 min
    });
    const resetLink = `${env.frontendOrigin}/reset-password?token=${rawToken}`;
    await email.send({
      to: user.email,
      subject: "Reset your Aavasar password",
      text: `Hi ${user.fullName},\n\nWe received a request to reset your Aavasar password. Click the link below to set a new one:\n\n${resetLink}\n\nThis link expires in 30 minutes. If you didn't request this, you can safely ignore this email.\n\n— The Aavasar Team`,
      html: `<p>Hi ${user.fullName},</p><p>We received a request to reset your Aavasar password. Click the button below to set a new one:</p><p><a href="${resetLink}" style="display:inline-block;padding:12px 24px;background:#4338ca;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;">Reset Password</a></p><p>This link expires in 30 minutes. If you didn't request this, you can safely ignore this email.</p><p>— The Aavasar Team</p>`,
    });
    logger.info({ event: "auth.password.reset.issue", userId: user.id });
  }

  // ---------- Reset password ----------

  async resetPassword(input: ResetPasswordRequest): Promise<AuthSessionDto> {
    const tokenHash = crypto.createHash("sha256").update(input.token).digest("hex");
    const record = await this.authRepo.findPasswordResetByTokenHash(tokenHash);
    if (!record || record.consumedAt || record.expiresAt.getTime() <= Date.now()) {
      throw new ValidationError(
        { token: ["Reset link is invalid or has expired."] },
        "Reset link no longer valid.",
      );
    }
    const passwordHash = await hashPassword(input.password);
    const user = await this.users.update(record.userId, {
      passwordHash,
      tokenVersion: { increment: 1 }, // kill all outstanding sessions
    });
    await this.authRepo.consumePasswordReset(record.id);

    return this.issueSession(user.id, user.role, user.email, user.tokenVersion, user);
  }

  // ---------- OAuth login (called by Passport callback) ----------

  async loginOAuthUser(input: {
    provider: "google" | "linkedin" | "github";
    subject: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
  }): Promise<AuthSessionDto> {
    // Bind by (provider, subject) first; fall back to email match so a
    // user who originally signed up locally can later link a provider.
    let user = await this.users.findByOAuth(input.provider, input.subject);
    if (!user) {
      user = await this.users.findByEmail(input.email);
      if (!user) {
        user = await this.users.create({
          email: input.email,
          fullName: input.fullName,
          role: UserRole.student,
          avatarUrl: input.avatarUrl ?? null,
        });
        // OAuth signups are inherently email-verified by the IdP.
        user = await this.users.update(user.id, { verified: true });
      }
      await this.users.linkOAuth(user.id, input.provider, input.subject);
    }
    return this.issueSession(user.id, user.role, user.email, user.tokenVersion, user);
  }

  // ---------- Internal helpers ----------

  private async issueSession(
    userId: string,
    role: UserRole,
    email: string,
    tokenVersion: number,
    userRow: Parameters<typeof toSessionUser>[0],
    remember = true,
  ): Promise<AuthSessionDto> {
    const accessToken = signAccessToken({ sub: userId, role, email });
    const jti = crypto.randomUUID();
    // "Remember me" → effectively-forever sliding window; unchecked → a
    // short session token that the frontend also drops on tab close.
    const refreshTtl = remember
      ? env.jwt.refreshTtlRememberSeconds
      : env.jwt.refreshTtlSessionSeconds;
    const refreshToken = signRefreshToken(
      { sub: userId, jti, tokenVersion, remember },
      refreshTtl,
    );
    const refreshExpiresAt = new Date(Date.now() + refreshTtl * 1000);

    await this.authRepo.createRefreshToken({
      id: jti,
      userId,
      tokenHash: hashRefreshToken(refreshToken),
      expiresAt: refreshExpiresAt,
    });

    return {
      accessToken,
      refreshToken,
      expiresAt: new Date(Date.now() + env.jwt.accessTtlSeconds * 1000).toISOString(),
      user: toSessionUser(userRow),
    };
  }
}
