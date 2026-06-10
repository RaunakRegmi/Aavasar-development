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

export const GigSchema = z.object({
  id: IdSchema,
  title: z.string(),
  category: z.string(),
  description: z.string(),
  company: z.object({
    id: IdSchema,
    name: z.string(),
    verified: z.boolean(),
  }),
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
