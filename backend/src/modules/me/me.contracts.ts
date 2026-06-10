/**
 * Wire shape for `GET /api/v1/me` — the aggregated profile view.
 * Mirrors the frontend's `MeAggregateSchema`.
 */
import { z } from "zod";

const UploadRefSchema = z.object({
  id: z.string(),
  kind: z.enum(["avatar", "banner", "portfolio", "nid", "attachment"]),
  url: z.string(),
  mimeType: z.string(),
  sizeBytes: z.number().int().nonnegative(),
  originalName: z.string(),
  createdAt: z.string(),
});

const CompanyRefSchema = z.object({
  id: z.string(),
  name: z.string(),
  verified: z.boolean(),
});

const SessionUserAggregateSchema = z.object({
  id: z.string(),
  email: z.string(),
  fullName: z.string(),
  role: z.enum(["student", "recruiter", "admin"]),
  avatarUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
  headline: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()),
  onboardingCompleted: z.boolean(),
  verified: z.boolean(),
});

export const MeAggregateSchema = z.object({
  user: SessionUserAggregateSchema,
  /** Populated for recruiters; null otherwise. */
  company: CompanyRefSchema.nullable(),
  /** Latest uploaded file per kind. Avatar/banner are also reachable
   *  via `user.avatarUrl` / `user.bannerUrl`; mirrored here for completeness. */
  uploads: z.object({
    avatar: UploadRefSchema.nullable(),
    banner: UploadRefSchema.nullable(),
    portfolio: UploadRefSchema.nullable(),
    nid: UploadRefSchema.nullable(),
  }),
});
export type MeAggregate = z.infer<typeof MeAggregateSchema>;
