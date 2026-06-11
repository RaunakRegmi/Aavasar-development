import { z } from "zod";
import { IdSchema, IsoDateTimeSchema } from "@shared/lib/contracts";

export const ParticipantSchema = z.object({
  id: IdSchema,
  fullName: z.string(),
  avatarUrl: z.string().nullable(),
});

export const MessageSchema = z.object({
  id: IdSchema,
  conversationId: IdSchema,
  senderId: IdSchema,
  body: z.string(),
  readAt: z.string().nullable(),
  createdAt: IsoDateTimeSchema,
});

export const ConversationSchema = z.object({
  id: IdSchema,
  otherParticipant: ParticipantSchema,
  lastMessageAt: IsoDateTimeSchema,
  lastMessage: z
    .object({ body: z.string(), senderId: IdSchema, createdAt: IsoDateTimeSchema })
    .nullable(),
  unreadCount: z.number().int().nonnegative(),
});

export const ConversationListSchema = z.array(ConversationSchema);
export const MessageListSchema = z.array(MessageSchema);

export type Participant = z.infer<typeof ParticipantSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type Conversation = z.infer<typeof ConversationSchema>;

/** Shape pushed over the WebSocket on a new message. */
export const RealtimeMessageEventSchema = z.object({
  type: z.literal("message"),
  conversationId: IdSchema,
  message: MessageSchema,
});
export type RealtimeMessageEvent = z.infer<typeof RealtimeMessageEventSchema>;
