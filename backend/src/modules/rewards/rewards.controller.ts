import type { Request, Response } from "express";
import { ok } from "@lib/response";
import { UnauthorizedError } from "@lib/errors";
import type { RewardsService } from "./rewards.service";

export class RewardsController {
  constructor(private readonly service: RewardsService) {}

  me = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    ok(res, await this.service.getMe(req.user.id));
  };

  perks = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    ok(res, await this.service.listPerks(req.user.id));
  };

  redeem = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const { perkKey } = req.body as { perkKey: string };
    ok(res, await this.service.redeem(req.user.id, perkKey));
  };
}
