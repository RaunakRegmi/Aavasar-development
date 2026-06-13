/**
 * Perk catalogue — the single source of truth for what students can buy
 * with points. The redeem flow validates against this and applies the
 * perk's `effect`; the frontend renders the same list with `affordable`
 * flags computed from the live balance.
 */
export type PerkEffect =
  | { type: "featured_days"; days: number } // boosts the student's profile in talent search
  | { type: "cosmetic" }; // recorded only — a badge/flair with no functional gate

export interface Perk {
  key: string;
  title: string;
  description: string;
  cost: number;
  effect: PerkEffect;
}

export const PERKS: Perk[] = [
  {
    key: "spotlight_24h",
    title: "24-Hour Spotlight",
    description: "Feature your profile at the top of Find Talent for 24 hours.",
    cost: 40,
    effect: { type: "featured_days", days: 1 },
  },
  {
    key: "profile_boost_7d",
    title: "7-Day Profile Boost",
    description: "Stay featured in recruiter talent searches for a full week.",
    cost: 120,
    effect: { type: "featured_days", days: 7 },
  },
  {
    key: "skill_badge",
    title: "Verified Skill Badge",
    description: "Display a standout badge on your profile to catch recruiters' eyes.",
    cost: 80,
    effect: { type: "cosmetic" },
  },
  {
    key: "priority_support",
    title: "Priority Support (30 days)",
    description: "Jump the queue for support and gig disputes for 30 days.",
    cost: 60,
    effect: { type: "cosmetic" },
  },
];

export function perkByKey(key: string): Perk | undefined {
  return PERKS.find((p) => p.key === key);
}
