/**
 * Standard response envelope — every 2xx response is wrapped as
 * `{ data, meta? }`. The frontend's L5 transport unwraps this in
 * `request<T>()` / `requestEnvelope<T>()` so the shape MUST match.
 */
import type { Response } from "express";

export interface ApiEnvelope<T> {
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    [k: string]: unknown;
  };
}

export function ok<T>(res: Response, data: T, status = 200): Response {
  return res.status(status).json({ data } satisfies ApiEnvelope<T>);
}

export function okList<T>(
  res: Response,
  data: T[],
  meta: { page: number; pageSize: number; total: number },
  status = 200,
): Response {
  return res.status(status).json({ data, meta } satisfies ApiEnvelope<T[]>);
}

export function noContent(res: Response): Response {
  return res.status(204).send();
}
