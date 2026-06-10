import { Router } from "express";
import { validate } from "@middlewares/validate";
import { requireAuth, requireRole } from "@middlewares/auth";
import { asyncHandler } from "@lib/async";
import {
  CreateApplicationRequestSchema,
  ListMyApplicationsQuerySchema,
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
    requireRole("student"),
    validate({ body: CreateApplicationRequestSchema }),
    asyncHandler(controller.create),
  );

  return router;
}
