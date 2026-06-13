/**
 * One-shot Stripe bootstrap for AAwasar billing (TEST MODE).
 *
 *   npm run stripe:setup
 *
 * Requires STRIPE_SECRET_KEY (a `sk_test_…` key) in the backend env.
 * Creates the products + recurring prices that the billing module needs
 * and prints the env vars to paste into backend/.env:
 *
 *   STRIPE_PRICE_PROFESSIONAL=price_…
 *   STRIPE_PRICE_ADDON_GIGSLOTS=price_…
 *   STRIPE_PRICE_ADDON_FEATURED=price_…
 *
 * Idempotent-ish: it always creates fresh prices (Stripe prices are
 * immutable), so re-running produces new ids — paste the latest output.
 */
import "dotenv/config";
import Stripe from "stripe";

async function main(): Promise<void> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.error("✗ STRIPE_SECRET_KEY is not set. Add your sk_test_… key to backend/.env first.");
    process.exit(1);
  }
  if (!key.startsWith("sk_test_")) {
    console.warn("⚠ STRIPE_SECRET_KEY does not look like a test key (sk_test_…). Continuing anyway.");
  }

  const stripe = new Stripe(key);

  // 1) Professional plan — $99/mo recurring.
  const professional = await stripe.products.create({
    name: "AAwasar Professional",
    description: "Unlimited active gigs, unlimited applications, featured slots, AI screening.",
  });
  const professionalPrice = await stripe.prices.create({
    product: professional.id,
    unit_amount: 9900,
    currency: "usd",
    recurring: { interval: "month" },
    nickname: "Professional Monthly",
  });

  // 2) Add-on — +5 Extra Gig Slots, $29/mo recurring.
  const gigSlots = await stripe.products.create({
    name: "AAwasar +5 Extra Gig Slots",
    description: "Adds 5 active-gig slots on top of your current plan.",
  });
  const gigSlotsPrice = await stripe.prices.create({
    product: gigSlots.id,
    unit_amount: 2900,
    currency: "usd",
    recurring: { interval: "month" },
    nickname: "Extra Gig Slots Monthly",
  });

  // 3) Add-on — Featured Listing Boost, $15/mo recurring.
  const featured = await stripe.products.create({
    name: "AAwasar Featured Listing Boost",
    description: "Boost a listing to the top of search results.",
  });
  const featuredPrice = await stripe.prices.create({
    product: featured.id,
    unit_amount: 1500,
    currency: "usd",
    recurring: { interval: "month" },
    nickname: "Featured Listing Boost Monthly",
  });

  console.log("\n✓ Stripe products & prices created. Paste these into backend/.env:\n");
  console.log(`STRIPE_PRICE_PROFESSIONAL=${professionalPrice.id}`);
  console.log(`STRIPE_PRICE_ADDON_GIGSLOTS=${gigSlotsPrice.id}`);
  console.log(`STRIPE_PRICE_ADDON_FEATURED=${featuredPrice.id}`);
  console.log(
    "\nThen run the webhook forwarder for local testing:\n" +
      "  stripe listen --forward-to localhost:8080/api/v1/webhooks/stripe\n" +
      "and copy the printed whsec_… into STRIPE_WEBHOOK_SECRET.\n",
  );
}

main().catch((err) => {
  console.error("✗ stripe:setup failed:", err);
  process.exit(1);
});
