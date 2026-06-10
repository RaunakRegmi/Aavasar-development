/**
 * Gig repository — the ONLY module that opens `prisma.gig`.
 *
 * Pure data access: takes typed args, returns Prisma rows. Filtering /
 * pagination math also lives here so the service stays focused on
 * business rules.
 */
import type { Prisma, PrismaClient } from "@prisma/client";
import { toPrismaPage, type Pagination } from "@lib/pagination";
import type { GigWithCompany } from "./gig.mapper";
import type { ListGigsQuery } from "./gig.contracts";

const INCLUDE_COMPANY = {
  company: { select: { id: true, name: true, verified: true } },
} satisfies Prisma.GigInclude;

export class GigRepository {
  constructor(private readonly db: PrismaClient) {}

  findById(id: string): Promise<GigWithCompany | null> {
    return this.db.gig.findUnique({
      where: { id },
      include: INCLUDE_COMPANY,
    }) as Promise<GigWithCompany | null>;
  }

  /**
   * Listing with text search across title + description, plus optional
   * structured filters. Returns the page rows + total count for the
   * caller to assemble pagination meta.
   */
  async list(
    filters: ListGigsQuery,
    orderBy: Prisma.GigOrderByWithRelationInput[],
  ): Promise<{ items: GigWithCompany[]; total: number }> {
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
        include: INCLUDE_COMPANY,
      }) as Prisma.PrismaPromise<GigWithCompany[]>,
      this.db.gig.count({ where }),
    ]);

    return { items, total };
  }

  create(input: Prisma.GigUncheckedCreateInput): Promise<GigWithCompany> {
    return this.db.gig.create({
      data: input,
      include: INCLUDE_COMPANY,
    }) as Promise<GigWithCompany>;
  }

  update(id: string, patch: Prisma.GigUpdateInput): Promise<GigWithCompany> {
    return this.db.gig.update({
      where: { id },
      data: patch,
      include: INCLUDE_COMPANY,
    }) as Promise<GigWithCompany>;
  }

  delete(id: string): Promise<void> {
    return this.db.gig.delete({ where: { id } }).then(() => undefined);
  }

  /** Featured = active + premium, newest first. Used by the marketing site. */
  featured(limit = 4): Promise<GigWithCompany[]> {
    return this.db.gig.findMany({
      where: { status: "active", isPremium: true },
      orderBy: { postedAt: "desc" },
      take: limit,
      include: INCLUDE_COMPANY,
    }) as Promise<GigWithCompany[]>;
  }
}
