import type { Request, Response } from "express";
import { ok, okList } from "@lib/response";
import { UnauthorizedError } from "@lib/errors";
import type { Pagination } from "@lib/pagination";
import type { MessageService } from "./message.service";

export class MessageController {
  constructor(private readonly service: MessageService) {}

  start = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const conv = await this.service.startConversation(req.user, req.body.studentId);
    ok(res, conv, 201);
  };

  list = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const items = await this.service.listConversations(req.user);
    ok(res, items);
  };

  messages = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const q = req.query as unknown as Pagination;
    const result = await this.service.listMessages(req.user, req.params.id, q.page, q.pageSize);
    okList(res, result.items, { page: result.page, pageSize: result.pageSize, total: result.total });
  };

  send = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const msg = await this.service.sendMessage(req.user, req.params.id, req.body.body);
    ok(res, msg, 201);
  };

  read = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    await this.service.markRead(req.user, req.params.id);
    ok(res, { ok: true });
  };
}
