/**
 * LAYER 6 — Gig contracts
 * --------------------------------------------------------------
 * Wire-shape schemas for everything gig-related: a gig listing,
 * filters, application status, recruiter-side aggregates.
 */
import { z } from "zod";
import {
  IdSchema,
  IsoDateTimeSchema,
  MoneySchema,
} from "@shared/lib/contracts";

export const GigStatusSchema = z.enum([
  "draft",
  "active",
  "reviewing",
  "submitted",
  "completed",
  "rejected",
]);
export type GigStatus = z.infer<typeof GigStatusSchema>;

export const GigPayKindSchema = z.enum(["hourly", "fixed"]);
export type GigPayKind = z.infer<typeof GigPayKindSchema>;

export const GigLocationSchema = z.enum(["remote", "onsite", "hybrid"]);
export type GigLocation = z.infer<typeof GigLocationSchema>;

/** Who posted a gig — a company or an individual recruiter. */
export const GigPostedAsSchema = z.enum(["individual", "company"]);
export type GigPostedAs = z.infer<typeof GigPostedAsSchema>;

/** Unified poster identity (company OR individual recruiter). */
export const GigPosterSchema = z.object({
  id: IdSchema,
  name: z.string(),
  avatarUrl: z.string().nullable(),
  verified: z.boolean(),
});
export type GigPoster = z.infer<typeof GigPosterSchema>;

export const GigSchema = z.object({
  id: IdSchema,
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
  postedAt: IsoDateTimeSchema,
  status: GigStatusSchema,
  isPremium: z.boolean().default(false),
});
export type Gig = z.infer<typeof GigSchema>;

export const GigListSchema = z.array(GigSchema);

/**
 * Create-gig payload (recruiter "Post a Gig" wizard). Mirrors backend
 * `CreateGigRequestSchema`. Omit `companyId` to post as an individual;
 * provide an approved company id to post under it. `publish` true → live
 * immediately, false → saved as a draft.
 */
export const CreateGigRequestSchema = z.object({
  title: z.string().min(3, "Give the gig a clear title.").max(160),
  category: z.string().min(2, "Add a category.").max(80),
  description: z.string().min(20, "Describe the gig in at least 20 characters.").max(5000),
  companyId: IdSchema.optional(),
  location: GigLocationSchema,
  duration: z.string().min(1, "Add an expected duration.").max(80),
  payKind: GigPayKindSchema,
  pay: MoneySchema,
  tags: z.array(z.string().min(1).max(40)).max(12).default([]),
  isPremium: z.boolean().optional().default(false),
  publish: z.boolean().optional().default(false),
});
/** Output (post-defaults) — what the service sends over the wire. */
export type CreateGigRequest = z.infer<typeof CreateGigRequestSchema>;
/** Input (pre-defaults) — what callers pass; `tags`/`isPremium`/`publish` optional. */
export type CreateGigInput = z.input<typeof CreateGigRequestSchema>;

export const GigFiltersSchema = z.object({
  category: z.string().optional(),
  location: GigLocationSchema.optional(),
  payKind: GigPayKindSchema.optional(),
  query: z.string().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(50).default(20),
});
export type GigFilters = z.infer<typeof GigFiltersSchema>;

/** Recruiter-side: a row in the "Active Gigs" table. */
export const GigPipelineRowSchema = z.object({
  id: IdSchema,
  title: z.string(),
  subtitle: z.string(),
  postedAt: IsoDateTimeSchema,
  applicantCount: z.number().int().nonnegative(),
  applicantFillPct: z.number().int().min(0).max(100),
  status: GigStatusSchema,
});
export type GigPipelineRow = z.infer<typeof GigPipelineRowSchema>;
