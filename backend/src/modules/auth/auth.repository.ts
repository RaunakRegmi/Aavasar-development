/**
 * Auth repository — owns refresh-token + password-reset rows. The user
 * row itself is owned by `UserRepository`, so this module never opens
 * `prisma.user` directly.
 */
import type { PrismaClient, RefreshToken } from "@prisma/client";

export class AuthRepository {
  constructor(private readonly db: PrismaClient) {}

  // ---- Refresh tokens ----

  createRefreshToken(input: {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<RefreshToken> {
    return this.db.refreshToken.create({ data: input });
  }

  findRefreshTokenById(id: string): Promise<RefreshToken | null> {
    return this.db.refreshToken.findUnique({ where: { id } });
  }

  /**
   * Atomic rotate: revoke the old token row (linking the replacement)
   * and insert the new one. Returns the new RefreshToken row.
   */
  rotateRefreshToken(input: {
    oldId: string;
    newId: string;
    userId: string;
    newTokenHash: string;
    newExpiresAt: Date;
  }): Promise<RefreshToken> {
    return this.db.$transaction(async (tx) => {
      await tx.refreshToken.update({
        where: { id: input.oldId },
        data: { revokedAt: new Date(), replacedById: input.newId },
      });
      return tx.refreshToken.create({
        data: {
          id: input.newId,
          userId: input.userId,
          tokenHash: input.newTokenHash,
          expiresAt: input.newExpiresAt,
        },
      });
    });
  }

  /** Revoke every active refresh token for a user (logout-all-devices). */
  revokeAllForUser(userId: string): Promise<{ count: number }> {
    return this.db.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  revokeById(id: string): Promise<void> {
    return this.db.refreshToken
      .update({ where: { id }, data: { revokedAt: new Date() } })
      .then(() => undefined);
  }

  // ---- Password resets ----

  createPasswordReset(input: { userId: string; tokenHash: string; expiresAt: Date }) {
    return this.db.passwordReset.create({ data: input });
  }

  findPasswordResetByTokenHash(tokenHash: string) {
    return this.db.passwordReset.findUnique({ where: { tokenHash } });
  }

  consumePasswordReset(id: string) {
    return this.db.passwordReset.update({
      where: { id },
      data: { consumedAt: new Date() },
    });
  }
}
