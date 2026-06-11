import { Router } from "express";
import { validate } from "@middlewares/validate";
import { requireAuth, requireRole, requireStudent } from "@middlewares/auth";
import { asyncHandler } from "@lib/async";
import {
  CreateApplicationRequestSchema,
  ListMyApplicationsQuerySchema,
  UpdateApplicationStatusRequestSchema,
} from "./application.contracts";
import type { ApplicationController } from "./application.controller";

export function makeApplicationRouter(controller: ApplicationController): Router {
  const router = Router();

  router.get(
    "/applied",
    requireAuth,
    requireRole("student", "admin"),
    validate({ query: ListMyApplicationsQuerySchema }),
    asyncHandler(controller.listMy),
  );

  router.post(
    "/apply",
    requireAuth,
    requireStudent,
    validate({ body: CreateApplicationRequestSchema }),
    asyncHandler(controller.create),
  );

  // Single applicant detail. MUST precede "/:gigId/applications" so the
  // literal "applications" segment isn't captured as a gigId.
  router.get(
    "/applications/:id",
    requireAuth,
    requireRole("recruiter", "admin"),
    asyncHandler(controller.getApplicant),
  );

  router.get(
    "/:gigId/applications",
    requireAuth,
    requireRole("recruiter", "admin"),
    asyncHandler(controller.listForGig),
  );

  router.patch(
    "/:id/status",
    requireAuth,
    requireRole("recruiter", "admin"),
    validate({ body: UpdateApplicationStatusRequestSchema }),
    asyncHandler(controller.updateStatus),
  );

  return router;
}
