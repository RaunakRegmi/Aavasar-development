/**
 * `asyncHandler` — wraps an async Express handler so thrown errors
 * (including rejected promises) reach the global error middleware
 * instead of becoming unhandled rejections.
 *
 * Usage:
 *   router.get("/me", asyncHandler(async (req, res) => { ... }))
 */
import type { NextFunction, Request, RequestHandler, Response } from "express";

type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

export function asyncHandler(fn: AsyncFn): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
