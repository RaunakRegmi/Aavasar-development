/**
 * Rate limiting via `rate-limiter-flexible`.
 *
 * Two limiters: a general one for the whole API and a stricter one
 * scoped to auth endpoints to discourage credential stuffing. The
 * key is `req.ip` here — when we put nginx in front, also include
 * `x-forwarded-for` once Express trust-proxy is enabled.
 */
import { RateLimiterMemory } from "rate-limiter-flexible";
import type { NextFunction, Request, Response } from "express";
import { env } from "@config/env";
import { RateLimitError } from "@lib/errors";

const general = new RateLimiterMemory({
  points: env.rateLimit.general.max,
  duration: env.rateLimit.general.windowSec,
});

const auth = new RateLimiterMemory({
  points: env.rateLimit.auth.max,
  duration: env.rateLimit.auth.windowSec,
});

function makeMiddleware(limiter: RateLimiterMemory) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      await limiter.consume(req.ip ?? "unknown");
      next();
    } catch (e) {
      const retryAfterMs = (e as { msBeforeNext?: number }).msBeforeNext ?? 1000;
      throw new RateLimitError(Math.ceil(retryAfterMs / 1000));
    }
  };
}

export const generalRateLimit = makeMiddleware(general);
export const authRateLimit = makeMiddleware(auth);
