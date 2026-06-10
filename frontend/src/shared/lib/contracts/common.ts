/**
 * LAYER 6 — Contracts (shared)
 * --------------------------------------------------------------
 * Reusable Zod schemas that show up in many features:
 *   • Money — NPR amounts, rendered with lakh grouping
 *   • Pagination meta
 *   • ISO timestamps, ids, locales
 *
 * Feature-specific contracts live in features/<name>/contracts/.
 * Anything that crosses the network boundary MUST be parsed by a
 * Zod schema before it reaches L4 (service) — never trust the wire.
 */
import { z } from "zod";

/** Tagged opaque id — narrowed at the type level only. */
export const IdSchema = z.string().min(1);
export type Id = z.infer<typeof IdSchema>;

export const IsoDateTimeSchema = z.string().datetime({ offset: true });
export type IsoDateTime = z.infer<typeof IsoDateTimeSchema>;

export const CurrencyCodeSchema = z.literal("NPR");
export type CurrencyCode = z.infer<typeof CurrencyCodeSchema>;

/**
 * Money is always carried as integer minor units (paisa) to dodge
 * floating point. The view layer formats with NPR lakh grouping.
 */
export const MoneySchema = z.object({
  amountMinor: z.number().int().nonnegative(),
  currency: CurrencyCodeSchema,
});
export type Money = z.infer<typeof MoneySchema>;

export const PaginationMetaSchema = z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().nonnegative(),
});
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;

export const RoleSchema = z.enum(["student", "recruiter", "admin"]);
export type Role = z.infer<typeof RoleSchema>;
