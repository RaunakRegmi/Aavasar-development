import { z } from "zod";

export const ContactRequestSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().toLowerCase().email("Invalid email"),
  subject: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),
});

export type ContactRequest = z.infer<typeof ContactRequestSchema>;
