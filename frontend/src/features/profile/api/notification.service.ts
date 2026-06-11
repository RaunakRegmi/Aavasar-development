import { request, requestEnvelope } from "@shared/lib/transport";
import { z } from "zod";

export const NotificationSchema = z.object({
  id: z.string(),
  kind: z.enum([
    "application_created",
    "application_accepted",
    "application_rejected",
    "new_message",
    "payout_settled",
    "profile_verified",
    "gig_completed",
  ]),
  title: z.string(),
  description: z.string(),
  link: z.string().nullable(),
  readAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
});

export type NotificationItem = z.infer<typeof NotificationSchema>;

export const notificationService = {
  async list(unreadOnly = false): Promise<{ items: NotificationItem[]; total: number; unread: number }> {
    const envelope = await requestEnvelope<unknown>({
      method: "GET",
      url: "/notifications",
      params: { unreadOnly, pageSize: 50 },
    });
    const items = z.array(NotificationSchema).parse(envelope.data);
    return {
      items,
      total: envelope.meta?.total ?? items.length,
      unread: (envelope.meta as any)?.unread ?? 0,
    };
  },

  async markAllRead(): Promise<void> {
    await request({ method: "POST", url: "/notifications/mark-all-read" });
  },
};
