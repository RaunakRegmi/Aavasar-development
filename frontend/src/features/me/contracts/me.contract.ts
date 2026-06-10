/**
 * LAYER 6 — `/me` aggregate contract.
 *
 * Mirrors backend `MeAggregateSchema` (backend/src/modules/me/me.contracts.ts).
 * Keep the two files structurally identical — if one drifts, profile reads
 * will fail at parse time, which is the desired failure mode (loud, not
 * silently rendering an undefined `user.headline`).
 */
import { z } from "zod";
import { SessionUserSchema } from "@features/auth";
import { UploadDtoSchema } from "@features/uploads";

const CompanyRefSchema = z.object({
  id: z.string(),
  name: z.string(),
  verified: z.boolean(),
});
export type CompanyRef = z.infer<typeof CompanyRefSchema>;

export const MeAggregateSchema = z.object({
  user: SessionUserSchema,
  /** Recruiter only — null for students. */
  company: CompanyRefSchema.nullable(),
  /** Latest uploaded file per kind. NID is only ever populated for the owner. */
  uploads: z.object({
    avatar: UploadDtoSchema.nullable(),
    banner: UploadDtoSchema.nullable(),
    portfolio: UploadDtoSchema.nullable(),
    nid: UploadDtoSchema.nullable(),
  }),
});
export type MeAggregate = z.infer<typeof MeAggregateSchema>;
