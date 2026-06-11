/**
 * JWT helpers — separate secrets and shorter TTL for access vs refresh
 * tokens. The refresh token also carries a `tokenVersion` claim that
 * the auth service compares against the user row at refresh time; we
 * bump the version on every "force logout" (password change, security
 * event) to invalidate all outstanding refresh tokens at once.
 */
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import crypto from "node:crypto";
import { env } from "@config/env";

export interface AccessTokenClaims extends JwtPayload {
  sub: string;          // user id
  role: "student" | "recruiter" | "admin";
  email: string;
}

export interface RefreshTokenClaims extends JwtPayload {
  sub: string;          // user id
  jti: string;          // matches the DB row's id
  tokenVersion: number; // user.tokenVersion at issue time
}

const ACCESS_OPTS: SignOptions = {
  algorithm: "HS256",
  expiresIn: env.jwt.accessTtlSeconds,
  issuer: "aavasar",
  audience: "aavasar.web",
};

const REFRESH_OPTS: SignOptions = {
  algorithm: "HS256",
  expiresIn: env.jwt.refreshTtlSeconds,
  issuer: "aavasar",
  audience: "aavasar.web",
};

export function signAccessToken(claims: Omit<AccessTokenClaims, "iat" | "exp">): string {
  return jwt.sign(claims, env.jwt.accessSecret, ACCESS_OPTS);
}

export function signRefreshToken(claims: Omit<RefreshTokenClaims, "iat" | "exp">, ttlSeconds?: number): string {
  const opts: SignOptions = {
    ...REFRESH_OPTS,
    ...(ttlSeconds !== undefined ? { expiresIn: ttlSeconds } : {}),
  };
  return jwt.sign(claims, env.jwt.refreshSecret, opts);
}

export function verifyAccessToken(token: string): AccessTokenClaims {
  return jwt.verify(token, env.jwt.accessSecret, {
    issuer: "aavasar",
    audience: "aavasar.web",
  }) as AccessTokenClaims;
}

export function verifyRefreshToken(token: string): RefreshTokenClaims {
  return jwt.verify(token, env.jwt.refreshSecret, {
    issuer: "aavasar",
    audience: "aavasar.web",
  }) as RefreshTokenClaims;
}

/**
 * Refresh tokens are stored hashed in the database so a DB leak alone
 * doesn't grant session access. We hash with SHA-256 (the token itself
 * has 256+ bits of entropy via HS256, so a cryptographic KDF would
 * be overkill).
 */
export function hashRefreshToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
