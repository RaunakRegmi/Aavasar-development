import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "@config/env";
import { logger } from "@config/logger";

/**
 * Google OAuth 2.0 strategy. Only registers if both client id + secret
 * are present in env — otherwise the `/auth/oauth/google/start` route
 * 503s with a clear message rather than crashing on import.
 */
export function registerGoogleStrategy(callbackPath: string): boolean {
  if (!env.oauth.google) {
    logger.info({ event: "oauth.google.skip" }, "Google OAuth not configured.");
    return false;
  }

  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: env.oauth.google.clientId,
        clientSecret: env.oauth.google.clientSecret,
        callbackURL: callbackPath,
      },
      (_accessToken, _refreshToken, profile, done) => {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("Google profile missing email."));
        done(null, {
          provider: "google" as const,
          subject: profile.id,
          email,
          fullName: profile.displayName,
          avatarUrl: profile.photos?.[0]?.value,
        });
      },
    ),
  );
  return true;
}
