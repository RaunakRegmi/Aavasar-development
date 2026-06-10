import type { NextFunction, Request, Response } from "express";
import { NotFoundError } from "@lib/errors";

/**
 * Catch-all 404 — must be mounted AFTER every real route. Forwards a
 * `NotFoundError` into the global handler so the response uses the
 * standard `{ code, message }` envelope.
 */
export function notFound(_req: Request, _res: Response, next: NextFunction): void {
  next(new NotFoundError("Route not found."));
}
