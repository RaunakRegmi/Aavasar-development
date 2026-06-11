import { Router } from "express";
import { validate } from "@middlewares/validate";
import { requireAuth, requireRecruiter } from "@middlewares/auth";
import { asyncHandler } from "@lib/async";
import { TalentFiltersSchema, TalentIdParamsSchema } from "./talent.contracts";
import type { TalentController } from "./talent.controller";

export function makeTalentRouter(controller: TalentController): Router {
  const router = Router();

  router.get(
    "/",
    requireAuth,
    requireRecruiter,
    validate({ query: TalentFiltersSchema }),
    asyncHandler(controller.list),
  );

  router.get(
    "/:id",
    requireAuth,
    requireRecruiter,
    validate({ params: TalentIdParamsSchema }),
    asyncHandler(controller.getById),
  );

  return router;
}
