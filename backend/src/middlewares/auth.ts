/**
 * Auth middlewares — `requireAuth` and `requireRole`.
 *
 * `requireAuth` verifies the bearer access token and decorates the
 * request with a typed `req.user` containing { id, role, email }. Any
 * route past this point can trust `req.user` is present.
 *
 * `requireRole` is a small factory that chains after `requireAuth` and
 * asserts the authenticated user's role is in the allowlist.
 */
import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken, type AccessTokenClaims } from "@lib/jwt";
import { ForbiddenError, UnauthorizedError } from "@lib/errors";

export interface AuthedUser {
  id: string;
  role: "student" | "recruiter" | "admin";
  email: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthedUser;
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.header("authorization");
  if (!header || !header.toLowerCase().startsWith("bearer ")) {
    throw new UnauthorizedError("Missing bearer token.");
  }
  const token = header.slice(7).trim();
  let claims: AccessTokenClaims;
  try {
    claims = verifyAccessToken(token);
  } catch {
    throw new UnauthorizedError("Invalid or expired access token.");
  }
  req.user = { id: claims.sub, role: claims.role, email: claims.email };
  next();
}

export function requireRole(...allowed: ReadonlyArray<AuthedUser["role"]>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) throw new UnauthorizedError();
    if (!allowed.includes(req.user.role)) {
      throw new ForbiddenError(`This action requires one of: ${allowed.join(", ")}.`);
    }
    next();
  };
}

export const requireRecruiter = requireRole("recruiter");
export const requireAdmin = requireRole("admin");
export const requireStudent = requireRole("student");
