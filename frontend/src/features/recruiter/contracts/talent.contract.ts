import { z } from "zod";

export const TalentSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  avatarUrl: z.string().nullish(),
  bannerUrl: z.string().nullish(),
  headline: z.string().nullish(),
  bio: z.string().nullish(),
  skills: z.array(z.string()),
  verified: z.boolean(),
});

export type Talent = z.infer<typeof TalentSchema>;

export const TalentListSchema = z.array(TalentSchema);

export const TalentFiltersSchema = z.object({
  query: z.string().optional(),
  skills: z.array(z.string()).optional(),
  page: z.number().optional(),
  pageSize: z.number().optional(),
});

export type TalentFilters = z.infer<typeof TalentFiltersSchema>;
