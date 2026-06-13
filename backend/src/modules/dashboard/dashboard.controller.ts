import type { Request, Response } from "express";
import { ok } from "@lib/response";
import { UnauthorizedError } from "@lib/errors";
import type { DashboardService } from "./dashboard.service";

export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  studentKpis = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    ok(res, await this.service.studentKpis(req.user.id));
  };

  studentActiveGigs = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    ok(res, await this.service.studentActiveGigs(req.user.id));
  };

  studentUpcoming = async (_req: Request, res: Response): Promise<void> => {
    ok(res, await this.service.studentUpcoming());
  };

  studentCourse = async (_req: Request, res: Response): Promise<void> => {
    ok(res, await this.service.studentCourse());
  };

  recruiterKpis = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    ok(res, await this.service.recruiterKpis(req.user.id));
  };

  recruiterApplicants = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    ok(res, await this.service.recruiterApplicants(req.user.id));
  };

  recruiterPipeline = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    ok(res, await this.service.recruiterPipeline(req.user.id));
  };
}
