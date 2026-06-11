import { request, requestEnvelope } from "@shared/lib/transport";
import {
  ConversationListSchema,
  ConversationSchema,
  MessageListSchema,
  MessageSchema,
  type Conversation,
  type Message,
} from "../contracts/message.contract";

export const messageService = {
  /** My conversations (newest activity first). */
  async listConversations(): Promise<Conversation[]> {
    const raw = await request<unknown>({ method: "GET", url: "/conversations" });
    return ConversationListSchema.parse(raw);
  },

  /** Recruiter-only: get-or-create a thread with a student. */
  async startConversation(studentId: string): Promise<Conversation> {
    const raw = await request<unknown>({
      method: "POST",
      url: "/conversations",
      data: { studentId },
    });
    return ConversationSchema.parse(raw);
  },

  /** Message history for a conversation (oldest → newest). */
  async listMessages(conversationId: string): Promise<Message[]> {
    const envelope = await requestEnvelope<unknown>({
      method: "GET",
      url: `/conversations/${conversationId}/messages`,
      params: { page: 1, pageSize: 200 },
    });
    return MessageListSchema.parse(envelope.data);
  },

  async sendMessage(conversationId: string, body: string): Promise<Message> {
    const raw = await request<unknown>({
      method: "POST",
      url: `/conversations/${conversationId}/messages`,
      data: { body },
    });
    return MessageSchema.parse(raw);
  },

  async markRead(conversationId: string): Promise<void> {
    await request<unknown>({ method: "POST", url: `/conversations/${conversationId}/read` });
  },
};

export type MessageService = typeof messageService;
