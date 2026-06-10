import type { NextFunction, Request, Response } from "express";
import crypto from "node:crypto";

/**
 * Honour an inbound `x-request-id` (the frontend's L5 transport stamps one)
 * or mint a fresh UUID. The id is echoed back on every response and is
 * the join key between a user-reported issue and our logs.
 */
declare module "express-serve-static-core" {
  interface Request {
    id: string;
  }
}

export function requestId(req: Request, res: Response, next: NextFunction): void {
  const inbound = req.header("x-request-id");
  req.id = inbound && /^[\w-]{8,128}$/.test(inbound) ? inbound : crypto.randomUUID();
  res.setHeader("x-request-id", req.id);
  next();
}
