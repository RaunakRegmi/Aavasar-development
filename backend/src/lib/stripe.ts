/**
 * Stripe client accessor.
 *
 * Stripe is OPTIONAL at boot — without `STRIPE_SECRET_KEY` the app still
 * runs and billing endpoints reply with a clear "not configured" error
 * (503) instead of crashing. `getStripe()` is the single choke point that
 * enforces this, so callers never touch a half-initialised client.
 */
import Stripe from "stripe";
import { env } from "@config/env";
import { ServiceUnavailableError } from "@lib/errors";

let client: Stripe | null = null;

/** True when a secret key is present and Stripe can be used. */
export function isStripeConfigured(): boolean {
  return Boolean(env.stripe.secretKey);
}

/**
 * Returns the singleton Stripe client, or throws a 503 if Stripe is not
 * configured. Use this everywhere a Stripe call is made.
 */
export function getStripe(): Stripe {
  if (!env.stripe.secretKey) {
    throw new ServiceUnavailableError(
      "Billing is not configured. Set STRIPE_SECRET_KEY in the backend environment.",
    );
  }
  if (!client) {
    // Omit apiVersion → the SDK uses the version it ships with, which keeps
    // the pinned version and the installed types in lock-step.
    client = new Stripe(env.stripe.secretKey);
  }
  return client;
}
