import { z } from "zod";
import { PaginationSchema } from "@lib/pagination";

export const TalentFiltersSchema = PaginationSchema.extend({
  query: z.string().trim().max(100).optional(),
  skills: z.preprocess(
    (v) => (typeof v === "string" ? v.split(",") : v),
    z.array(z.string().trim()).optional(),
  ),
});

export type TalentFilters = z.infer<typeof TalentFiltersSchema>;

export const TalentDtoSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  avatarUrl: z.string().nullish(),
  bannerUrl: z.string().nullish(),
  headline: z.string().nullish(),
  bio: z.string().nullish(),
  skills: z.array(z.string()),
  verified: z.boolean(),
});

export const TalentIdParamsSchema = z.object({ id: z.string().min(1) });

export type TalentDto = z.infer<typeof TalentDtoSchema>;
