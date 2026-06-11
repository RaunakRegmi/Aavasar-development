import type { Request, Response } from "express";
import { ok, okList } from "@lib/response";
import type { TalentService } from "./talent.service";
import type { TalentFilters } from "./talent.contracts";

export class TalentController {
  constructor(private readonly service: TalentService) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const filters = req.query as unknown as TalentFilters;
    const result = await this.service.list(filters);
    okList(res, result.items, {
      page: result.page,
      pageSize: result.pageSize,
      total: result.total,
    });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const talent = await this.service.getById(req.params.id);
    ok(res, talent);
  };
}
