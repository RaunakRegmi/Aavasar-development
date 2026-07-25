/**
 * Express application factory.
 *
 * Returns a fully-composed Express app WITHOUT calling `listen` — that
 * lets tests boot the app with supertest, and the entrypoint
 * (`server.ts`) decide when to bind a port.
 *
 * Middleware order is significant:
 *   1. helmet                  — security headers FIRST
 *   2. cors                    — must precede route handlers
 *   3. cookieParser + json     — body / cookie parsing
 *   4. passport.initialize     — must wrap any route using passport
 *   5. requestId               — mints/echoes x-request-id
 *   6. requestLogger           — needs req.id from (5)
 *   7. /uploads static         — served BEFORE rate limit so file
 *                                fetches don't burn the per-IP budget
 *   8. generalRateLimit        — applies to every API route by default
 *   9. /api/v1 routers         — auth, gigs, uploads, …
 *  10. notFound                — catch-all 404
 *  11. errorHandler            — MUST be last (4-arg signature)
 */
import path from "node:path";
import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import passport from "passport";

import { env } from "@config/env";
import { requestId } from "@middlewares/requestId";
import { requestLogger } from "@middlewares/requestLogger";
import { generalRateLimit } from "@middlewares/rateLimit";
import { notFound } from "@middlewares/notFound";
import { errorHandler } from "@middlewares/error";
import { ok } from "@lib/response";

import { makeAuthRouter } from "@modules/auth/auth.routes";
import { makeGigRouter } from "@modules/gigs/gig.routes";
import { makeUploadRouter } from "@modules/uploads/upload.routes";
import { makeMeRouter } from "@modules/me/me.routes";
import { makeApplicationRouter } from "@modules/applications/application.routes";
import { makeCompanyRouter } from "@modules/companies/company.routes";
import { makeTalentRouter } from "@modules/users/talent.routes";
import { makeNotificationRouter } from "@modules/notifications/notification.routes";
import { makeMessageRouter } from "@modules/messaging/message.routes";
import {
  makeStudentDashboardRouter,
  makeRecruiterDashboardRouter,
} from "@modules/dashboard/dashboard.routes";
import { makeBillingRouter, makeStripeWebhookRouter } from "@modules/billing/billing.routes";
import { makeRewardsRouter } from "@modules/rewards/rewards.routes";
import { makeContactRouter } from "@modules/contact/contact.routes";
import { makeContainer, type Container } from "@container/index";

export function makeApp(container: Container = makeContainer()): Express {
  const app = express();

  // Render (like Heroku/Railway) terminates TLS at a reverse proxy in
  // front of this process and forwards over plain HTTP. Without this,
  // req.ip is always the proxy's address (collapsing per-IP rate limits
  // onto one shared bucket for every user) and req.protocol reports
  // "http" even on an https request (breaking OAuth callback URLs, which
  // are derived from the request). "1" trusts exactly one hop.
  app.set("trust proxy", 1);

  // (1) helmet — sensible defaults for an API. Cross-origin resource
  // policy is loosened so the frontend (different origin) can <img>
  // user avatars served from this host.
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );

  // (2) cors — strict origin allowlist
  app.use(
    cors({
      origin: [env.frontendOrigin],
      credentials: true,
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "x-request-id"],
      exposedHeaders: ["x-request-id", "Retry-After"],
    }),
  );

  // (3) parsers
  // Stripe webhook MUST see the raw, unparsed body for signature
  // verification — mount it BEFORE express.json so the JSON parser
  // doesn't consume the stream. The router applies express.raw itself.
  app.use(`${env.apiBasePath}/webhooks/stripe`, makeStripeWebhookRouter(container.billingController));

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // (4) passport (sessionless — we use bearer tokens)
  app.use(passport.initialize());

  // (5) request id + (6) request logger
  app.use(requestId);
  app.use(requestLogger);

  // (7) Static serving for uploaded files. Mounted BEFORE rate limit
  // so a heavy gallery view doesn't exhaust the per-IP API budget.
  // The directory is configured via UPLOAD_DIR; defaults to ./uploads.
  app.use(
    env.upload.publicBase,
    express.static(path.resolve(env.upload.dir), {
      fallthrough: false,
      index: false,
      // Long cache: uploads are immutable — their filenames are random,
      // so any "update" produces a different URL.
      maxAge: "30d",
      immutable: true,
    }),
  );

  // (8) rate limit (everything after this is API + counted)
  app.use(generalRateLimit);

  // Liveness / readiness probes — no auth, no envelope, cheap.
  app.get("/healthz", (_req, res) => res.status(200).send("ok"));
  app.get("/readyz", async (_req, res) => {
    try {
      await container.db.$queryRaw`SELECT 1`;
      res.status(200).send("ready");
    } catch {
      res.status(503).send("db unreachable");
    }
  });

  // API version metadata.
  app.get(env.apiBasePath, (_req, res) => ok(res, { name: "aavasar-api", version: "v1" }));

  // (9) routers
  app.use(`${env.apiBasePath}/auth`, makeAuthRouter(container.authController, container.authService));
  app.use(`${env.apiBasePath}/uploads`, makeUploadRouter(container.uploadController));
  app.use(`${env.apiBasePath}/me`, makeMeRouter(container.meController));
  // Application-specific routes mounted BEFORE the generic gig router so
  // that `/gigs/applied` is matched before `/gigs/:id`.
  app.use(`${env.apiBasePath}/gigs`, makeApplicationRouter(container.appController));
  app.use(`${env.apiBasePath}/gigs`, makeGigRouter(container.gigController));
  app.use(`${env.apiBasePath}/companies`, makeCompanyRouter(container.companyController));
  app.use(`${env.apiBasePath}/talent`, makeTalentRouter(container.talentController));
  app.use(`${env.apiBasePath}/notifications`, makeNotificationRouter(container.notificationController));
  app.use(`${env.apiBasePath}/conversations`, makeMessageRouter(container.messageController));
  app.use(`${env.apiBasePath}/student/dashboard`, makeStudentDashboardRouter(container.dashboardController));
  app.use(`${env.apiBasePath}/recruiter`, makeRecruiterDashboardRouter(container.dashboardController));
  app.use(`${env.apiBasePath}/billing`, makeBillingRouter(container.billingController));
  app.use(`${env.apiBasePath}/rewards`, makeRewardsRouter(container.rewardsController));
  app.use(`${env.apiBasePath}/contact`, makeContactRouter(container.contactController));

  // (10) 404
  app.use(notFound);

  // (11) error handler — must be last
  app.use(errorHandler);

  return app;
}
