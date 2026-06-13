import { Router } from "express";
import { requireAuth, requireRole } from "@middlewares/auth";
import { asyncHandler } from "@lib/async";
import type { DashboardController } from "./dashboard.controller";

/** Mounted at `/student/dashboard`. */
export function makeStudentDashboardRouter(controller: DashboardController): Router {
  const router = Router();
  const guard = [requireAuth, requireRole("student", "admin")] as const;
  router.get("/kpis", ...guard, asyncHandler(controller.studentKpis));
  router.get("/active-gigs", ...guard, asyncHandler(controller.studentActiveGigs));
  router.get("/upcoming", ...guard, asyncHandler(controller.studentUpcoming));
  router.get("/course", ...guard, asyncHandler(controller.studentCourse));
  return router;
}

/** Mounted at `/recruiter` — serves /dashboard/* and /gigs/pipeline. */
export function makeRecruiterDashboardRouter(controller: DashboardController): Router {
  const router = Router();
  const guard = [requireAuth, requireRole("recruiter", "admin")] as const;
  router.get("/dashboard/kpis", ...guard, asyncHandler(controller.recruiterKpis));
  router.get("/dashboard/applicants", ...guard, asyncHandler(controller.recruiterApplicants));
  router.get("/gigs/pipeline", ...guard, asyncHandler(controller.recruiterPipeline));
  return router;
}
