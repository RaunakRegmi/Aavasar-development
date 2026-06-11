import { z } from "zod";
import { IdSchema } from "@shared/lib/contracts";

export const OnboardingBasicSchema = z.object({
  university: z.string().min(2),
  degreeAndMajor: z.string().min(2),
  expectedGraduationYear: z
    .string()
    .regex(/^\d{4}$/, "Enter a 4-digit year"),
  /**
   * Professional headline — one-line role descriptor that shows above
   * the bio on the public profile. Synced to `User.headline`.
   */
  headline: z
    .string()
    .min(4, "Add a short headline (e.g. 'CS Student · Loves React').")
    .max(160),
});
export type OnboardingBasic = z.infer<typeof OnboardingBasicSchema>;

export const OnboardingSkillsSchema = z.object({
  skills: z.array(z.string()).min(1, "Pick at least one skill."),
});
export type OnboardingSkills = z.infer<typeof OnboardingSkillsSchema>;

/**
 * Either an absolute URL (`https://cdn.aavasar.np/...`) or a path served
 * from our own origin (`/uploads/<uid>/avatar/...`). The same relaxation
 * lives on `SessionUserSchema.avatarUrl` — see the rationale there.
 */
const RelativeOrAbsoluteUrlSchema = z.string().min(1).max(2048);

export const OnboardingPortfolioSchema = z.object({
  bio: z.string().min(50, "Bio must be at least 50 characters.").max(500),
  avatarUrl: RelativeOrAbsoluteUrlSchema.optional(),
  /** CV PDF — uploaded via /uploads/portfolio. Required for finalize. */
  portfolioUrl: RelativeOrAbsoluteUrlSchema.min(1, "Upload your CV / portfolio PDF."),
  /** Gov ID PDF/photo — uploaded via /uploads/nid. Required for finalize. */
  nidUrl: RelativeOrAbsoluteUrlSchema.min(1, "Upload your government ID for verification."),
  links: z.object({
    github: z.string().url("Use a full https:// URL.").optional().or(z.literal("")),
    linkedin: z.string().url("Use a full https:// URL.").optional().or(z.literal("")),
    portfolio: z.string().url("Use a full https:// URL.").optional().or(z.literal("")),
    website: z.string().url("Use a full https:// URL.").optional().or(z.literal("")),
  }),
});
export type OnboardingPortfolio = z.infer<typeof OnboardingPortfolioSchema>;

export const OnboardingCompleteSchema = z.object({
  userId: IdSchema,
  completedAt: z.string().datetime({ offset: true }),
  profileSlug: z.string(),
});
export type OnboardingComplete = z.infer<typeof OnboardingCompleteSchema>;
