/**
 * GigController — thin HTTP <-> service glue. Validated payloads come
 * in via `req.body` / `req.query` / `req.params`; envelope-wrapped
 * results go out via `ok()` / `okList()`.
 */
import type { Request, Response } from "express";
import { ok, okList, noContent } from "@lib/response";
import { UnauthorizedError } from "@lib/errors";
import type { Pagination } from "@lib/pagination";
import type { GigService } from "./gig.service";
import type { ListGigsQuery, CreateGigRequest, UpdateGigRequest } from "./gig.contracts";

export class GigController {
  constructor(private readonly service: GigService) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const filters = req.query as unknown as ListGigsQuery;
    const { items, total, page, pageSize } = await this.service.listPublic(filters);
    okList(res, items, { page, pageSize, total });
  };

  featured = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.service.listFeatured();
    ok(res, items);
  };

  mine = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const { items, total, page, pageSize } = await this.service.listMine(
      req.user,
      req.query as unknown as Pagination,
    );
    okList(res, items, { page, pageSize, total });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const gig = await this.service.getById(req.params.id);
    ok(res, gig);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const created = await this.service.create(req.user, req.body as CreateGigRequest);
    ok(res, created, 201);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const patched = await this.service.update(
      req.user,
      req.params.id,
      req.body as UpdateGigRequest,
    );
    ok(res, patched);
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    await this.service.delete(req.user, req.params.id);
    noContent(res);
  };
}
