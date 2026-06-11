import type { NotificationDto, ListNotificationsQuery } from "./notification.contracts";
import { NotificationRepository } from "./notification.repository";

export class NotificationService {
  constructor(private readonly repo: NotificationRepository) {}

  async list(
    userId: string,
    filters: ListNotificationsQuery,
  ): Promise<{ items: NotificationDto[]; total: number; unread: number }> {
    const [raw, total] = await this.repo.listForUser(userId, filters);
    const unread = await this.repo.countUnread(userId);
    const items = raw.map(this.toDto);
    return { items, total, unread };
  }

  async markAllRead(userId: string): Promise<void> {
    await this.repo.markAllRead(userId);
  }

  /**
   * Create a notification — called by other services
   * (applications, gigs, etc.) to push real-time events.
   */
  async create(input: {
    userId: string;
    kind: string;
    title: string;
    description: string;
    link?: string;
  }): Promise<void> {
    await this.repo.create({
      userId: input.userId,
      kind: input.kind as any,
      title: input.title,
      description: input.description,
      link: input.link ?? null,
    });
  }

  private toDto(row: any): NotificationDto {
    return {
      id: row.id,
      kind: row.kind,
      title: row.title,
      description: row.description,
      link: row.link ?? null,
      readAt: row.readAt ? (row.readAt instanceof Date ? row.readAt.toISOString() : row.readAt) : null,
      createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
    };
  }
}
