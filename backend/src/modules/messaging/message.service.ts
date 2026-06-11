import { BadRequestError, ForbiddenError, NotFoundError } from "@lib/errors";
import type { AuthedUser } from "@middlewares/auth";
import { pushToUser } from "@lib/ws";
import type { UserRepository } from "@modules/users/user.repository";
import type { NotificationService } from "../notifications/notification.service";
import { MessageRepository } from "./message.repository";
import type { Conversation, Message } from "./message.contracts";

type ConvDetail = NonNullable<Awaited<ReturnType<MessageRepository["findConversationDetail"]>>>;

export class MessageService {
  constructor(
    private readonly repo: MessageRepository,
    private readonly users: UserRepository,
    private readonly notifications: NotificationService,
  ) {}

  /** Recruiter-initiated: get-or-create the thread with a student. */
  async startConversation(actor: AuthedUser, studentId: string): Promise<Conversation> {
    if (actor.role !== "recruiter" && actor.role !== "admin") {
      throw new ForbiddenError("Only recruiters can start conversations.");
    }
    if (studentId === actor.id) throw new BadRequestError("You can't message yourself.");
    const student = await this.users.findById(studentId);
    if (!student || student.role !== "student") throw new NotFoundError("Student not found.");

    const existing = await this.repo.findConversationByPair(actor.id, studentId);
    if (!existing) await this.repo.createConversation(actor.id, studentId);

    const detail = await this.repo.findConversationDetail(
      (existing ?? (await this.repo.findConversationByPair(actor.id, studentId)))!.id,
    );
    const unread = await this.repo.unreadCounts([detail!.id], actor.id);
    return this.toConversationDto(detail!, actor.id, unread.get(detail!.id) ?? 0);
  }

  async listConversations(actor: AuthedUser): Promise<Conversation[]> {
    const convs = await this.repo.listForUser(actor.id);
    const unread = await this.repo.unreadCounts(
      convs.map((c) => c.id),
      actor.id,
    );
    return convs.map((c) => this.toConversationDto(c as ConvDetail, actor.id, unread.get(c.id) ?? 0));
  }

  async listMessages(
    actor: AuthedUser,
    conversationId: string,
    page: number,
    pageSize: number,
  ): Promise<{ items: Message[]; total: number; page: number; pageSize: number }> {
    await this.assertParticipant(actor, conversationId);
    const [rows, total] = await this.repo.listMessages(conversationId, page, pageSize);
    return { items: rows.map(toMessageDto), total, page, pageSize };
  }

  async sendMessage(actor: AuthedUser, conversationId: string, body: string): Promise<Message> {
    const conv = await this.assertParticipant(actor, conversationId);
    const row = await this.repo.createMessage(conversationId, actor.id, body);
    const dto = toMessageDto(row);

    const recipientId = conv.recruiterId === actor.id ? conv.studentId : conv.recruiterId;
    // Live push to the recipient's open tabs.
    pushToUser(recipientId, { type: "message", conversationId, message: dto });
    // Persistent notification for the notification center.
    await this.notifications.create({
      userId: recipientId,
      kind: "new_message",
      title: "New message",
      description: body.length > 80 ? `${body.slice(0, 80)}…` : body,
      link: `/messages/${conversationId}`,
    });
    return dto;
  }

  async markRead(actor: AuthedUser, conversationId: string): Promise<void> {
    await this.assertParticipant(actor, conversationId);
    await this.repo.markRead(conversationId, actor.id);
  }

  // ---------- helpers ----------

  private async assertParticipant(actor: AuthedUser, conversationId: string) {
    const conv = await this.repo.findConversationById(conversationId);
    if (!conv) throw new NotFoundError("Conversation not found.");
    if (actor.role !== "admin" && conv.recruiterId !== actor.id && conv.studentId !== actor.id) {
      throw new ForbiddenError("You are not part of this conversation.");
    }
    return conv;
  }

  private toConversationDto(c: ConvDetail, viewerId: string, unreadCount: number): Conversation {
    const other = c.recruiter.id === viewerId ? c.student : c.recruiter;
    const last = c.messages[0];
    return {
      id: c.id,
      otherParticipant: {
        id: other.id,
        fullName: other.fullName,
        avatarUrl: other.avatarUrl ?? null,
      },
      lastMessageAt: c.lastMessageAt.toISOString(),
      lastMessage: last
        ? { body: last.body, senderId: last.senderId, createdAt: last.createdAt.toISOString() }
        : null,
      unreadCount,
    };
  }
}

function toMessageDto(row: {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  readAt: Date | null;
  createdAt: Date;
}): Message {
  return {
    id: row.id,
    conversationId: row.conversationId,
    senderId: row.senderId,
    body: row.body,
    readAt: row.readAt ? row.readAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
  };
}
