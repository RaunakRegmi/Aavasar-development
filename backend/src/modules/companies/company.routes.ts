import { Router } from "express";
import { validate } from "@middlewares/validate";
import { requireAuth, requireRole } from "@middlewares/auth";
import { asyncHandler } from "@lib/async";
import { CompanyRegistrationRequestSchema } from "./company.contracts";
import type { CompanyController } from "./company.controller";

export function makeCompanyRouter(controller: CompanyController): Router {
  const router = Router();

  router.post(
    "/register",
    requireAuth,
    requireRole("recruiter", "admin"),
    validate({ body: CompanyRegistrationRequestSchema }),
    asyncHandler(controller.register),
  );

  return router;
}
