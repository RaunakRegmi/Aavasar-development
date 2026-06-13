import { Router } from "express";
import { requireAuth, requireRole } from "@middlewares/auth";
import { validate } from "@middlewares/validate";
import { asyncHandler } from "@lib/async";
import { RedeemRequestSchema } from "./rewards.contracts";
import type { RewardsController } from "./rewards.controller";

/** Student rewards endpoints. Mounted at `/rewards`. */
export function makeRewardsRouter(controller: RewardsController): Router {
  const router = Router();
  const guard = [requireAuth, requireRole("student", "admin")] as const;

  router.get("/me", ...guard, asyncHandler(controller.me));
  router.get("/perks", ...guard, asyncHandler(controller.perks));
  router.post(
    "/redeem",
    ...guard,
    validate({ body: RedeemRequestSchema }),
    asyncHandler(controller.redeem),
  );
  return router;
}
