import { request } from "@shared/lib/transport";
import { z } from "zod";
import {
  ActiveGigSummarySchema,
  ApplicantPreviewSchema,
  CourseProgressSchema,
  RecruiterDashboardKpisSchema,
  StudentDashboardKpisSchema,
  UpcomingEventSchema,
  type ActiveGigSummary,
  type ApplicantPreview,
  type CourseProgress,
  type RecruiterDashboardKpis,
  type StudentDashboardKpis,
  type UpcomingEvent,
} from "../contracts/dashboard.contract";

const ActiveGigList = z.array(ActiveGigSummarySchema);
const UpcomingList = z.array(UpcomingEventSchema);
const ApplicantList = z.array(ApplicantPreviewSchema);

export const dashboardService = {
  async studentKpis(): Promise<StudentDashboardKpis> {
    return StudentDashboardKpisSchema.parse(
      await request<unknown>({ method: "GET", url: "/student/dashboard/kpis" }),
    );
  },
  async studentActiveGigs(): Promise<ActiveGigSummary[]> {
    return ActiveGigList.parse(
      await request<unknown>({ method: "GET", url: "/student/dashboard/active-gigs" }),
    );
  },
  async studentUpcoming(): Promise<UpcomingEvent[]> {
    return UpcomingList.parse(
      await request<unknown>({ method: "GET", url: "/student/dashboard/upcoming" }),
    );
  },
  async studentCourse(): Promise<CourseProgress | null> {
    const raw = await request<unknown>({ method: "GET", url: "/student/dashboard/course" });
    if (raw == null) return null;
    return CourseProgressSchema.parse(raw);
  },
  async recruiterKpis(): Promise<RecruiterDashboardKpis> {
    return RecruiterDashboardKpisSchema.parse(
      await request<unknown>({ method: "GET", url: "/recruiter/dashboard/kpis" }),
    );
  },
  async recruiterApplicants(): Promise<ApplicantPreview[]> {
    return ApplicantList.parse(
      await request<unknown>({ method: "GET", url: "/recruiter/dashboard/applicants" }),
    );
  },
};

export type DashboardService = typeof dashboardService;
