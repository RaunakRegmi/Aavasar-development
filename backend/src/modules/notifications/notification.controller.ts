import type { Request, Response } from "express";
import { noContent } from "@lib/response";
import { UnauthorizedError } from "@lib/errors";
import type { NotificationService } from "./notification.service";
import type { ListNotificationsQuery } from "./notification.contracts";

export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  list = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const { items, total, unread } = await this.service.list(
      req.user.id,
      req.query as unknown as ListNotificationsQuery,
    );
    res.json({ data: items, meta: { total, page: 1, pageSize: items.length, unread } });
  };

  markAllRead = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    await this.service.markAllRead(req.user.id);
    noContent(res);
  };
}
