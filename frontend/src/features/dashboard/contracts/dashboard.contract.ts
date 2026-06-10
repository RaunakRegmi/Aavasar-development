import { z } from "zod";
import { IdSchema, MoneySchema, IsoDateTimeSchema } from "@shared/lib/contracts";

export const StudentDashboardKpisSchema = z.object({
  totalEarnings: MoneySchema,
  activeGigs: z.number().int().nonnegative(),
  applications: z.number().int().nonnegative(),
  averageRating: z.number().min(0).max(5),
});
export type StudentDashboardKpis = z.infer<typeof StudentDashboardKpisSchema>;

export const ActiveGigSummarySchema = z.object({
  id: IdSchema,
  title: z.string(),
  company: z.string(),
  status: z.enum(["active", "submitted", "reviewing", "draft"]),
  statusLabel: z.string(),
  milestone: z.string(),
  amount: MoneySchema,
});
export type ActiveGigSummary = z.infer<typeof ActiveGigSummarySchema>;

export const UpcomingEventSchema = z.object({
  id: IdSchema,
  title: z.string(),
  occursAt: IsoDateTimeSchema,
  subtitle: z.string(),
});
export type UpcomingEvent = z.infer<typeof UpcomingEventSchema>;

export const CourseProgressSchema = z.object({
  id: IdSchema,
  title: z.string(),
  progress: z.number().int().min(0).max(100),
});
export type CourseProgress = z.infer<typeof CourseProgressSchema>;

export const RecruiterDashboardKpisSchema = z.object({
  activeGigs: z.number().int().nonnegative(),
  activeGigsDelta: z.string(),
  newApplicants: z.number().int().nonnegative(),
  newApplicantsDelta: z.string(),
  pendingInterviews: z.number().int().nonnegative(),
  pendingInterviewsNext: z.string(),
  totalHired: z.number().int().nonnegative(),
});
export type RecruiterDashboardKpis = z.infer<typeof RecruiterDashboardKpisSchema>;

export const ApplicantPreviewSchema = z.object({
  id: IdSchema,
  fullName: z.string(),
  /** Accepts either an absolute URL or a path served from our own origin. */
  avatarUrl: z.string().min(1).optional(),
  appliedFor: z.string(),
  skills: z.array(z.string()),
});
export type ApplicantPreview = z.infer<typeof ApplicantPreviewSchema>;
