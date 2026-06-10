import type { Request, Response } from "express";
import { ok } from "@lib/response";
import { UnauthorizedError } from "@lib/errors";
import type { CompanyService } from "./company.service";
import type { CompanyRegistrationRequest } from "./company.contracts";

export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const result = await this.service.register(
      req.user,
      req.body as CompanyRegistrationRequest,
    );
    ok(res, result, 201);
  };
}
