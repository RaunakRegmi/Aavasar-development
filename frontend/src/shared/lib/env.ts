/**
 * Typed, validated runtime environment access.
 *
 * Why a single module: every layer that touches the outside world
 * (transport, mocks, telemetry) reads config from here — never from
 * `import.meta.env` directly. That keeps the surface area auditable
 * and lets us swap the source (.env → remote config, etc.) once.
 */
import { z } from "zod";

const RawEnvSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_USE_MOCKS: z.enum(["true", "false"]).optional(),
  VITE_SENTRY_DSN: z.string().optional(),
  VITE_POSTHOG_KEY: z.string().optional(),
});

const parsed = RawEnvSchema.safeParse(import.meta.env);

if (!parsed.success) {
  // Fail loud at boot — never silently fall back to a wrong API base.
  // eslint-disable-next-line no-console
  console.error("[env] invalid VITE_* configuration:", parsed.error.flatten());
  throw new Error("Invalid frontend environment. See console for details.");
}

const raw = parsed.data;

export const env = {
  apiBaseUrl: raw.VITE_API_BASE_URL,
  useMocks: raw.VITE_USE_MOCKS === "true",
  sentryDsn: raw.VITE_SENTRY_DSN,
  posthogKey: raw.VITE_POSTHOG_KEY,
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
} as const;

export type Env = typeof env;
