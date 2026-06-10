/**
 * Global error handler — the single funnel through which every error
 * leaves the process.
 *
 * Responsibilities:
 *   1. Distinguish OPERATIONAL (user-correctable) from PROGRAMMER
 *      (system bug) errors. Operational ones surface their message;
 *      programmer ones get a generic 500 and a fatal-level log entry.
 *   2. Translate Prisma known errors (P2002 unique violation, P2025
 *      not found, …) into the appropriate AppError before responding,
 *      so callers don't need try/catch around every repository call.
 *   3. Translate ZodError directly to a 422 with the same field map a
 *      `validate(...)` middleware would have produced.
 *   4. Emit the exact `{ code, message, fields?, traceId }` envelope
 *      the frontend's L5 transport normalizes into typed `ApiError`
 *      / `UnauthorizedError` / `ForbiddenError` classes.
 *
 * MUST be the LAST middleware mounted — Express identifies the global
 * handler by its 4-argument signature.
 *
 * Note: third-party errors (jsonwebtoken, Prisma) are matched by their
 * `.name` / `.code` properties, NOT by `instanceof`. That keeps this
 * module free of module-load coupling — it works whether or not the
 * Prisma client has been generated, and dodges ESM/CJS interop quirks
 * in `jsonwebtoken` (its constructors aren't named-importable under
 * Node's ESM loader).
 */
import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { logger } from "@config/logger";
import { env } from "@config/env";
import {
  AppError,
  ConflictError,
  InternalError,
  NotFoundError,
  RateLimitError,
  UnauthorizedError,
  ValidationError,
} from "@lib/errors";

/** Duck-types a Prisma `PrismaClientKnownRequestError`. */
interface PrismaKnownError {
  code: string;
  message: string;
  meta?: Record<string, unknown>;
}
function isPrismaKnownError(err: unknown): err is PrismaKnownError {
  if (typeof err !== "object" || err === null) return false;
  const name = (err as { constructor?: { name?: string } }).constructor?.name;
  if (name !== "PrismaClientKnownRequestError") return false;
  const code = (err as { code?: unknown }).code;
  return typeof code === "string" && code.startsWith("P");
}

/** Convert any thrown value into our AppError hierarchy. */
function normalize(err: unknown): AppError {
  if (err instanceof AppError) return err;

  if (err instanceof ZodError) {
    const fields: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const key = issue.path.join(".") || "_";
      (fields[key] ??= []).push(issue.message);
    }
    return new ValidationError(fields);
  }

  // JWT errors — name-based so we don't import classes from jsonwebtoken
  // (those named exports aren't available under Node's ESM loader).
  if (err instanceof Error && err.name === "TokenExpiredError") {
    return new UnauthorizedError("Your session expired. Please sign in again.");
  }
  if (err instanceof Error && err.name === "JsonWebTokenError") {
    return new UnauthorizedError("Invalid authentication token.");
  }

  // Prisma known errors — duck-typed.
  if (isPrismaKnownError(err)) {
    switch (err.code) {
      case "P2002": {
        const target = (err.meta?.target as string[] | string | undefined) ?? "field";
        const field = Array.isArray(target) ? target[0] ?? "field" : target;
        const label = Array.isArray(target) ? target.join(", ") : target;
        return new ConflictError(`The ${label} is already in use.`, {
          fields: { [field]: ["Already in use."] },
        });
      }
      case "P2025":
        return new NotFoundError("Resource not found.");
      default:
        return new InternalError("Database error.", err);
    }
  }

  // Anything else — programmer error.
  return new InternalError(
    err instanceof Error ? err.message : "An unexpected error occurred.",
    err,
  );
}

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const appErr = normalize(err);
  const traceId = req.id;

  if (appErr.isOperational) {
    logger.warn(
      {
        event: "error.operational",
        traceId,
        path: req.path,
        method: req.method,
        status: appErr.status,
        code: appErr.code,
        msg: appErr.message,
        userId: req.user?.id,
      },
      appErr.message,
    );
  } else {
    logger.error(
      {
        event: "error.programmer",
        traceId,
        path: req.path,
        method: req.method,
        status: appErr.status,
        code: appErr.code,
        err: {
          name: appErr.name,
          message: appErr.message,
          stack: appErr.stack,
          cause: (appErr as { cause?: unknown }).cause,
        },
        userId: req.user?.id,
      },
      appErr.message,
    );
  }

  if (appErr instanceof RateLimitError) {
    res.setHeader("Retry-After", String(appErr.retryAfterSeconds));
  }

  const safeMessage =
    !appErr.isOperational && env.isProd
      ? "Something went wrong on our end. Please try again."
      : appErr.message;

  res.status(appErr.status).json({
    code: appErr.code,
    message: safeMessage,
    ...(appErr.fields ? { fields: appErr.fields } : {}),
    traceId,
  });
};
