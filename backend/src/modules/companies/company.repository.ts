import type { Prisma, PrismaClient } from "@prisma/client";

export class CompanyRepository {
  constructor(private readonly db: PrismaClient) {}

  findById(id: string) {
    return this.db.company.findUnique({ where: { id } });
  }

  findByContactUserId(userId: string) {
    return this.db.company.findUnique({ where: { contactUserId: userId } });
  }

  create(input: Prisma.CompanyUncheckedCreateInput) {
    return this.db.company.create({ data: input });
  }

  update(id: string, input: Prisma.CompanyUpdateInput) {
    return this.db.company.update({ where: { id }, data: input });
  }
}
