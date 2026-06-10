import { Router } from "express";
import { requireAuth } from "@middlewares/auth";
import { validate } from "@middlewares/validate";
import { asyncHandler } from "@lib/async";
import { UpdateProfileRequestSchema } from "@modules/auth/auth.contracts";
import type { MeController } from "./me.controller";

export function makeMeRouter(controller: MeController): Router {
  const router = Router();
  router.use(requireAuth);

  router.get("/", asyncHandler(controller.getMe));
  router.patch(
    "/profile",
    validate({ body: UpdateProfileRequestSchema }),
    asyncHandler(controller.patchProfile),
  );

  return router;
}
