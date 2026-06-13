/**
 * BillingService — Stripe orchestration + the read model behind the
 * in-app billing page and the public usage meters.
 *
 * Stripe is the source of truth for *payment* state; we mirror the bits
 * we gate on (tier, status, period end, add-on slots) onto the User row
 * via webhooks so the hot path (posting a gig) never calls Stripe.
 */
import type Stripe from "stripe";
import type { SubscriptionTier, User } from "@prisma/client";
import { env } from "@config/env";
import { getStripe } from "@lib/stripe";
import {
  BadRequestError,
  NotFoundError,
  ServiceUnavailableError,
} from "@lib/errors";
import { logger } from "@config/logger";
import { PLANS, planFor, effectiveGigCap } from "./plans";
import type { BillingRepository } from "./billing.repository";

export type CheckoutTarget = "professional" | "addon_gigslots" | "addon_featured";

/** How many extra active-gig slots one "+5 Extra Gig Slots" add-on grants. */
const GIGSLOTS_PER_ADDON = 5;

export class BillingService {
  constructor(private readonly repo: BillingRepository) {}

  // ---------- Read model ----------

  async getMe(userId: string) {
    const user = await this.repo.findById(userId);
    if (!user) throw new NotFoundError("User not found.");

    const now = new Date();
    const [activeGigs, applicationsThisMonth] = await Promise.all([
      this.repo.countActiveGigs(userId),
      this.repo.countApplicationsThisMonth(userId, now),
    ]);

    const plan = planFor(user.subscriptionTier);
    const gigCap = effectiveGigCap(user.subscriptionTier, user.extraGigSlots);

    return {
      tier: user.subscriptionTier,
      planName: plan.name,
      status: user.subscriptionStatus,
      currentPeriodEnd: user.currentPeriodEnd ? user.currentPeriodEnd.toISOString() : null,
      extraGigSlots: user.extraGigSlots,
      limits: serializeLimits(plan.limits),
      usage: {
        activeGigs,
        activeGigsLimit: serializeNumber(gigCap),
        applicationsThisMonth,
        applicationsLimit: serializeNumber(plan.limits.applicationsPerMonth),
      },
    };
  }

  // ---------- Checkout ----------

  async createCheckout(userId: string, target: CheckoutTarget): Promise<{ url: string }> {
    const stripe = getStripe();
    const user = await this.repo.findById(userId);
    if (!user) throw new NotFoundError("User not found.");

    const price = this.priceFor(target);
    const customerId = await this.ensureCustomer(user);
    // Professional is a plan subscription; add-ons are recurring too.
    const mode: Stripe.Checkout.SessionCreateParams.Mode = "subscription";

    const session = await stripe.checkout.sessions.create({
      mode,
      customer: customerId,
      line_items: [{ price, quantity: 1 }],
      success_url: env.stripe.successUrl,
      cancel_url: env.stripe.cancelUrl,
      // Tagged so the webhook knows what the payment was FOR without
      // re-deriving it from the price id.
      metadata: { userId: user.id, purpose: target },
      subscription_data: { metadata: { userId: user.id, purpose: target } },
      allow_promotion_codes: true,
    });

    if (!session.url) {
      throw new ServiceUnavailableError("Stripe did not return a checkout URL.");
    }
    return { url: session.url };
  }

