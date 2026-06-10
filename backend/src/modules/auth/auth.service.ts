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

    return this.issueSession(user.id, user.role, user.email, user.tokenVersion, user);
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

    if (!record || record.tokenHash !== tokenHash) {
      // Token presented does not match the row → potential replay.
      // Kill all sessions for the claimed user as a precaution.
      await this.users.invalidateAllSessions(claims.sub);
      logger.warn({ event: "auth.refresh.mismatch", userId: claims.sub });
      throw new UnauthorizedError("Refresh token rejected.");
    }
    if (record.revokedAt) {
      // The exact row was revoked but still presented → almost certainly
      // a stolen token replay. Burn the session family.
      await this.users.invalidateAllSessions(claims.sub);
      logger.warn({ event: "auth.refresh.replay", userId: claims.sub });
      throw new UnauthorizedError("Refresh token has been revoked.");
    }
    if (record.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedError("Refresh token expired.");
    }

    const user = await this.users.findById(claims.sub);
    if (!user) throw new UnauthorizedError("Account not found.");
    if (user.tokenVersion !== claims.tokenVersion) {
      throw new UnauthorizedError("Session ended by a security event.");
    }

    // Rotate.
    const newId = crypto.randomUUID();
    const newRefreshToken = signRefreshToken({
      sub: user.id,
      jti: newId,
      tokenVersion: user.tokenVersion,
    });
    const newExpiresAt = new Date(Date.now() + env.jwt.refreshTtlSeconds * 1000);

    await this.authRepo.rotateRefreshToken({
      oldId: record.id,
      newId,
      userId: user.id,
      newTokenHash: hashRefreshToken(newRefreshToken),
      newExpiresAt,
    });

    const accessToken = signAccessToken({ sub: user.id, role: user.role, email: user.email });
    return {
      accessToken,
      refreshToken: newRefreshToken,
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
   */
  async updateProfile(userId: string, patch: UpdateProfileRequest): Promise<SessionUserDto> {
    const user = await this.users.findById(userId);
    if (!user) throw new NotFoundError("User no longer exists.");
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
    // TODO[email]: dispatch /reset-password?token=<rawToken> via the
    // notifications service. Keeping the email out-of-band keeps the
    // service layer agnostic of transport.
    logger.info({ event: "auth.password.reset.issue", userId: user.id, rawToken });
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
  ): Promise<AuthSessionDto> {
    const accessToken = signAccessToken({ sub: userId, role, email });
    const jti = crypto.randomUUID();
    const refreshToken = signRefreshToken({ sub: userId, jti, tokenVersion });
    const refreshExpiresAt = new Date(Date.now() + env.jwt.refreshTtlSeconds * 1000);

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
