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
import { parseSort } from "@lib/pagination";
import { ForbiddenError, NotFoundError } from "@lib/errors";
import type { AuthedUser } from "@middlewares/auth";

const SORTABLE_FIELDS = ["postedAt", "title", "payAmountMinor"] as const;

export class GigService {
  constructor(private readonly repo: GigRepository) {}

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
    const row = await this.repo.create({
      title: input.title,
      category: input.category,
      description: input.description,
      companyId: input.companyId,
      location: input.location,
      duration: input.duration,
      payKind: input.payKind,
      payAmountMinor: input.pay.amountMinor,
      payCurrency: input.pay.currency,
      tags: input.tags,
      isPremium: input.isPremium ?? false,
      postedByUserId: actor.id,
      // New gigs start as `draft`; the recruiter publishes via update.
      status: "draft",
    });
    return toGigDto(row);
  }

  async update(actor: AuthedUser, id: string, patch: UpdateGigRequest): Promise<GigDto> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundError("Gig not found.");
    this.assertCanMutate(actor, existing.postedByUserId);

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
    return toGigDto(row);
  }

  async delete(actor: AuthedUser, id: string): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundError("Gig not found.");
    this.assertCanMutate(actor, existing.postedByUserId);
    await this.repo.delete(id);
  }

  // ---------- Guards ----------

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
