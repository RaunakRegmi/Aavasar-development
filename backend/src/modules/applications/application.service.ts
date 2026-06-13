import { ForbiddenError, ConflictError, NotFoundError } from "@lib/errors";
import type { AuthedUser } from "@middlewares/auth";
import { ApplicationRepository } from "./application.repository";
import type {
  Applicant,
  ApplicantDetail,
  CreateApplicationRequest,
  GigApplication,
  ListMyApplicationsQuery,
} from "./application.contracts";
import type { NotificationService } from "../notifications/notification.service";
import type { BillingRepository } from "@modules/billing/billing.repository";
import { planFor } from "@modules/billing/plans";

export class ApplicationService {
  constructor(
    private readonly repo: ApplicationRepository,
    private readonly notifications: NotificationService,
    private readonly billingRepo: BillingRepository,
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
    // Hard quota: a Basic recruiter only receives N applications/month
    // across their gigs. Once they hit it, new applications are blocked.
    await this.assertGigAcceptingApplications(input.gigId);
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
    actor: AuthedUser,
    gigId: string,
    page: number,
    pageSize: number,
  ): Promise<{ items: Applicant[]; total: number; page: number; pageSize: number }> {
    await this.assertOwnsGig(actor, gigId);
    const [rows, total] = await this.repo.listForGig(gigId, page, pageSize);
    const items = (rows as any[]).map((r) => this.toApplicant(r));
    return { items, total, page, pageSize };
  }

  /** Single applicant detail (full student profile) for the recruiter. */
  async getApplicantDetail(actor: AuthedUser, applicationId: string): Promise<ApplicantDetail> {
    const row = await this.repo.findByIdWithApplicant(applicationId);
    if (!row) throw new NotFoundError("Applicant not found.");
    if (actor.role !== "admin" && (row as any).gig.postedByUserId !== actor.id) {
      throw new ForbiddenError("You can only view applicants for gigs you posted.");
    }
    const u = (row as any).user;
    return {
      id: row.id,
      status: row.status as ApplicantDetail["status"],
      coverNote: row.coverNote ?? null,
      createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : (row.createdAt as any),
      gig: { id: (row as any).gig.id, title: (row as any).gig.title },
      applicant: {
        id: u.id,
        fullName: u.fullName,
        avatarUrl: u.avatarUrl ?? null,
        bannerUrl: u.bannerUrl ?? null,
        headline: u.headline ?? null,
        bio: u.bio ?? null,
        skills: u.skills ?? [],
        verified: u.verified,
      },
    };
  }

  async updateStatus(
    actor: AuthedUser,
    applicationId: string,
    status: any,
  ): Promise<GigApplication> {
    const app = await this.repo.findById(applicationId);
    if (!app) throw new NotFoundError("Application not found.");
    if (actor.role !== "admin" && (app as any).gig?.postedByUserId !== actor.id) {
      throw new ForbiddenError("You can only update applicants for gigs you posted.");
    }
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

  /**
   * Enforce the gig owner's monthly application quota. Uncapped plans
   * (Professional/Enterprise) skip the check. Phrased gig-side so the
   * applying student isn't shown the recruiter's billing details.
   */
  private async assertGigAcceptingApplications(gigId: string): Promise<void> {
    const gig = await this.repo.findGigOwner(gigId);
    if (!gig) throw new NotFoundError("Gig not found.");
    const owner = await this.billingRepo.findById(gig.postedByUserId);
    if (!owner) return;
    const limit = planFor(owner.subscriptionTier).limits.applicationsPerMonth;
    if (!Number.isFinite(limit)) return; // unlimited
    const received = await this.billingRepo.countApplicationsThisMonth(owner.id, new Date());
    if (received >= limit) {
      throw new ForbiddenError(
        "This gig has reached its application limit for the month. Please check back next month.",
      );
    }
  }

  /** Authorize a recruiter (or admin) to act on a gig's applicants. */
  private async assertOwnsGig(actor: AuthedUser, gigId: string): Promise<void> {
    const gig = await this.repo.findGigOwner(gigId);
    if (!gig) throw new NotFoundError("Gig not found.");
    if (actor.role !== "admin" && gig.postedByUserId !== actor.id) {
      throw new ForbiddenError("You can only view applicants for gigs you posted.");
    }
  }

  private toApplicant(row: any): Applicant {
    return {
      id: row.id,
      status: row.status,
      coverNote: row.coverNote ?? null,
      createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
      applicant: {
        id: row.user.id,
        fullName: row.user.fullName,
        avatarUrl: row.user.avatarUrl ?? null,
        headline: row.user.headline ?? null,
        skills: row.user.skills ?? [],
        verified: row.user.verified,
      },
    };
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
        company: row.gig.company ?? null,
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
