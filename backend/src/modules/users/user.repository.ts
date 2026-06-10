/**
 * User repository — the ONLY module that talks to `prisma.user`.
 *
 * The repository is a thin wrapper: no business rules, no auth checks.
 * Everything that needs a User does so through here, so we can later
 * swap Prisma for something else without touching services.
 */
import type { Prisma, PrismaClient, User, UserRole } from "@prisma/client";

export class UserRepository {
  constructor(private readonly db: PrismaClient) {}

  findById(id: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { email: email.toLowerCase() } });
  }

  findByOAuth(provider: "google" | "linkedin" | "github", subject: string): Promise<User | null> {
    return this.db.user.findFirst({
      where: { oauthAccounts: { some: { provider, subject } } },
    });
  }

  create(input: {
    email: string;
    fullName: string;
    role: UserRole;
    passwordHash?: string | null;
    avatarUrl?: string | null;
  }): Promise<User> {
    return this.db.user.create({
      data: {
        email: input.email.toLowerCase(),
        fullName: input.fullName,
        role: input.role,
        passwordHash: input.passwordHash ?? null,
        avatarUrl: input.avatarUrl ?? null,
      },
    });
  }

  update(id: string, patch: Prisma.UserUpdateInput): Promise<User> {
    return this.db.user.update({ where: { id }, data: patch });
  }

  /** Bumps `tokenVersion` to invalidate every outstanding refresh token. */
  invalidateAllSessions(userId: string): Promise<User> {
    return this.db.user.update({
      where: { id: userId },
      data: { tokenVersion: { increment: 1 } },
    });
  }

  linkOAuth(userId: string, provider: "google" | "linkedin" | "github", subject: string) {
    return this.db.oAuthAccount.upsert({
      where: { provider_subject: { provider, subject } },
      create: { userId, provider, subject },
      update: {},
    });
  }
}
