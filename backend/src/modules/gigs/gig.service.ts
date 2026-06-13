/**
 * GigService — pure business logic for the gigs domain.
 *
 * Rules enforced here (NOT in the controller):
 *   • Only recruiters (or admins) can create/update/delete a gig.
 *   • A recruiter may only modify gigs they themselves posted, unless
 *     they're an admin.
 *   • Public listing hides drafts unless the caller explicitly filters
 *     by status (and is authorized).
 */
import type { GigDto, ListGigsQuery, CreateGigRequest, UpdateGigRequest } from "./gig.contracts";
import { toGigDto } from "./gig.mapper";
import { GigRepository } from "./gig.repository";
import { parseSort, type Pagination } from "@lib/pagination";
import { ForbiddenError, NotFoundError } from "@lib/errors";
import type { AuthedUser } from "@middlewares/auth";
import type { BillingRepository } from "@modules/billing/billing.repository";
import { effectiveGigCap, planFor } from "@modules/billing/plans";
import type { RewardsService } from "@modules/rewards/rewards.service";
import { logger } from "@config/logger";

const SORTABLE_FIELDS = ["postedAt", "title", "payAmountMinor"] as const;

export class GigService {
  constructor(
    private readonly repo: GigRepository,
    private readonly billingRepo: BillingRepository,
    private readonly rewards: RewardsService,
  ) {}

  // ---------- Read ----------

  async listPublic(filters: ListGigsQuery): Promise<{
    items: GigDto[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const orderBy = parseSort(filters.sort, SORTABLE_FIELDS);
    const { items, total } = await this.repo.list(filters, orderBy);
    return {
      items: items.map(toGigDto),
      total,
      page: filters.page,
      pageSize: filters.pageSize,
    };
  }

  async listFeatured(): Promise<GigDto[]> {
    const rows = await this.repo.featured();
    return rows.map(toGigDto);
  }

  /** Every gig the acting recruiter posted (all statuses) — "My Gigs". */
  async listMine(
    actor: AuthedUser,
    page: Pagination,
  ): Promise<{ items: GigDto[]; total: number; page: number; pageSize: number }> {
    if (actor.role !== "recruiter" && actor.role !== "admin") {
      throw new ForbiddenError("Only recruiters can view posted gigs.");
    }
    const { items, total } = await this.repo.listByPoster(actor.id, page);
    return {
      items: items.map(toGigDto),
      total,
      page: page.page,
      pageSize: page.pageSize,
    };
  }

  async getById(id: string): Promise<GigDto> {
    const row = await this.repo.findById(id);
    if (!row) throw new NotFoundError("Gig not found.");
    return toGigDto(row);
  }

  // ---------- Write ----------

  async create(actor: AuthedUser, input: CreateGigRequest): Promise<GigDto> {
    if (actor.role !== "recruiter" && actor.role !== "admin") {
      throw new ForbiddenError("Only recruiters can post gigs.");
    }
    // Publishing immediately makes a gig active — gate it against the plan's
    // active-gig quota. Saving a draft never counts.
    if (input.publish) {
      await this.assertActiveGigQuota(actor);
    }
    const row = await this.repo.create({
      title: input.title,
      category: input.category,
      description: input.description,
      // Omit for individual gigs — the gig then carries the recruiter's
      // own identity (via `postedBy`) instead of a company's.
      companyId: input.companyId ?? null,
      location: input.location,
      duration: input.duration,
      payKind: input.payKind,
      payAmountMinor: input.pay.amountMinor,
      payCurrency: input.pay.currency,
      tags: input.tags,
      isPremium: input.isPremium ?? false,
      postedByUserId: actor.id,
      // `publish` → live immediately; otherwise saved as a draft the
      // recruiter can publish later from "My Gigs".
      status: input.publish ? "active" : "draft",
    });
    return toGigDto(row);
  }

  async update(actor: AuthedUser, id: string, patch: UpdateGigRequest): Promise<GigDto> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundError("Gig not found.");
    this.assertCanMutate(actor, existing.postedByUserId);

    if (patch.status && patch.status !== existing.status) {
      this.validateTransition(existing.status, patch.status);
      // Publishing a draft consumes an active-gig slot — enforce the quota.
      if (patch.status === "active" && existing.status !== "active") {
        await this.assertActiveGigQuota(actor);
      }
    }

    const row = await this.repo.update(id, {
      ...(patch.title !== undefined ? { title: patch.title } : {}),
      ...(patch.category !== undefined ? { category: patch.category } : {}),
      ...(patch.description !== undefined ? { description: patch.description } : {}),
      ...(patch.location !== undefined ? { location: patch.location } : {}),
      ...(patch.duration !== undefined ? { duration: patch.duration } : {}),
      ...(patch.payKind !== undefined ? { payKind: patch.payKind } : {}),
      ...(patch.pay !== undefined
        ? { payAmountMinor: patch.pay.amountMinor, payCurrency: patch.pay.currency }
        : {}),
      ...(patch.tags !== undefined ? { tags: patch.tags } : {}),
      ...(patch.isPremium !== undefined ? { isPremium: patch.isPremium } : {}),
      ...(patch.status !== undefined ? { status: patch.status } : {}),
    });

    // Gig just reached "completed" → award points to the accepted student(s).
    // Best-effort: never let a rewards failure roll back the status change.
    if (patch.status === "completed" && existing.status !== "completed") {
      try {
        await this.rewards.awardForGigCompletion({
          id: row.id,
          title: row.title,
          payAmountMinor: row.payAmountMinor,
        });
      } catch (err) {
        logger.error({ err, gigId: row.id }, "[gigs] failed to award completion points");
      }
    }

    return toGigDto(row);
  }

  async delete(actor: AuthedUser, id: string): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundError("Gig not found.");
    this.assertCanMutate(actor, existing.postedByUserId);
    await this.repo.delete(id);
  }

  // ---------- Guards ----------

  /**
   * Hard quota: a recruiter may only have `maxActiveGigs + extraGigSlots`
   * active gigs for their tier. Admins are exempt. Professional/Enterprise
   * are uncapped (Infinity → no check).
   */
  private async assertActiveGigQuota(actor: AuthedUser): Promise<void> {
    if (actor.role === "admin") return;
    const user = await this.billingRepo.findById(actor.id);
    if (!user) return;
    const cap = effectiveGigCap(user.subscriptionTier, user.extraGigSlots);
    if (!Number.isFinite(cap)) return; // unlimited
    const active = await this.billingRepo.countActiveGigs(actor.id);
    if (active >= cap) {
      const planName = planFor(user.subscriptionTier).name;
      throw new ForbiddenError(
        `Your ${planName} plan allows ${cap} active gig${cap === 1 ? "" : "s"}. ` +
          `Upgrade to Professional or add extra gig slots to post more.`,
      );
    }
  }

  private validateTransition(current: string, next: string): void {
    const allowed: Record<string, string[]> = {
      draft: ["active", "rejected"],
      active: ["reviewing", "rejected"],
      reviewing: ["completed", "rejected"],
      submitted: [],
      completed: [],
      rejected: [],
    };
    if (!allowed[current]?.includes(next)) {
      throw new ForbiddenError(`Cannot transition gig from ${current} to ${next}.`);
    }
  }

  private assertCanMutate(actor: AuthedUser, ownerId: string): void {
    if (actor.role === "admin") return;
    if (actor.role !== "recruiter") {
      throw new ForbiddenError("Only recruiters can modify gigs.");
    }
    if (actor.id !== ownerId) {
      throw new ForbiddenError("You can only modify gigs you posted.");
    }
  }
}
