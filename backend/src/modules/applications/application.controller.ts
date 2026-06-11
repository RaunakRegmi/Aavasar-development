import type { Request, Response } from "express";
import { ok, okList } from "@lib/response";
import { UnauthorizedError } from "@lib/errors";
import type { ApplicationService } from "./application.service";
import type { CreateApplicationRequest, ListMyApplicationsQuery } from "./application.contracts";

export class ApplicationController {
  constructor(private readonly service: ApplicationService) {}

  listMy = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const result = await this.service.listMyApplications(
      req.user.id,
      req.query as unknown as ListMyApplicationsQuery,
    );
    okList(res, result.items, { page: result.page, pageSize: result.pageSize, total: result.total });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const created = await this.service.apply(req.user, req.body as CreateApplicationRequest);
    ok(res, created, 201);
  };

  listForGig = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const result = await this.service.listForGig(req.user.id, req.params.gigId, page, pageSize);
    okList(res, result.items, { page: result.page, pageSize: result.pageSize, total: result.total });
  };

  updateStatus = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const updated = await this.service.updateStatus(req.user.id, req.params.id, req.body.status);
    ok(res, updated);
  };
}
