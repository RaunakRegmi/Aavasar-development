import { z } from "zod";
import { IdSchema, IsoDateTimeSchema, MoneySchema } from "@shared/lib/contracts";

export const ApplicationStatusSchema = z.enum(["pending", "reviewing", "accepted", "rejected"]);

export const GigApplicationSchema = z.object({
  id: IdSchema,
  gigId: IdSchema,
  status: ApplicationStatusSchema,
  coverNote: z.string().nullable(),
  createdAt: IsoDateTimeSchema,
  gig: z.object({
    id: IdSchema,
    title: z.string(),
    category: z.string(),
    company: z.object({
      id: IdSchema,
      name: z.string(),
      verified: z.boolean(),
    }),
    location: z.enum(["remote", "onsite", "hybrid"]),
    duration: z.string(),
    payKind: z.enum(["hourly", "fixed"]),
    pay: MoneySchema,
    status: z.enum(["draft", "active", "reviewing", "submitted", "completed", "rejected"]),
    postedAt: IsoDateTimeSchema,
  }),
});

export const GigApplicationListSchema = z.array(GigApplicationSchema);

export type GigApplication = z.infer<typeof GigApplicationSchema>;
export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>;
