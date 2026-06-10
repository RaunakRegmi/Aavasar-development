import { z } from "zod";
import { PaginationSchema } from "@lib/pagination";

export const ApplicationStatusSchema = z.enum(["pending", "reviewing", "accepted", "rejected"]);

export const GigApplicationSchema = z.object({
  id: z.string(),
  gigId: z.string(),
  status: ApplicationStatusSchema,
  coverNote: z.string().nullable(),
  createdAt: z.string(),
  gig: z.object({
    id: z.string(),
    title: z.string(),
    category: z.string(),
    company: z.object({
      id: z.string(),
      name: z.string(),
      verified: z.boolean(),
    }),
    location: z.enum(["remote", "onsite", "hybrid"]),
    duration: z.string(),
    payKind: z.enum(["hourly", "fixed"]),
    pay: z.object({ amountMinor: z.number().int().nonnegative(), currency: z.literal("NPR") }),
    status: z.enum(["draft", "active", "reviewing", "submitted", "completed", "rejected"]),
    postedAt: z.string(),
  }),
});

export const CreateApplicationRequestSchema = z.object({
  gigId: z.string().min(1),
  coverNote: z.string().max(2000).optional(),
});

export const ListMyApplicationsQuerySchema = PaginationSchema.extend({
  status: ApplicationStatusSchema.optional(),
});

export type GigApplication = z.infer<typeof GigApplicationSchema>;
export type CreateApplicationRequest = z.infer<typeof CreateApplicationRequestSchema>;
export type ListMyApplicationsQuery = z.infer<typeof ListMyApplicationsQuerySchema>;
