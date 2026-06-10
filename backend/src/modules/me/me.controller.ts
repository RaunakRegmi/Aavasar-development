/**
 * MeController — the ProfileController deliverable.
 *
 *   GET /api/v1/me   →   aggregated profile (user + company + uploads)
 *
 * Strictly scoped — every action operates on `req.user.id`. There is no
 * `/me/:id` form, by design: no one fetches "someone else's me".
 */
import type { Request, Response } from "express";
import { ok } from "@lib/response";
import { UnauthorizedError } from "@lib/errors";
import type { MeService } from "./me.service";
import type { AuthService } from "@modules/auth/auth.service";

export class MeController {
  constructor(
    private readonly meService: MeService,
    private readonly authService: AuthService,
  ) {}

  /** GET /api/v1/me */
  getMe = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const aggregate = await this.meService.getAggregate(req.user.id);
    ok(res, aggregate);
  };

  /**
   * PATCH /api/v1/me/profile — the alias the design doc names. It
   * delegates to the same AuthService.updateProfile that backs
   * PATCH /auth/me, so there's no second source of truth for the
   * profile-patch business rules.
   */
  patchProfile = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const user = await this.authService.updateProfile(req.user.id, req.body);
    ok(res, user);
  };
}
