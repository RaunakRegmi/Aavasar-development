/**
 * Typed, validated runtime environment access.
 *
 * Fails LOUD at boot if any required variable is missing or malformed.
 * Every module that needs configuration reads from `env` here — never
 * from `process.env` directly. That keeps the surface area auditable
 * and gives us a single place to swap the source (env file → secrets
 * manager) without touching callers.
 */
import "dotenv/config";
import { z } from "zod";

const RawEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(8080),
  API_BASE_PATH: z.string().startsWith("/").default("/api/v1"),

  DATABASE_URL: z.string().url(),

  JWT_ACCESS_SECRET: z.string().min(32, "Use at least 32 bytes of entropy for JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: z.string().min(32, "Use at least 32 bytes of entropy for JWT_REFRESH_SECRET"),
  JWT_ACCESS_TTL_SECONDS: z.coerce.number().int().positive().default(900),
  JWT_REFRESH_TTL_SECONDS: z.coerce.number().int().positive().default(2_592_000),
  // "Remember me" → 30-day sliding window (rotated/extended on each refresh,
  // so an active user effectively stays logged in; 30 days of inactivity logs out).
  JWT_REFRESH_TTL_REMEMBER_SECONDS: z.coerce.number().int().positive().default(2_592_000),
  // "Remember me" unchecked → short-lived session token (1 day). The
  // frontend also drops it on tab close (sessionStorage).
  JWT_REFRESH_TTL_SESSION_SECONDS: z.coerce.number().int().positive().default(86_400),

  FRONTEND_ORIGIN: z.string().url(),
  OAUTH_SUCCESS_REDIRECT: z.string().url(),
  OAUTH_FAILURE_REDIRECT: z.string().url(),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  LINKEDIN_CLIENT_ID: z.string().optional(),
  LINKEDIN_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().int().positive().default(60),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(120),
  AUTH_RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().int().positive().default(900),
  AUTH_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(10),

  UPLOAD_DIR: z.string().default("./uploads"),
  UPLOAD_PUBLIC_BASE: z.string().startsWith("/").default("/uploads"),
  UPLOAD_MAX_AVATAR_BYTES: z.coerce.number().int().positive().default(2 * 1024 * 1024),
  UPLOAD_MAX_DOCUMENT_BYTES: z.coerce.number().int().positive().default(10 * 1024 * 1024),

  // ---- Stripe (billing) ----
  // All optional: with no secret key the billing endpoints return a clear
  // "billing not configured" error instead of crashing at boot, so the
  // rest of the app runs locally without Stripe creds.
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_PROFESSIONAL: z.string().optional(),
  STRIPE_PRICE_ADDON_GIGSLOTS: z.string().optional(),
  STRIPE_PRICE_ADDON_FEATURED: z.string().optional(),
  STRIPE_SUCCESS_URL: z.string().url().optional(),
  STRIPE_CANCEL_URL: z.string().url().optional(),

  SUPPORT_EMAIL: z.string().email().default("hello@aavasar.np"),

  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
});

const parsed = RawEnvSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error("[env] invalid configuration:");
  // eslint-disable-next-line no-console
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const raw = parsed.data;

export const env = {
  nodeEnv: raw.NODE_ENV,
  isProd: raw.NODE_ENV === "production",
  isTest: raw.NODE_ENV === "test",
  port: raw.PORT,
  apiBasePath: raw.API_BASE_PATH,

  databaseUrl: raw.DATABASE_URL,

  jwt: {
    accessSecret: raw.JWT_ACCESS_SECRET,
    refreshSecret: raw.JWT_REFRESH_SECRET,
    accessTtlSeconds: raw.JWT_ACCESS_TTL_SECONDS,
    refreshTtlSeconds: raw.JWT_REFRESH_TTL_SECONDS,
    refreshTtlRememberSeconds: raw.JWT_REFRESH_TTL_REMEMBER_SECONDS,
    refreshTtlSessionSeconds: raw.JWT_REFRESH_TTL_SESSION_SECONDS,
  },

  frontendOrigin: raw.FRONTEND_ORIGIN,
  oauthSuccessRedirect: raw.OAUTH_SUCCESS_REDIRECT,
  oauthFailureRedirect: raw.OAUTH_FAILURE_REDIRECT,

  oauth: {
    google:
      raw.GOOGLE_CLIENT_ID && raw.GOOGLE_CLIENT_SECRET
        ? { clientId: raw.GOOGLE_CLIENT_ID, clientSecret: raw.GOOGLE_CLIENT_SECRET }
        : null,
    linkedin:
      raw.LINKEDIN_CLIENT_ID && raw.LINKEDIN_CLIENT_SECRET
        ? { clientId: raw.LINKEDIN_CLIENT_ID, clientSecret: raw.LINKEDIN_CLIENT_SECRET }
        : null,
    github:
      raw.GITHUB_CLIENT_ID && raw.GITHUB_CLIENT_SECRET
        ? { clientId: raw.GITHUB_CLIENT_ID, clientSecret: raw.GITHUB_CLIENT_SECRET }
        : null,
  },

  rateLimit: {
    general: { windowSec: raw.RATE_LIMIT_WINDOW_SECONDS, max: raw.RATE_LIMIT_MAX_REQUESTS },
    auth: { windowSec: raw.AUTH_RATE_LIMIT_WINDOW_SECONDS, max: raw.AUTH_RATE_LIMIT_MAX_REQUESTS },
  },

  upload: {
    dir: raw.UPLOAD_DIR,
    publicBase: raw.UPLOAD_PUBLIC_BASE,
    maxAvatarBytes: raw.UPLOAD_MAX_AVATAR_BYTES,
    maxDocumentBytes: raw.UPLOAD_MAX_DOCUMENT_BYTES,
  },

  stripe: {
    secretKey: raw.STRIPE_SECRET_KEY ?? null,
    webhookSecret: raw.STRIPE_WEBHOOK_SECRET ?? null,
    prices: {
      professional: raw.STRIPE_PRICE_PROFESSIONAL ?? null,
      addonGigSlots: raw.STRIPE_PRICE_ADDON_GIGSLOTS ?? null,
      addonFeatured: raw.STRIPE_PRICE_ADDON_FEATURED ?? null,
    },
    // Fall back to the frontend origin so checkout still redirects somewhere
    // sensible before the operator sets explicit return URLs.
    successUrl: raw.STRIPE_SUCCESS_URL ?? `${raw.FRONTEND_ORIGIN}/recruiter/billing/success`,
    cancelUrl: raw.STRIPE_CANCEL_URL ?? `${raw.FRONTEND_ORIGIN}/recruiter/billing/cancel`,
  },

  supportEmail: raw.SUPPORT_EMAIL,

  logLevel: raw.LOG_LEVEL,
} as const;

export type Env = typeof env;
