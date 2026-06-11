/**
 * Gig wire contracts — exact mirror of the frontend's `GigSchema` and
 * `GigFiltersSchema` (see frontend/src/features/gigs/contracts).
 */
import { z } from "zod";
import { PaginationSchema } from "@lib/pagination";

export const GigStatusSchema = z.enum([
  "draft",
  "active",
  "reviewing",
  "submitted",
  "completed",
  "rejected",
]);
export const GigLocationSchema = z.enum(["remote", "onsite", "hybrid"]);
export const GigPayKindSchema = z.enum(["hourly", "fixed"]);

export const MoneySchema = z.object({
  amountMinor: z.number().int().nonnegative(),
  currency: z.literal("NPR"),
});

/** Who posted the gig — a company or an individual recruiter. */
export const GigPostedAsSchema = z.enum(["individual", "company"]);

/** Unified poster identity (company OR individual recruiter). */
export const GigPosterSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: z.string().nullable(),
  verified: z.boolean(),
});

/** Outbound — what the API returns for a gig. */
export const GigSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  description: z.string(),
  postedAs: GigPostedAsSchema,
  poster: GigPosterSchema,
  location: GigLocationSchema,
  duration: z.string(),
  payKind: GigPayKindSchema,
  pay: MoneySchema,
  tags: z.array(z.string()),
  postedAt: z.string(),
  status: GigStatusSchema,
  isPremium: z.boolean(),
});
export type GigDto = z.infer<typeof GigSchema>;

/** Inbound — create / update payloads. `companyId` is optional: omit it
 *  to post as an individual; provide an approved company to post under it.
 *  `publish` true → goes live (active) immediately; false → saved as draft. */
export const CreateGigRequestSchema = z.object({
  title: z.string().min(3).max(160),
  category: z.string().min(2).max(80),
  description: z.string().min(20).max(5000),
  companyId: z.string().min(1).optional(),
  location: GigLocationSchema,
  duration: z.string().min(1).max(80),
  payKind: GigPayKindSchema,
  pay: MoneySchema,
  tags: z.array(z.string().min(1).max(40)).max(12).default([]),
  isPremium: z.boolean().optional().default(false),
  publish: z.boolean().optional().default(false),
});
export type CreateGigRequest = z.infer<typeof CreateGigRequestSchema>;

export const UpdateGigRequestSchema = CreateGigRequestSchema.partial().extend({
  status: GigStatusSchema.optional(),
});
export type UpdateGigRequest = z.infer<typeof UpdateGigRequestSchema>;

/** Listing query params. */
export const ListGigsQuerySchema = PaginationSchema.extend({
  query: z.string().trim().max(200).optional(),
  category: z.string().trim().max(80).optional(),
  location: GigLocationSchema.optional(),
  payKind: GigPayKindSchema.optional(),
  status: GigStatusSchema.optional(),
  sort: z.string().trim().max(120).optional(),
});
export type ListGigsQuery = z.infer<typeof ListGigsQuerySchema>;

export const GigIdParamsSchema = z.object({ id: z.string().min(1) });
