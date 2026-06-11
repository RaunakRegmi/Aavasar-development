/**
 * LAYER 6 — Auth contracts
 * --------------------------------------------------------------
 * Zod schemas + inferred TS types for everything that crosses the
 * network boundary for auth (login, signup, session). The service
 * layer parses every wire payload through these — so the rest of
 * the codebase can trust the resulting types as ground truth.
 */
import { z } from "zod";
import { IdSchema, RoleSchema } from "@shared/lib/contracts";

/* ----- Inbound (responses) ----- */

export const SessionUserSchema = z.object({
  id: IdSchema,
  email: z.string().email(),
  fullName: z.string().min(1),
  role: RoleSchema,
  /** Either absolute URL or origin-relative path. */
  avatarUrl: z.string().min(1).optional(),
  bannerUrl: z.string().min(1).optional(),
  /** One-line role descriptor shown above the bio on profiles. */
  headline: z.string().optional(),
  /** Long-form intro. */
  bio: z.string().optional(),
  skills: z.array(z.string()).default([]),
  onboardingCompleted: z.boolean(),
  verified: z.boolean(),
});
export type SessionUser = z.infer<typeof SessionUserSchema>;

export const AuthSessionSchema = z.object({
  accessToken: z.string().min(1),
  /**
   * The real backend always issues a refresh token alongside the access
   * one. Kept optional for forward compatibility with cookie-based
   * refresh flows where the value never crosses to JS.
   */
  refreshToken: z.string().min(1).optional(),
  expiresAt: z.string().datetime({ offset: true }),
  user: SessionUserSchema,
});
export type AuthSession = z.infer<typeof AuthSessionSchema>;

/* ----- Outbound (requests) ----- */

/**
 * Password strength rule — kept in sync with the backend's PasswordSchema.
 * If you change one side, change the other in the same PR.
 *   • 8+ characters
 *   • At least one letter
 *   • At least one digit
 */
export const PasswordSchema = z
  .string()
  .min(8, "Must be at least 8 characters.")
  .regex(/[A-Za-z]/, "Include at least one letter.")
  .regex(/[0-9]/, "Include at least one number.");

/**
 * Wire-shape: the full payload sent to the backend.
 */
export const SignUpRequestSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name.").max(120),
  email: z.string().email("Enter a valid email address.").max(254),
  password: PasswordSchema,
  role: z.enum(["student", "recruiter"]),
  agreedToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the Terms of Service." }),
  }),
});
export type SignUpRequest = z.infer<typeof SignUpRequestSchema>;

/**
 * Form-shape: what the SignUpPage actually collects via react-hook-form.
 * Adds `confirmPassword` as a UX-only check that doesn't cross the wire.
 * `role` is selected via a SegmentedControl outside the form;
 * `agreedToTerms` is a separate Checkbox state — both are merged into
 * the wire payload before the use case runs `SignUpRequestSchema.parse`.
 */
export const SignUpFormSchema = z
  .object({
    fullName: z.string().min(2, "Please enter your full name.").max(120),
    email: z.string().email("Enter a valid email address.").max(254),
    password: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });
export type SignUpFormValues = z.infer<typeof SignUpFormSchema>;

export const LogInRequestSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
  remember: z.boolean().optional().default(false),
});
export type LogInRequest = z.infer<typeof LogInRequestSchema>;

export const ForgotPasswordRequestSchema = z.object({
  email: z.string().email("Enter the email tied to your account."),
});
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;

export const ResetPasswordRequestSchema = z
  .object({
    token: z.string().min(1, "Missing reset token. Open the email link again."),
    password: z.string().min(8, "Must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Confirm your new password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;

export const RefreshSessionRequestSchema = z.object({
  refreshToken: z.string().min(1),
});
export type RefreshSessionRequest = z.infer<typeof RefreshSessionRequestSchema>;

/**
 * Profile patch — mirrors the backend's `UpdateProfileRequestSchema`.
 * Used to push the uploaded avatar URL onto the session user mid-onboarding.
 *
 * Guard: `onboardingCompleted: true` requires `headline` and `skills` in
 * the same request so a premature PATCH (e.g. avatar-only) can't silently
 * flip the flag.
 */
export const UpdateProfileRequestSchema = z
  .object({
    fullName: z.string().min(2).max(120).optional(),
    avatarUrl: z.string().min(1).max(2048).optional(),
    bannerUrl: z.string().min(1).max(2048).optional(),
    headline: z.string().min(2).max(160).optional(),
    bio: z.string().min(0).max(2000).optional(),
    skills: z.array(z.string().min(1).max(40)).max(30).optional(),
    onboardingCompleted: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update.",
  })
  .refine(
    (data) => {
      if (!data.onboardingCompleted) return true;
      return !!data.headline && !!data.skills && data.skills.length > 0;
    },
    {
      message:
        "To complete onboarding you must provide a professional headline and at least one skill.",
      path: ["onboardingCompleted"],
    },
  );
export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;

export const ChangePasswordRequestSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  })
  .refine((d) => d.newPassword !== d.currentPassword, {
    message: "Pick a new password different from the current one.",
    path: ["newPassword"],
  });
export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>;
