/**
 * RewardsService — the gamification brain.
 *
 *   • Students EARN points when a gig they were accepted on is completed.
 *   • Students SPEND points on perks from the catalogue.
 *
 * Award is called from the gig completion hook; spend is the redeem
 * endpoint. Both go through the repository's atomic ledger writes.
 */
import { BadRequestError, NotFoundError } from "@lib/errors";
import { logger } from "@config/logger";
import type { NotificationService } from "../notifications/notification.service";
import { RewardsRepository } from "./rewards.repository";
import { PERKS, perkByKey } from "./perks";

/** ₹100 (10 000 paisa) ≈ 1 point, with a floor so every completed gig pays out. */
const PAISA_PER_POINT = 10_000;
const MIN_COMPLETION_POINTS = 10;

export class RewardsService {
  constructor(
    private readonly repo: RewardsRepository,
    private readonly notifications: NotificationService,
  ) {}

  // ---------- Read ----------

  async getMe(userId: string) {
    const user = await this.repo.findUser(userId);
    if (!user) throw new NotFoundError("User not found.");
    const txns = await this.repo.recentTransactions(userId);
    return {
      balance: user.points,
      transactions: txns.map((t) => ({
        id: t.id,
        delta: t.delta,
        reason: t.reason,
        label: t.label,
        createdAt: t.createdAt.toISOString(),
      })),
    };
  }

  async listPerks(userId: string) {
    const user = await this.repo.findUser(userId);
    const balance = user?.points ?? 0;
    return {
      balance,
      perks: PERKS.map((p) => ({
        key: p.key,
        title: p.title,
        description: p.description,
        cost: p.cost,
        affordable: balance >= p.cost,
      })),
    };
  }

  // ---------- Spend ----------

  async redeem(userId: string, perkKey: string) {
    const perk = perkByKey(perkKey);
    if (!perk) throw new NotFoundError("That perk doesn't exist.");

    const user = await this.repo.findUser(userId);
    if (!user) throw new NotFoundError("User not found.");
    if (user.points < perk.cost) {
      throw new BadRequestError(
        `You need ${perk.cost} points for "${perk.title}" — you have ${user.points}.`,
      );
    }

    let featuredUntil: Date | null = null;
    if (perk.effect.type === "featured_days") {
      const base = user.featuredUntil && user.featuredUntil > new Date() ? user.featuredUntil : new Date();
      featuredUntil = new Date(base.getTime() + perk.effect.days * 24 * 60 * 60 * 1000);
    }

    const { balance } = await this.repo.spendOnPerk({
      userId,
      perkKey: perk.key,
      cost: perk.cost,
      label: `Redeemed: ${perk.title}`,
      featuredUntil,
    });

    return { balance, redeemed: { key: perk.key, title: perk.title, cost: perk.cost } };
  }

  // ---------- Earn (called from the gig completion hook) ----------

  /**
   * Award completion points to every student who was accepted on the gig.
   * Points scale with pay, with a fixed floor. Best-effort: a failure here
   * never blocks the gig status change (the caller swallows errors).
   */
  async awardForGigCompletion(gig: {
    id: string;
    title: string;
    payAmountMinor: number;
  }): Promise<void> {
    const studentIds = await this.repo.acceptedStudentIds(gig.id);
    if (studentIds.length === 0) return;

    const points = Math.max(
      MIN_COMPLETION_POINTS,
      Math.floor(gig.payAmountMinor / PAISA_PER_POINT),
    );

    for (const userId of studentIds) {
      const balance = await this.repo.award({
        userId,
        points,
        reason: "gig_completed",
        label: `Completed "${gig.title}"`,
        gigId: gig.id,
      });
      await this.notifications.create({
        userId,
        kind: "points_awarded",
        title: `You earned ${points} points!`,
        description: `Completing "${gig.title}" added ${points} points. Balance: ${balance}.`,
        link: "/student/perks",
      });
      logger.info({ userId, gigId: gig.id, points }, "[rewards] awarded completion points");
    }
  }
}
