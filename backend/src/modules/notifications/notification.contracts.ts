import { z } from "zod";
import { PaginationSchema } from "@lib/pagination";

export const NotificationKindSchema = z.enum([
  "application_created",
  "application_accepted",
  "application_rejected",
  "new_message",
  "payout_settled",
  "profile_verified",
  "gig_completed",
]);

export const NotificationSchema = z.object({
  id: z.string(),
  kind: NotificationKindSchema,
  title: z.string(),
  description: z.string(),
  link: z.string().nullable(),
  readAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
});

export const NotificationListSchema = z.array(NotificationSchema);

export const ListNotificationsQuerySchema = PaginationSchema.extend({
  unreadOnly: z.coerce.boolean().optional(),
});

export type NotificationDto = z.infer<typeof NotificationSchema>;
export type ListNotificationsQuery = z.infer<typeof ListNotificationsQuerySchema>;
