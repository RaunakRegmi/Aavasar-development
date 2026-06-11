/**
 * Gig repository — the ONLY module that opens `prisma.gig`.
 *
 * Pure data access: takes typed args, returns Prisma rows. Filtering /
 * pagination math also lives here so the service stays focused on
 * business rules.
 */
import type { Prisma, PrismaClient } from "@prisma/client";
import { toPrismaPage, type Pagination } from "@lib/pagination";
import type { GigWithRelations } from "./gig.mapper";
import type { ListGigsQuery } from "./gig.contracts";

const INCLUDE_RELATIONS = {
  company: { select: { id: true, name: true, verified: true, logoUrl: true } },
  postedBy: { select: { id: true, fullName: true, avatarUrl: true, verified: true } },
} satisfies Prisma.GigInclude;

export class GigRepository {
  constructor(private readonly db: PrismaClient) {}

  findById(id: string): Promise<GigWithRelations | null> {
    return this.db.gig.findUnique({
      where: { id },
      include: INCLUDE_RELATIONS,
    }) as Promise<GigWithRelations | null>;
  }

  /**
   * Listing with text search across title + description, plus optional
   * structured filters. Returns the page rows + total count for the
   * caller to assemble pagination meta.
   */
  async list(
    filters: ListGigsQuery,
    orderBy: Prisma.GigOrderByWithRelationInput[],
  ): Promise<{ items: GigWithRelations[]; total: number }> {
    const where: Prisma.GigWhereInput = {
      ...(filters.category ? { category: { equals: filters.category, mode: "insensitive" } } : {}),
      ...(filters.location ? { location: filters.location } : {}),
      ...(filters.payKind ? { payKind: filters.payKind } : {}),
      ...(filters.status ? { status: filters.status } : { status: { not: "draft" } }),
      ...(filters.query
        ? {
            OR: [
              { title: { contains: filters.query, mode: "insensitive" } },
              { description: { contains: filters.query, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const pageArgs = toPrismaPage({ page: filters.page, pageSize: filters.pageSize } as Pagination);

    const [items, total] = await this.db.$transaction([
      this.db.gig.findMany({
        where,
        orderBy: orderBy.length > 0 ? orderBy : [{ postedAt: "desc" }],
        ...pageArgs,
        include: INCLUDE_RELATIONS,
      }) as Prisma.PrismaPromise<GigWithRelations[]>,
      this.db.gig.count({ where }),
    ]);

    return { items, total };
  }

  /**
   * Every gig posted by a given recruiter (all statuses, incl. drafts),
   * newest first. Backs the recruiter "My Gigs" management page.
   */
  async listByPoster(
    userId: string,
    page: Pagination,
  ): Promise<{ items: GigWithRelations[]; total: number }> {
    const where: Prisma.GigWhereInput = { postedByUserId: userId };
    const pageArgs = toPrismaPage(page);

    const [items, total] = await this.db.$transaction([
      this.db.gig.findMany({
        where,
        orderBy: [{ postedAt: "desc" }],
        ...pageArgs,
        include: INCLUDE_RELATIONS,
      }) as Prisma.PrismaPromise<GigWithRelations[]>,
      this.db.gig.count({ where }),
    ]);

    return { items, total };
  }

  create(input: Prisma.GigUncheckedCreateInput): Promise<GigWithRelations> {
    return this.db.gig.create({
      data: input,
      include: INCLUDE_RELATIONS,
    }) as Promise<GigWithRelations>;
  }

  update(id: string, patch: Prisma.GigUpdateInput): Promise<GigWithRelations> {
    return this.db.gig.update({
      where: { id },
      data: patch,
      include: INCLUDE_RELATIONS,
    }) as Promise<GigWithRelations>;
  }

  delete(id: string): Promise<void> {
    return this.db.gig.delete({ where: { id } }).then(() => undefined);
  }

  /** Featured = active + premium, newest first. Used by the marketing site. */
  featured(limit = 4): Promise<GigWithRelations[]> {
    return this.db.gig.findMany({
      where: { status: "active", isPremium: true },
      orderBy: { postedAt: "desc" },
      take: limit,
      include: INCLUDE_RELATIONS,
    }) as Promise<GigWithRelations[]>;
  }
}
