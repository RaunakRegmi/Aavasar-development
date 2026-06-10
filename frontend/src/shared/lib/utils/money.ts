import type { Money } from "../contracts";

/**
 * NPR formatting follows South Asian (Indian/Nepali) grouping:
 *   Last 3 digits, then groups of 2 — `1,24,000` not `124,000`.
 * Intl.NumberFormat with "en-IN" gives us this for free.
 */
const NPR_DIGITS = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

const NPR_RUPEE = "रु";

/** Returns "NPR 1,24,000" — the canonical big-number app rendering. */
export function formatNpr(money: Money): string {
  return `NPR ${NPR_DIGITS.format(money.amountMinor / 100)}`;
}

/** Returns "रु45/hr" — the inline rate rendering used on gig cards. */
export function formatRupeeRate(amountMinor: number, perUnit = "hr"): string {
  return `${NPR_RUPEE}${NPR_DIGITS.format(amountMinor / 100)}/${perUnit}`;
}

/** Returns "NPR 20,000 Fixed" — fixed-budget gigs. */
export function formatNprFixed(money: Money): string {
  return `${formatNpr(money)} Fixed`;
}

/** Construct a Money object from a plain rupee number (UI input → contract). */
export function rupees(rupees: number): Money {
  return { amountMinor: Math.round(rupees * 100), currency: "NPR" };
}
