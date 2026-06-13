/**
 * Rewards repository — owns the points ledger and perk redemptions.
 *
 * Every balance change goes through `award` or `spend`, which write the
 * `PointsTransaction` row and adjust `User.points` in ONE database
 * transaction so the running total can never drift from the ledger.
 */
import type { PerkRedemption, PointsTransaction, PrismaClient, User } from "@prisma/client";

export class RewardsRepository {
  constructor(private readonly db: PrismaClient) {}

  findUser(userId: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { id: userId } });
  }

  recentTransactions(userId: string, take = 20): Promise<PointsTransaction[]> {
    return this.db.pointsTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take,
    });
  }

  /** Student user-ids with an accepted application on a gig (the people who did the work). */
  async acceptedStudentIds(gigId: string): Promise<string[]> {
    const rows = await this.db.application.findMany({
      where: { gigId, status: "accepted" },
      select: { userId: true },
    });
    return rows.map((r) => r.userId);
  }

  /** Credit points + write the ledger row atomically. Returns the new balance. */
  async award(input: {
    userId: string;
    points: number;
    reason: string;
    label: string;
    gigId?: string | null;
  }): Promise<number> {
    const [, user] = await this.db.$transaction([
      this.db.pointsTransaction.create({
        data: {
          userId: input.userId,
          delta: input.points,
          reason: input.reason,
          label: input.label,
          gigId: input.gigId ?? null,
        },
      }),
      this.db.user.update({
        where: { id: input.userId },
        data: { points: { increment: input.points } },
      }),
    ]);
    return user.points;
  }

  /**
   * Debit points, write the ledger row, record the redemption, and apply
   * an optional `featuredUntil` bump — all atomic. Returns new balance +
   * the redemption row.
   */
  async spendOnPerk(input: {
    userId: string;
    perkKey: string;
    cost: number;
    label: string;
    featuredUntil?: Date | null;
  }): Promise<{ balance: number; redemption: PerkRedemption }> {
    const [, user, redemption] = await this.db.$transaction([
      this.db.pointsTransaction.create({
        data: {
          userId: input.userId,
          delta: -input.cost,
          reason: "perk_redeemed",
          label: input.label,
        },
      }),
      this.db.user.update({
        where: { id: input.userId },
        data: {
          points: { decrement: input.cost },
          ...(input.featuredUntil ? { featuredUntil: input.featuredUntil } : {}),
        },
      }),
      this.db.perkRedemption.create({
        data: { userId: input.userId, perkKey: input.perkKey, cost: input.cost },
      }),
    ]);
    return { balance: user.points, redemption };
  }
}
