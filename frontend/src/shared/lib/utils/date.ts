/**
 * Date helpers — kept tiny on purpose. If we ever need durations,
 * relative times, or timezone math, pull in `date-fns`. Until then
 * Intl handles everything the dashboard needs.
 */

const FULL = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

const SHORT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const DAY = new Intl.DateTimeFormat("en-US", { day: "2-digit" });
const MONTH_SHORT = new Intl.DateTimeFormat("en-US", { month: "short" });

export function formatFull(iso: string): string {
  return FULL.format(new Date(iso));
}

export function formatShort(iso: string): string {
  return SHORT.format(new Date(iso));
}

export function splitDayMonth(iso: string): { day: string; month: string } {
  const d = new Date(iso);
  return { day: DAY.format(d), month: MONTH_SHORT.format(d).toUpperCase() };
}
