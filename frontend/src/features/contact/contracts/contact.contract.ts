import { z } from "zod";

export const ContactRequestSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10).max(5000),
});

export type ContactRequest = z.infer<typeof ContactRequestSchema>;
