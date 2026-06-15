import type { Request, Response } from "express";
import { noContent } from "@lib/response";
import type { ContactService } from "./contact.service";
import type { ContactRequest } from "./contact.contracts";

export class ContactController {
  constructor(private readonly service: ContactService) {}

  submit = async (req: Request, res: Response): Promise<void> => {
    await this.service.submit(req.body as ContactRequest);
    noContent(res);
  };
}
