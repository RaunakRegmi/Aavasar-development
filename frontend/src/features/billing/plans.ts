/**
 * Plan display catalogue — the front-end mirror of the backend's
 * `modules/billing/plans.ts`. Drives BOTH the public pricing page and
 * the in-app billing page so the numbers never drift.
 *
 * Keep the limits in lock-step with the backend (that file is the
 * enforcement source of truth; this one is purely presentational).
 */
export type PlanTier = "basic" | "professional" | "enterprise";
export type CheckoutTarget = "professional" | "addon_gigslots" | "addon_featured";

export interface PlanCard {
  tier: PlanTier;
  name: string;
  /** Display price, e.g. "$0" / "$99" / "Custom". */
  price: string;
  period: string;
  tagline: string;
  cta: string;
  popular: boolean;
}

export const PLAN_CARDS: PlanCard[] = [
  {
    tier: "basic",
    name: "Basic",
    price: "$0",
    period: "forever",
    tagline: "Everything you need to post your first gigs and start hiring.",
    cta: "Get Started",
    popular: false,
  },
  {
    tier: "professional",
    name: "Professional",
    price: "$99",
    period: "/month",
    tagline: "Scale hiring with unlimited gigs, AI screening, and featured listings.",
    cta: "Upgrade to Professional",
    popular: true,
  },
  {
    tier: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    tagline: "Custom limits, API access, and a dedicated success manager.",
    cta: "Contact Sales",
    popular: false,
  },
];

/** One row of the feature-comparison table. `true`/`false` render as check/✗. */
export interface ComparisonRow {
  label: string;
  basic: string | boolean;
  professional: string | boolean;
  enterprise: string | boolean;
}

export const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "Max Active Gigs", basic: "2", professional: "Unlimited", enterprise: "Unlimited" },
  { label: "Application Limit", basic: "50 / month", professional: "Unlimited", enterprise: "Unlimited" },
  { label: "Featured Listing Slots", basic: "—", professional: "3", enterprise: "Unlimited" },
  { label: "AI Screening", basic: false, professional: true, enterprise: true },
  { label: "API Access", basic: false, professional: false, enterprise: true },
  { label: "Support", basic: "Community", professional: "Priority", enterprise: "Dedicated" },
];

export interface AddOn {
  target: Exclude<CheckoutTarget, "professional">;
  name: string;
  price: string;
  description: string;
}

export const ADD_ONS: AddOn[] = [
  {
    target: "addon_gigslots",
    name: "+5 Extra Gig Slots",
    price: "$29/mo",
    description: "Add 5 active-gig slots on top of your current plan.",
  },
  {
    target: "addon_featured",
    name: "Featured Listing Boost",
    price: "$15/listing",
    description: "Pin a listing to the top of search results.",
  },
];
