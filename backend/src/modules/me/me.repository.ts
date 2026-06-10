/**
 * Me repository — the ONLY place that issues the multi-relation read
 * for an aggregated profile. Kept here (instead of layering it through
 * UserRepository + CompanyRepository + UploadRepository) so the SQL
 * planner gets one shot at optimising the join graph.
 */
import type { PrismaClient } from "@prisma/client";

export class MeRepository {
  constructor(private readonly db: PrismaClient) {}

  /**
   * Fetches the user with their company (if recruiter) and ALL uploads.
   * We post-process in the service to collapse "all uploads" → "latest
   * per kind" so we ship one query, not N+1.
   */
  fetchAggregate(userId: string) {
    return this.db.user.findUnique({
      where: { id: userId },
      include: {
        companyMembership: {
          select: { id: true, name: true, verified: true },
        },
        uploads: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            kind: true,
            url: true,
            mimeType: true,
            sizeBytes: true,
            originalName: true,
            createdAt: true,
          },
        },
      },
    });
  }
}
