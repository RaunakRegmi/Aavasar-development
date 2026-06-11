import { ForbiddenError, ConflictError, NotFoundError } from "@lib/errors";
import type { AuthedUser } from "@middlewares/auth";
import { ApplicationRepository } from "./application.repository";
import type {
  CreateApplicationRequest,
  GigApplication,
  ListMyApplicationsQuery,
} from "./application.contracts";
import type { NotificationService } from "../notifications/notification.service";

export class ApplicationService {
  constructor(
    private readonly repo: ApplicationRepository,
    private readonly notifications: NotificationService,
  ) {}

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
    // Trigger notification for the recruiter
    if (row.gig?.postedByUserId) {
      await this.notifications.create({
        userId: row.gig.postedByUserId,
        kind: "application_created",
        title: "New application received",
        description: `${actor.email} applied to "${row.gig.title}"`,
        link: `/recruiter/applicants/${row.id}`,
      });
    }
    return this.toDto(row);
  }

  async listForGig(
    _recruiterId: string,
    gigId: string,
    page: number,
    pageSize: number,
  ) {
    const [items, total] = await this.repo.listForGig(gigId, page, pageSize);
    return { items, total, page, pageSize };
  }

  async updateStatus(
    _recruiterId: string,
    applicationId: string,
    status: any,
  ): Promise<GigApplication> {
    const app = await this.repo.findById(applicationId);
    if (!app) throw new NotFoundError("Application not found.");
    const row = await this.repo.updateStatus(applicationId, status);
    // Trigger notification for the student
    const statusLabel = status === "accepted" ? "accepted" : "rejected";
    await this.notifications.create({
      userId: row.userId,
      kind: status === "accepted" ? "application_accepted" : "application_rejected",
      title: `Application ${statusLabel}`,
      description: `Your application for "${row.gig?.title ?? "Unknown gig"}" has been ${statusLabel}.`,
      link: `/student/gigs/${row.gigId}`,
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
