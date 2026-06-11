import { z } from "zod";
import { PaginationSchema } from "@lib/pagination";

export const ParticipantSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  avatarUrl: z.string().nullable(),
});

export const MessageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
  body: z.string(),
  readAt: z.string().nullable(),
  createdAt: z.string(),
});

export const ConversationSchema = z.object({
  id: z.string(),
  /** The participant who ISN'T the viewer. */
  otherParticipant: ParticipantSchema,
  lastMessageAt: z.string(),
  lastMessage: z
    .object({ body: z.string(), senderId: z.string(), createdAt: z.string() })
    .nullable(),
  unreadCount: z.number().int().nonnegative(),
});

export const StartConversationRequestSchema = z.object({
  studentId: z.string().min(1),
});

export const SendMessageRequestSchema = z.object({
  body: z.string().min(1, "Message cannot be empty.").max(5000),
});

export const ListMessagesQuerySchema = PaginationSchema;

export const ConversationIdParamsSchema = z.object({ id: z.string().min(1) });

export type Participant = z.infer<typeof ParticipantSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type Conversation = z.infer<typeof ConversationSchema>;
export type StartConversationRequest = z.infer<typeof StartConversationRequestSchema>;
export type SendMessageRequest = z.infer<typeof SendMessageRequestSchema>;
export type ListMessagesQuery = z.infer<typeof ListMessagesQuerySchema>;
