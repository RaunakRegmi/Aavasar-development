/**
 * Plan catalogue — the single source of truth for subscription limits.
 *
 * The hard quota gates (gig.create, application.apply) and the in-app
 * billing usage meters both read from here, and the public pricing page
 * mirrors the same numbers on the frontend. `Infinity` means "no cap".
 */
import type { SubscriptionTier } from "@prisma/client";

export interface PlanLimits {
  /** Max simultaneously *active* gigs (drafts don't count). */
  maxActiveGigs: number;
  /** Applications a recruiter may receive across their gigs per calendar month. */
  applicationsPerMonth: number;
  /** Featured-listing slots included with the plan. */
  featuredSlots: number;
  /** Plan includes AI screening. */
  aiScreening: boolean;
  /** Plan includes API access. */
  apiAccess: boolean;
}

export interface Plan {
  tier: SubscriptionTier;
  name: string;
  /** Monthly price in minor units (paisa); null = custom / contact sales. */
  priceMinor: number | null;
  limits: PlanLimits;
}

export const PLANS: Record<SubscriptionTier, Plan> = {
  basic: {
    tier: "basic",
    name: "Basic",
    priceMinor: 0,
    limits: {
      maxActiveGigs: 2,
      applicationsPerMonth: 50,
      featuredSlots: 0,
      aiScreening: false,
      apiAccess: false,
    },
  },
  professional: {
    tier: "professional",
    name: "Professional",
    // $99/mo — stored as USD minor units (cents) for parity with the image.
    priceMinor: 9900,
    limits: {
      maxActiveGigs: Infinity,
      applicationsPerMonth: Infinity,
      featuredSlots: 3,
      aiScreening: true,
      apiAccess: false,
    },
  },
  enterprise: {
    tier: "enterprise",
    name: "Enterprise",
    priceMinor: null, // custom / contact sales
    limits: {
      maxActiveGigs: Infinity,
      applicationsPerMonth: Infinity,
      featuredSlots: Infinity,
      aiScreening: true,
      apiAccess: true,
    },
  },
};

export function planFor(tier: SubscriptionTier): Plan {
  return PLANS[tier] ?? PLANS.basic;
}

/** Effective active-gig cap including any purchased add-on slots. */
export function effectiveGigCap(tier: SubscriptionTier, extraGigSlots: number): number {
  const base = planFor(tier).limits.maxActiveGigs;
  return base === Infinity ? Infinity : base + extraGigSlots;
}
