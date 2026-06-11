import { z } from "zod";
import { PaginationSchema } from "@lib/pagination";

export const ApplicationStatusSchema = z.enum(["pending", "reviewing", "accepted", "rejected"]);

export const GigApplicationSchema = z.object({
  id: z.string(),
  gigId: z.string(),
  status: ApplicationStatusSchema,
  coverNote: z.string().nullable(),
  createdAt: z.string(),
  gig: z.object({
    id: z.string(),
    title: z.string(),
    category: z.string(),
    // Nullable: gigs can be posted by an individual recruiter (no company).
    company: z
      .object({
        id: z.string(),
        name: z.string(),
        verified: z.boolean(),
      })
      .nullable(),
    location: z.enum(["remote", "onsite", "hybrid"]),
    duration: z.string(),
    payKind: z.enum(["hourly", "fixed"]),
    pay: z.object({ amountMinor: z.number().int().nonnegative(), currency: z.literal("NPR") }),
    status: z.enum(["draft", "active", "reviewing", "submitted", "completed", "rejected"]),
    postedAt: z.string(),
  }),
});

export const CreateApplicationRequestSchema = z.object({
  gigId: z.string().min(1),
  coverNote: z.string().max(2000).optional(),
});

export const ListMyApplicationsQuerySchema = PaginationSchema.extend({
  status: ApplicationStatusSchema.optional(),
});

/** Recruiter-facing status update (PATCH /gigs/:id/status body). */
export const UpdateApplicationStatusRequestSchema = z.object({
  status: ApplicationStatusSchema,
});

/** A single applicant row in the recruiter's per-gig applicants list. */
export const ApplicantSchema = z.object({
  id: z.string(),
  status: ApplicationStatusSchema,
  coverNote: z.string().nullable(),
  createdAt: z.string(),
  applicant: z.object({
    id: z.string(),
    fullName: z.string(),
    avatarUrl: z.string().nullable(),
    headline: z.string().nullable(),
    skills: z.array(z.string()),
    verified: z.boolean(),
  }),
});

/** Full applicant detail (recruiter applicant detail page). */
export const ApplicantDetailSchema = ApplicantSchema.extend({
  gig: z.object({ id: z.string(), title: z.string() }),
  applicant: ApplicantSchema.shape.applicant.extend({
    bannerUrl: z.string().nullable(),
    bio: z.string().nullable(),
  }),
});

export type GigApplication = z.infer<typeof GigApplicationSchema>;
export type CreateApplicationRequest = z.infer<typeof CreateApplicationRequestSchema>;
export type ListMyApplicationsQuery = z.infer<typeof ListMyApplicationsQuerySchema>;
export type UpdateApplicationStatusRequest = z.infer<typeof UpdateApplicationStatusRequestSchema>;
export type Applicant = z.infer<typeof ApplicantSchema>;
export type ApplicantDetail = z.infer<typeof ApplicantDetailSchema>;
