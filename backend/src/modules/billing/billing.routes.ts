import { Router } from "express";
import express from "express";
import { requireAuth, requireRole } from "@middlewares/auth";
import { validate } from "@middlewares/validate";
import { asyncHandler } from "@lib/async";
import { CheckoutRequestSchema } from "./billing.contracts";
import type { BillingController } from "./billing.controller";

/** Authenticated recruiter billing endpoints. Mounted at `/billing`. */
export function makeBillingRouter(controller: BillingController): Router {
  const router = Router();
  const guard = [requireAuth, requireRole("recruiter", "admin")] as const;

  router.get("/me", ...guard, asyncHandler(controller.me));
  router.post(
    "/checkout",
    ...guard,
    validate({ body: CheckoutRequestSchema }),
    asyncHandler(controller.checkout),
  );
  router.post("/portal", ...guard, asyncHandler(controller.portal));
  return router;
}

/**
 * Stripe webhook router — kept separate because it needs the RAW body
 * (not JSON-parsed) for signature verification and must be mounted before
 * the global `express.json()` in app.ts. No auth: Stripe authenticates via
 * the signature header.
 */
export function makeStripeWebhookRouter(controller: BillingController): Router {
  const router = Router();
  router.post(
    "/",
    express.raw({ type: "application/json" }),
    asyncHandler(controller.webhook),
  );
  return router;
}
