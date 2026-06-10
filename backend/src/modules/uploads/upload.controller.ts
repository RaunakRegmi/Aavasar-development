import type { Request, Response } from "express";
import { ok } from "@lib/response";
import { UnauthorizedError } from "@lib/errors";
import type { UploadKind } from "@lib/upload";
import type { UploadService } from "./upload.service";

export class UploadController {
  constructor(private readonly service: UploadService) {}

  private factory(kind: UploadKind) {
    return async (req: Request, res: Response): Promise<void> => {
      if (!req.user) throw new UnauthorizedError();
      const dto = await this.service.upload({
        userId: req.user.id,
        kind,
        file: req.file,
      });
      ok(res, dto, 201);
    };
  }

  uploadAvatar = this.factory("avatar");
  uploadBanner = this.factory("banner");
  uploadPortfolio = this.factory("portfolio");
  uploadNid = this.factory("nid");
  uploadAttachment = this.factory("attachment");
  uploadCompanyLogo = this.factory("companyLogo");
  uploadCompanyDocument = this.factory("companyDocument");
}
