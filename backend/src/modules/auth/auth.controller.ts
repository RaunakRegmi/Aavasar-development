/**
 * AuthController — the thin glue between Express and the AuthService.
 *
 * Each method does exactly:
 *   1. Pull validated payload off `req.body` / `req.user`.
 *   2. Call the service.
 *   3. Wrap the result in the standard envelope and respond.
 *
 * NO business logic here. If you find yourself reaching for a SQL
 * query, an external API, or a multi-step orchestration in this file,
 * push it down into the service.
 */
import type { Request, Response } from "express";
import { ok, noContent } from "@lib/response";
import { UnauthorizedError } from "@lib/errors";
import type { AuthService } from "./auth.service";

export class AuthController {
  constructor(private readonly service: AuthService) {}

  signUp = async (req: Request, res: Response): Promise<void> => {
    const session = await this.service.signUp(req.body);
    ok(res, session, 201);
  };

  logIn = async (req: Request, res: Response): Promise<void> => {
    const session = await this.service.logIn(req.body);
    ok(res, session);
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    const session = await this.service.refresh(req.body.refreshToken);
    ok(res, session);
  };

  logOut = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    await this.service.logOut(req.user.id, req.body?.refreshToken);
    noContent(res);
  };

  me = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const user = await this.service.getCurrentUser(req.user.id);
    ok(res, user);
  };

  updateMe = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const user = await this.service.updateProfile(req.user.id, req.body);
    ok(res, user);
  };

  changePassword = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    await this.service.changePassword(req.user.id, {
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
    });
    // 204 — client should locally clear its session and bounce to /log-in.
    res.status(204).send();
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    await this.service.requestPasswordReset(req.body);
    // 200 always — even on a miss — see service for the rationale.
    ok(res, null);
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    const session = await this.service.resetPassword(req.body);
    ok(res, session);
  };
}