  async createPortal(userId: string): Promise<{ url: string }> {
    const stripe = getStripe();
    const user = await this.repo.findById(userId);
    if (!user) throw new NotFoundError("User not found.");
    if (!user.stripeCustomerId) {
      throw new BadRequestError("No billing account yet. Start a subscription first.");
    }
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: env.stripe.successUrl,
    });
    return { url: session.url };
  }

  // ---------- Webhook ----------

  /** Verify the signature and dispatch the event. Returns the event type handled. */
  async handleWebhook(rawBody: Buffer, signature: string | undefined): Promise<string> {
    const stripe = getStripe();
    if (!env.stripe.webhookSecret) {
      throw new ServiceUnavailableError("STRIPE_WEBHOOK_SECRET is not configured.");
    }
    if (!signature) throw new BadRequestError("Missing Stripe-Signature header.");

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, env.stripe.webhookSecret);
    } catch (err) {
      throw new BadRequestError(
        `Webhook signature verification failed: ${(err as Error).message}`,
      );
    }

    switch (event.type) {
      case "checkout.session.completed":
        await this.onCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.updated":
      case "customer.subscription.created":
        await this.onSubscriptionChanged(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await this.onSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      default:
        logger.debug({ type: event.type }, "[billing] unhandled stripe event");
    }
    return event.type;
  }

  // ---------- internals ----------

  private priceFor(target: CheckoutTarget): string {
    const map: Record<CheckoutTarget, string | null> = {
      professional: env.stripe.prices.professional,
      addon_gigslots: env.stripe.prices.addonGigSlots,
      addon_featured: env.stripe.prices.addonFeatured,
    };
    const price = map[target];
    if (!price) {
      throw new ServiceUnavailableError(
        `Price for "${target}" is not configured. Run the stripe:setup script and set the price env vars.`,
      );
    }
    return price;
  }

  private async ensureCustomer(user: User): Promise<string> {
    if (user.stripeCustomerId) return user.stripeCustomerId;
    const stripe = getStripe();
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.fullName,
      metadata: { userId: user.id },
    });
    await this.repo.setStripeCustomerId(user.id, customer.id);
    return customer.id;
  }

  private async onCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
    const userId = session.metadata?.userId;
    const purpose = session.metadata?.purpose as CheckoutTarget | undefined;
    if (!userId || !purpose) return;

    if (purpose === "addon_gigslots") {
      await this.repo.incrementExtraGigSlots(userId, GIGSLOTS_PER_ADDON);
      logger.info({ userId }, "[billing] granted extra gig slots");
    } else if (purpose === "professional") {
      await this.repo.setSubscription(userId, {
        subscriptionTier: "professional",
        subscriptionStatus: "active",
      });
      logger.info({ userId }, "[billing] upgraded to professional");
    }
    // addon_featured: one-time perk applied per listing in a later step.
  }

  private async onSubscriptionChanged(sub: Stripe.Subscription): Promise<void> {
    // Only the *plan* subscription moves the tier; add-on subs are ignored
    // here so a gig-slots renewal can't clobber the recruiter's tier.
    const purpose = sub.metadata?.purpose as CheckoutTarget | undefined;
    if (purpose && purpose !== "professional") return;

    const user = await this.userForSubscription(sub);
    if (!user) return;

    const tier: SubscriptionTier = this.subscriptionIsLive(sub) ? "professional" : "basic";
    const periodEnd = periodEndOf(sub);
    await this.repo.setSubscription(user.id, {
      subscriptionTier: tier,
      subscriptionStatus: sub.status,
      currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
    });
  }

  private async onSubscriptionDeleted(sub: Stripe.Subscription): Promise<void> {
    const purpose = sub.metadata?.purpose as CheckoutTarget | undefined;
    if (purpose && purpose !== "professional") return;
    const user = await this.userForSubscription(sub);
    if (!user) return;
    await this.repo.setSubscription(user.id, {
      subscriptionTier: "basic",
      subscriptionStatus: "canceled",
      currentPeriodEnd: null,
    });
  }

  private subscriptionIsLive(sub: Stripe.Subscription): boolean {
    return sub.status === "active" || sub.status === "trialing" || sub.status === "past_due";
  }

  private async userForSubscription(sub: Stripe.Subscription): Promise<User | null> {
    const byMeta = sub.metadata?.userId;
    if (byMeta) {
      const u = await this.repo.findById(byMeta);
      if (u) return u;
    }
    const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
    return this.repo.findByStripeCustomerId(customerId);
  }
}

/**
 * Current-period end as a unix timestamp. In recent Stripe API versions
 * this lives on the subscription *item* rather than the subscription, so
 * read it from the first item and fall back to the top-level field for
 * older versions.
 */
function periodEndOf(sub: Stripe.Subscription): number | null {
  const item = sub.items?.data?.[0] as { current_period_end?: number } | undefined;
  if (item?.current_period_end) return item.current_period_end;
  const legacy = (sub as unknown as { current_period_end?: number }).current_period_end;
  return legacy ?? null;
}

// `Infinity` is not valid JSON — serialize it as null ("unlimited").
function serializeNumber(n: number): number | null {
  return Number.isFinite(n) ? n : null;
}

function serializeLimits(limits: (typeof PLANS)[SubscriptionTier]["limits"]) {
  return {
    maxActiveGigs: serializeNumber(limits.maxActiveGigs),
    applicationsPerMonth: serializeNumber(limits.applicationsPerMonth),
    featuredSlots: serializeNumber(limits.featuredSlots),
    aiScreening: limits.aiScreening,
    apiAccess: limits.apiAccess,
  };
}
