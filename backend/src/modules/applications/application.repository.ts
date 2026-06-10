import type { Prisma, PrismaClient } from "@prisma/client";
import type { ListMyApplicationsQuery } from "./application.contracts";

const INCLUDE_GIG = {
  gig: {
    include: {
      company: { select: { id: true, name: true, verified: true } },
    },
  },
} satisfies Prisma.ApplicationInclude;

export class ApplicationRepository {
  constructor(private readonly db: PrismaClient) {}

  findById(id: string) {
    return this.db.application.findUnique({
      where: { id },
      include: INCLUDE_GIG,
    });
  }

  findByUserAndGig(userId: string, gigId: string) {
    return this.db.application.findUnique({
      where: { userId_gigId: { userId, gigId } },
    });
  }

  listForUser(userId: string, filters: ListMyApplicationsQuery) {
    const where: Prisma.ApplicationWhereInput = {
      userId,
      ...(filters.status ? { status: filters.status } : {}),
    };

    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 20;

    return this.db.$transaction([
      this.db.application.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: INCLUDE_GIG,
      }),
      this.db.application.count({ where }),
    ]) as Promise<[Array<Record<string, unknown>>, number]>;
  }

  create(input: Prisma.ApplicationUncheckedCreateInput) {
    return this.db.application.create({
      data: input,
      include: INCLUDE_GIG,
    });
  }

  updateStatus(id: string, status: string) {
    return this.db.application.update({
      where: { id },
      data: { status: status as any },
      include: INCLUDE_GIG,
    });
  }
}
