import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { env } from "@config/env";
import { logger } from "@config/logger";

export function registerGitHubStrategy(callbackPath: string): boolean {
  if (!env.oauth.github) {
    logger.info({ event: "oauth.github.skip" }, "GitHub OAuth not configured.");
    return false;
  }

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: env.oauth.github.clientId,
        clientSecret: env.oauth.github.clientSecret,
        callbackURL: callbackPath,
        scope: ["user:email"],
      },
      (_accessToken: string, _refreshToken: string, profile: any, done: any) => {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("GitHub profile missing email."));
        done(null, {
          provider: "github" as const,
          subject: profile.id,
          email,
          fullName: profile.displayName || profile.username,
          avatarUrl: profile.photos?.[0]?.value,
        });
      },
    ),
  );
  return true;
}
