/**
 * Gig routes — `/gigs/*`. The listing endpoints are public; create /
 * update / delete require an authenticated recruiter (or admin) — the
 * service enforces ownership beyond that.
 *
 *   GET    /gigs                       — list + filter + sort + paginate (public)
 *   GET    /gigs/featured              — top picks for the marketing surface
 *   GET    /gigs/:id                   — fetch one (public)
 *   POST   /gigs                       — create (auth: recruiter|admin)
 *   PATCH  /gigs/:id                   — update (auth: owner|admin)
 *   DELETE /gigs/:id                   — delete (auth: owner|admin)
 */
import { Router } from "express";
import { validate } from "@middlewares/validate";
import { requireAuth, requireRole } from "@middlewares/auth";
import { asyncHandler } from "@lib/async";
import {
  CreateGigRequestSchema,
  GigIdParamsSchema,
  ListGigsQuerySchema,
  UpdateGigRequestSchema,
} from "./gig.contracts";
import type { GigController } from "./gig.controller";

export function makeGigRouter(controller: GigController): Router {
  const router = Router();

  router.get(
    "/",
    validate({ query: ListGigsQuerySchema }),
    asyncHandler(controller.list),
  );

  router.get("/featured", asyncHandler(controller.featured));

  router.get(
    "/:id",
    validate({ params: GigIdParamsSchema }),
    asyncHandler(controller.getById),
  );

  router.post(
    "/",
    requireAuth,
    requireRole("recruiter", "admin"),
    validate({ body: CreateGigRequestSchema }),
    asyncHandler(controller.create),
  );

  router.patch(
    "/:id",
    requireAuth,
    requireRole("recruiter", "admin"),
    validate({ params: GigIdParamsSchema, body: UpdateGigRequestSchema }),
    asyncHandler(controller.update),
  );

  router.delete(
    "/:id",
    requireAuth,
    requireRole("recruiter", "admin"),
    validate({ params: GigIdParamsSchema }),
    asyncHandler(controller.remove),
  );

  return router;
}
