/**
 * Billing repository — owns the User billing columns and the read-side
 * counts that power usage meters + the hard quota gates.
 */
import type { PrismaClient, SubscriptionTier, User } from "@prisma/client";

/** First instant of the current calendar month, in UTC. */
function startOfMonthUTC(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

export class BillingRepository {
  constructor(private readonly db: PrismaClient) {}

  findById(userId: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { id: userId } });
  }

  findByStripeCustomerId(customerId: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { stripeCustomerId: customerId } });
  }

  /** Active gigs posted by this recruiter (drafts excluded). */
  countActiveGigs(userId: string): Promise<number> {
    return this.db.gig.count({ where: { postedByUserId: userId, status: "active" } });
  }

  /** Applications received across this recruiter's gigs in the current month. */
  countApplicationsThisMonth(userId: string, now: Date): Promise<number> {
    return this.db.application.count({
      where: {
        gig: { postedByUserId: userId },
        createdAt: { gte: startOfMonthUTC(now) },
      },
    });
  }

  setStripeCustomerId(userId: string, stripeCustomerId: string): Promise<User> {
    return this.db.user.update({ where: { id: userId }, data: { stripeCustomerId } });
  }

  setSubscription(
    userId: string,
    patch: {
      subscriptionTier?: SubscriptionTier;
      subscriptionStatus?: string | null;
      currentPeriodEnd?: Date | null;
    },
  ): Promise<User> {
    return this.db.user.update({ where: { id: userId }, data: patch });
  }

  incrementExtraGigSlots(userId: string, by: number): Promise<User> {
    return this.db.user.update({
      where: { id: userId },
      data: { extraGigSlots: { increment: by } },
    });
  }
}
