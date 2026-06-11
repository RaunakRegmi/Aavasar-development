/**
 * Auth wire contracts — mirror the frontend's L6 schemas exactly. If
 * one side changes, the other must follow on the same PR.
 *
 * See frontend/src/features/auth/contracts/auth.contract.ts.
 */
import { z } from "zod";

/**
 * Password strength rule applied across sign-up, password reset, etc.
 *   • 8+ characters (industry baseline)
 *   • At least one letter (rules out "12345678" / "00000000")
 *   • At least one digit (rules out "password" / "letmeinplz")
 * We intentionally don't require a symbol — research has shown symbol
 * mandates push users to predictable substitutions ("@" for "a") that
 * don't help. We may add HIBP-style breach checking later.
 */
const PasswordSchema = z
  .string()
  .min(8, "Must be at least 8 characters.")
  .regex(/[A-Za-z]/, "Include at least one letter.")
  .regex(/[0-9]/, "Include at least one number.");

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

export const LogInRequestSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(256),
  remember: z.boolean().optional().default(false),
});
export type LogInRequest = z.infer<typeof LogInRequestSchema>;

export const RefreshRequestSchema = z.object({
  refreshToken: z.string().min(1),
});
export type RefreshRequest = z.infer<typeof RefreshRequestSchema>;

export const ForgotPasswordRequestSchema = z.object({
  email: z.string().email().max(254),
});
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;

export const ResetPasswordRequestSchema = z
  .object({
    token: z.string().min(1),
    password: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;

/**
 * Profile-update — partial patch consumed by `PATCH /auth/me` and
 * `PATCH /me/profile`. Lengths match the DB constraints in schema.prisma.
 *
 * Guard: when the caller tries to flip `onboardingCompleted` to `true`,
 * `headline` and `skills` MUST be supplied in the same request. This
 * prevents a premature finalize (e.g. from an avatar-only PATCH) and
 * keeps the precondition check close to the wire.
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

/**
 * Password change — requires the CURRENT password so an XSS-stolen
 * access token alone can't rotate credentials. Service also bumps
 * `tokenVersion` on success → every other device is force-logged-out.
 */
export const ChangePasswordRequestSchema = z
  .object({
    currentPassword: z.string().min(1),
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
