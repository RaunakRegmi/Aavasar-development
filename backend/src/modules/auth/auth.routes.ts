/**
 * Auth routes — the entry point for `/auth/*`.
 *
 *   POST /auth/sign-up
 *   POST /auth/log-in
 *   POST /auth/refresh
 *   POST /auth/log-out                       (requires auth)
 *   GET  /auth/me                            (requires auth)
 *   POST /auth/forgot-password
 *   POST /auth/reset-password
 *
 *   GET  /auth/oauth/google/start
 *   GET  /auth/oauth/google/callback
 *   (mirrors for linkedin, github)
 *
 * The OAuth callback issues tokens in the JSON envelope on success;
 * since the frontend doesn't yet have a callback page, we also support
 * redirecting with tokens in the query for browser-driven flows.
 */
import { Router, type Request, type Response } from "express";
import passport from "passport";
import { validate } from "@middlewares/validate";
import { requireAuth } from "@middlewares/auth";
import { authRateLimit } from "@middlewares/rateLimit";
import { asyncHandler } from "@lib/async";
import { env } from "@config/env";
import { ServiceUnavailableError } from "@lib/errors";
import {
  ChangePasswordRequestSchema,
  ForgotPasswordRequestSchema,
  LogInRequestSchema,
  RefreshRequestSchema,
  ResetPasswordRequestSchema,
  SignUpRequestSchema,
  UpdateProfileRequestSchema,
} from "./auth.contracts";
import type { AuthController } from "./auth.controller";
import type { AuthService } from "./auth.service";
import { registerGoogleStrategy } from "./strategies/google";
import { registerLinkedInStrategy } from "./strategies/linkedin";
import { registerGitHubStrategy } from "./strategies/github";

type OAuthProfile = {
  provider: "google" | "linkedin" | "github";
  subject: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
};

export function makeAuthRouter(controller: AuthController, service: AuthService): Router {
  const router = Router();

  // ---- Local credentials ----
  router.post(
    "/sign-up",
    authRateLimit,
    validate({ body: SignUpRequestSchema }),
    asyncHandler(controller.signUp),
  );
  router.post(
    "/log-in",
    authRateLimit,
    validate({ body: LogInRequestSchema }),
    asyncHandler(controller.logIn),
  );
  router.post(
    "/refresh",
    authRateLimit,
    validate({ body: RefreshRequestSchema }),
    asyncHandler(controller.refresh),
  );
  router.post("/log-out", requireAuth, asyncHandler(controller.logOut));
  router.get("/me", requireAuth, asyncHandler(controller.me));
  router.patch(
    "/me",
    requireAuth,
    validate({ body: UpdateProfileRequestSchema }),
    asyncHandler(controller.updateMe),
  );
  router.patch(
    "/password",
    requireAuth,
    authRateLimit,
    validate({ body: ChangePasswordRequestSchema }),
    asyncHandler(controller.changePassword),
  );
  router.post(
    "/forgot-password",
    authRateLimit,
    validate({ body: ForgotPasswordRequestSchema }),
    asyncHandler(controller.forgotPassword),
  );
  router.post(
    "/reset-password",
    authRateLimit,
    validate({ body: ResetPasswordRequestSchema }),
    asyncHandler(controller.resetPassword),
  );

  // ---- OAuth: register strategies (each is a no-op if env is missing) ----

  const PROVIDERS: ReadonlyArray<{
    name: "google" | "linkedin" | "github";
    register: (cb: string) => boolean;
    /** OAuth scopes; LinkedIn requires `openid` in addition to email. */
    scope?: ReadonlyArray<string>;
  }> = [
    { name: "google", register: registerGoogleStrategy, scope: ["profile", "email"] },
    { name: "linkedin", register: registerLinkedInStrategy, scope: ["openid", "profile", "email"] },
    { name: "github", register: registerGitHubStrategy, scope: ["user:email"] },
  ];

  for (const p of PROVIDERS) {
    // Widen the strategy name to `string` so passport.authenticate's
    // literal-typed overload doesn't reject the union.
    const providerName: string = p.name;
    const callbackPath = `${env.apiBasePath}/auth/oauth/${p.name}/callback`;
    const enabled = p.register(callbackPath);

    router.get(`/oauth/${p.name}/start`, (req: Request, res: Response, next: (err?: unknown) => void) => {
      if (!enabled) {
        return next(
          new ServiceUnavailableError(`${p.name} OAuth is not configured on this environment.`),
        );
      }
      const opts = { session: false, scope: p.scope ? [...p.scope] : [] };
      // The Express types here are looser than what passport ships;
      // cast through `unknown` to align with the mutable AuthenticateOptions.
      (passport.authenticate(providerName, opts as never) as unknown as (
        req: Request,
        res: Response,
        next: (err?: unknown) => void,
      ) => void)(req, res, next);
    });

    router.get(
      `/oauth/${p.name}/callback`,
      (req: Request, res: Response, next: (err?: unknown) => void) => {
        if (!enabled) {
          return next(
            new ServiceUnavailableError(`${p.name} OAuth is not configured on this environment.`),
          );
        }
        const opts = { session: false, failWithError: true };
        (passport.authenticate(providerName, opts as never) as unknown as (
          req: Request,
          res: Response,
          next: (err?: unknown) => void,
        ) => void)(req, res, next);
      },
      asyncHandler(async (req, res) => {
        const profile = req.user as OAuthProfile | undefined;
        if (!profile) throw new ServiceUnavailableError("OAuth callback returned no profile.");
        const session = await service.loginOAuthUser(profile);
        // Redirect-with-tokens flow for browser OAuth round-trips.
        const target = new URL(env.oauthSuccessRedirect);
        target.searchParams.set("accessToken", session.accessToken);
        target.searchParams.set("refreshToken", session.refreshToken);
        res.redirect(target.toString());
      }),
      // Passport's `failWithError` raises an Error when the auth stage
      // fails (e.g. user denied consent). Redirect to the frontend's
      // failure URL so the user isn't stranded on a JSON error page.
      (_err: unknown, _req: Request, res: Response, _next: unknown) => {
        const target = new URL(env.oauthFailureRedirect);
        target.searchParams.set("reason", "oauth_failed");
        res.redirect(target.toString());
      },
    );
  }

  return router;
}
