import { ForbiddenError, ConflictError } from "@lib/errors";
import type { AuthedUser } from "@middlewares/auth";
import { ApplicationRepository } from "./application.repository";
import type {
  CreateApplicationRequest,
  GigApplication,
  ListMyApplicationsQuery,
} from "./application.contracts";

export class ApplicationService {
  constructor(private readonly repo: ApplicationRepository) {}

  async listMyApplications(
    userId: string,
    filters: ListMyApplicationsQuery,
  ): Promise<{ items: GigApplication[]; total: number; page: number; pageSize: number }> {
    const [raw, total] = await this.repo.listForUser(userId, filters);
    const items = raw.map((r: any) => this.toDto(r));
    return { items, total, page: filters.page ?? 1, pageSize: filters.pageSize ?? 20 };
  }

  async apply(actor: AuthedUser, input: CreateApplicationRequest): Promise<GigApplication> {
    if (actor.role !== "student") {
      throw new ForbiddenError("Only students can apply to gigs.");
    }
    const existing = await this.repo.findByUserAndGig(actor.id, input.gigId);
    if (existing) {
      throw new ConflictError("You have already applied to this gig.");
    }
    const row = await this.repo.create({
      userId: actor.id,
      gigId: input.gigId,
      coverNote: input.coverNote ?? null,
      status: "pending",
    });
    return this.toDto(row);
  }

  private toDto(row: any): GigApplication {
    return {
      id: row.id,
      gigId: row.gigId,
      status: row.status,
      coverNote: row.coverNote ?? null,
      createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
      gig: {
        id: row.gig.id,
        title: row.gig.title,
        category: row.gig.category,
        company: row.gig.company,
        location: row.gig.location,
        duration: row.gig.duration,
        payKind: row.gig.payKind,
        pay: { amountMinor: row.gig.payAmountMinor, currency: "NPR" },
        status: row.gig.status,
        postedAt: row.gig.postedAt instanceof Date ? row.gig.postedAt.toISOString() : row.gig.postedAt,
      },
    };
  }
}
