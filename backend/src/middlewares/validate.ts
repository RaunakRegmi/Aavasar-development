/**
 * Generic Zod validation middleware.
 *
 * Mounted by a controller as `validate({ body, query, params })`.
 * On parse failure it throws `ValidationError` carrying the field map
 * that the global error handler converts into a 422 with the same
 * `{ code, message, fields }` shape the frontend's `setError` consumes.
 */
import type { NextFunction, Request, Response } from "express";
import type { z } from "zod";
import { ValidationError } from "@lib/errors";

interface Schemas {
  body?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
}

function flatten(error: z.ZodError, prefix: string): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = [prefix, ...issue.path].filter(Boolean).join(".");
    (out[key] ??= []).push(issue.message);
  }
  return out;
}

export function validate(schemas: Schemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const errors: Record<string, string[]> = {};

    if (schemas.body) {
      const r = schemas.body.safeParse(req.body);
      if (!r.success) Object.assign(errors, flatten(r.error, "body"));
      else req.body = r.data;
    }
    if (schemas.query) {
      const r = schemas.query.safeParse(req.query);
      if (!r.success) Object.assign(errors, flatten(r.error, "query"));
      else (req as { query: unknown }).query = r.data;
    }
    if (schemas.params) {
      const r = schemas.params.safeParse(req.params);
      if (!r.success) Object.assign(errors, flatten(r.error, "params"));
      else (req as { params: unknown }).params = r.data;
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError(errors);
    }
    next();
  };
}
