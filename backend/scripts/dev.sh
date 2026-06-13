#!/usr/bin/env bash
#
# Dev entrypoint — starts the API (tsx watch) and, when Stripe is
# configured, AUTO-STARTS the Stripe webhook listener alongside it so
# `checkout.session.completed` etc. reach the local backend without any
# manual `stripe listen`. If the Stripe CLI or key is missing, it just
# runs the API (no error) so the app still boots without Stripe.
set -euo pipefail
cd "$(dirname "$0")/.."

# Locate the Stripe CLI (PATH or the local install used by setup).
STRIPE_BIN=""
if command -v stripe >/dev/null 2>&1; then
  STRIPE_BIN="$(command -v stripe)"
elif [ -x "$HOME/.local/bin/stripe" ]; then
  STRIPE_BIN="$HOME/.local/bin/stripe"
fi

# Pull the secret key from .env (used as --api-key so no interactive login).
SK="$(grep -E '^STRIPE_SECRET_KEY=' .env 2>/dev/null | cut -d= -f2- || true)"

LISTEN_PID=""
if [ -n "$STRIPE_BIN" ] && [ -n "$SK" ]; then
  echo "[dev] starting Stripe webhook listener → /api/v1/webhooks/stripe"
  "$STRIPE_BIN" listen --api-key "$SK" \
    --forward-to localhost:8080/api/v1/webhooks/stripe &
  LISTEN_PID=$!
else
  echo "[dev] Stripe listener skipped (CLI or STRIPE_SECRET_KEY not present)."
fi

# Ensure the listener dies with this script.
cleanup() {
  if [ -n "$LISTEN_PID" ]; then kill "$LISTEN_PID" 2>/dev/null || true; fi
}
trap cleanup EXIT INT TERM

# Run the API server in the foreground (this is what keeps the script alive).
exec npx tsx watch src/server.ts
