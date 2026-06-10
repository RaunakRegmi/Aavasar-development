import passport from "passport";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import { env } from "@config/env";
import { logger } from "@config/logger";

export function registerLinkedInStrategy(callbackPath: string): boolean {
  if (!env.oauth.linkedin) {
    logger.info({ event: "oauth.linkedin.skip" }, "LinkedIn OAuth not configured.");
    return false;
  }

  passport.use(
    "linkedin",
    new LinkedInStrategy(
      {
        clientID: env.oauth.linkedin.clientId,
        clientSecret: env.oauth.linkedin.clientSecret,
        callbackURL: callbackPath,
        scope: ["openid", "profile", "email"],
      },
      (_accessToken, _refreshToken, profile, done) => {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("LinkedIn profile missing email."));
        done(null, {
          provider: "linkedin" as const,
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
