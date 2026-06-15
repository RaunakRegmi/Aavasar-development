import { Router } from "express";
import { validate } from "@middlewares/validate";
import { authRateLimit } from "@middlewares/rateLimit";
import { asyncHandler } from "@lib/async";
import { ContactRequestSchema } from "./contact.contracts";
import type { ContactController } from "./contact.controller";

export function makeContactRouter(controller: ContactController): Router {
  const router = Router();

  router.post(
    "/",
    authRateLimit,
    validate({ body: ContactRequestSchema }),
    asyncHandler(controller.submit),
  );

  return router;
}
