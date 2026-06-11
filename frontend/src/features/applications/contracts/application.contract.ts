import { z } from "zod";
import { IdSchema, IsoDateTimeSchema, MoneySchema } from "@shared/lib/contracts";

export const ApplicationStatusSchema = z.enum(["pending", "reviewing", "accepted", "rejected"]);

export const GigApplicationSchema = z.object({
  id: IdSchema,
  gigId: IdSchema,
  status: ApplicationStatusSchema,
  coverNote: z.string().nullable(),
  createdAt: IsoDateTimeSchema,
  gig: z.object({
    id: IdSchema,
    title: z.string(),
    category: z.string(),
    // Nullable: gigs can be posted by an individual recruiter (no company).
    company: z
      .object({
        id: IdSchema,
        name: z.string(),
        verified: z.boolean(),
      })
      .nullable(),
    location: z.enum(["remote", "onsite", "hybrid"]),
    duration: z.string(),
    payKind: z.enum(["hourly", "fixed"]),
    pay: MoneySchema,
    status: z.enum(["draft", "active", "reviewing", "submitted", "completed", "rejected"]),
    postedAt: IsoDateTimeSchema,
  }),
});

export const GigApplicationListSchema = z.array(GigApplicationSchema);

/* ----- Recruiter-facing: applicants for a gig ----- */

export const ApplicantSchema = z.object({
  id: IdSchema,
  status: ApplicationStatusSchema,
  coverNote: z.string().nullable(),
  createdAt: IsoDateTimeSchema,
  applicant: z.object({
    id: IdSchema,
    fullName: z.string(),
    avatarUrl: z.string().nullable(),
    headline: z.string().nullable(),
    skills: z.array(z.string()),
    verified: z.boolean(),
  }),
});

export const ApplicantListSchema = z.array(ApplicantSchema);

export const ApplicantDetailSchema = ApplicantSchema.extend({
  gig: z.object({ id: IdSchema, title: z.string() }),
  applicant: ApplicantSchema.shape.applicant.extend({
    bannerUrl: z.string().nullable(),
    bio: z.string().nullable(),
  }),
});

export type GigApplication = z.infer<typeof GigApplicationSchema>;
export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>;
export type Applicant = z.infer<typeof ApplicantSchema>;
export type ApplicantDetail = z.infer<typeof ApplicantDetailSchema>;
