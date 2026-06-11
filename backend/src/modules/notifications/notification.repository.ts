import type { Prisma, PrismaClient } from "@prisma/client";
import type { ListNotificationsQuery } from "./notification.contracts";

export class NotificationRepository {
  constructor(private readonly db: PrismaClient) {}

  create(input: Prisma.NotificationUncheckedCreateInput) {
    return this.db.notification.create({ data: input });
  }

  listForUser(userId: string, filters: ListNotificationsQuery) {
    const where: Prisma.NotificationWhereInput = {
      userId,
      ...(filters.unreadOnly ? { readAt: null } : {}),
    };
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 20;

    return this.db.$transaction([
      this.db.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.db.notification.count({ where }),
    ]);
  }

  markAllRead(userId: string) {
    return this.db.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
  }

  countUnread(userId: string): Promise<number> {
    return this.db.notification.count({
      where: { userId, readAt: null },
    });
  }
}
