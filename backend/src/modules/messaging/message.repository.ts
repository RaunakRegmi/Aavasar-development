import type { PrismaClient } from "@prisma/client";

const PARTICIPANT_SELECT = { id: true, fullName: true, avatarUrl: true } as const;

const CONVERSATION_DETAIL = {
  recruiter: { select: PARTICIPANT_SELECT },
  student: { select: PARTICIPANT_SELECT },
  messages: { orderBy: { createdAt: "desc" as const }, take: 1 },
} as const;

export class MessageRepository {
  constructor(private readonly db: PrismaClient) {}

  findConversationByPair(recruiterId: string, studentId: string) {
    return this.db.conversation.findUnique({
      where: { recruiterId_studentId: { recruiterId, studentId } },
    });
  }

  createConversation(recruiterId: string, studentId: string) {
    return this.db.conversation.create({ data: { recruiterId, studentId } });
  }

  findConversationById(id: string) {
    return this.db.conversation.findUnique({ where: { id } });
  }

  /** Conversation + both participants + last message — for DTO building. */
  findConversationDetail(id: string) {
    return this.db.conversation.findUnique({ where: { id }, include: CONVERSATION_DETAIL });
  }

  /** All conversations a user participates in (newest activity first). */
  listForUser(userId: string) {
    return this.db.conversation.findMany({
      where: { OR: [{ recruiterId: userId }, { studentId: userId }] },
      orderBy: { lastMessageAt: "desc" },
      include: CONVERSATION_DETAIL,
    });
  }

  /** Unread (received, not-yet-read) counts per conversation for a viewer. */
  async unreadCounts(conversationIds: string[], viewerId: string): Promise<Map<string, number>> {
    if (conversationIds.length === 0) return new Map();
    const rows = await this.db.message.groupBy({
      by: ["conversationId"],
      where: { conversationId: { in: conversationIds }, senderId: { not: viewerId }, readAt: null },
      _count: { _all: true },
    });
    return new Map(rows.map((r) => [r.conversationId, r._count._all]));
  }

  listMessages(conversationId: string, page: number, pageSize: number) {
    return this.db.$transaction([
      this.db.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.db.message.count({ where: { conversationId } }),
    ]);
  }

  async createMessage(conversationId: string, senderId: string, body: string) {
    const [msg] = await this.db.$transaction([
      this.db.message.create({ data: { conversationId, senderId, body } }),
      this.db.conversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: new Date() },
      }),
    ]);
    return msg;
  }

  markRead(conversationId: string, readerId: string) {
    return this.db.message.updateMany({
      where: { conversationId, senderId: { not: readerId }, readAt: null },
      data: { readAt: new Date() },
    });
  }
}
