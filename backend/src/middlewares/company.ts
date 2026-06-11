import type { NextFunction, Request, Response } from "express";
import { prisma } from "@config/prisma";
import { ForbiddenError, NotFoundError } from "@lib/errors";

export function validateCompanyOwnership() {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const { companyId } = req.body;
    if (!companyId) {
      return next(); // Freelance gig, skip ownership check
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundError("Company not found.");
    }

    if (company.contactUserId !== req.user?.id) {
      throw new ForbiddenError("You do not have permission to post for this company.");
    }

    if (company.registrationStatus !== "approved") {
      throw new ForbiddenError("Company registration is not yet approved.");
    }

    next();
  };
}
