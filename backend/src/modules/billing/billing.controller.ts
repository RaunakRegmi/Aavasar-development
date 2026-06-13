import type { Request, Response } from "express";
import { ok } from "@lib/response";
import { UnauthorizedError } from "@lib/errors";
import type { BillingService } from "./billing.service";

export class BillingController {
  constructor(private readonly service: BillingService) {}

  me = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    ok(res, await this.service.getMe(req.user.id));
  };

  checkout = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const { target } = req.body as { target: "professional" | "addon_gigslots" | "addon_featured" };
    ok(res, await this.service.createCheckout(req.user.id, target));
  };

  portal = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    ok(res, await this.service.createPortal(req.user.id));
  };

  /**
   * Stripe webhook. Mounted with `express.raw` BEFORE the JSON body parser
   * (see app.ts) so signature verification sees the exact bytes Stripe sent.
   * Always replies 200 on a handled event; signature failures → 400.
   */
  webhook = async (req: Request, res: Response): Promise<void> => {
    const signature = req.header("stripe-signature");
    const handled = await this.service.handleWebhook(req.body as Buffer, signature);
    res.status(200).json({ received: true, handled });
  };
}
