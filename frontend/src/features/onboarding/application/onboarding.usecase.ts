/**
 * Onboarding use cases.
 *
 * The wizard is local-first: per-step data accumulates in
 * `useOnboardingDraft` (persisted to localStorage). Only the FINALIZE
 * step makes a network call — `PATCH /auth/me { onboardingCompleted: true }`
 * — so a user can close the tab mid-flow without losing their answers.
 *
 * When the eventual `/onboarding/*` endpoints land (so recruiters can
 * filter by skills, etc.), they'll plug into the same use cases here.
 */
import {
  OnboardingBasicSchema,
  OnboardingPortfolioSchema,
  OnboardingSkillsSchema,
  type OnboardingBasic,
  type OnboardingPortfolio,
  type OnboardingSkills,
} from "../contracts/onboarding.contract";
import { useOnboardingDraft } from "../store/onboarding.store";
import { useAuthStore } from "@features/auth";
import { authService } from "@features/auth/api/auth.service";

export async function submitBasic(input: OnboardingBasic): Promise<void> {
  const payload = OnboardingBasicSchema.parse(input);
  useOnboardingDraft.getState().setBasic(payload);
}

export async function submitSkills(input: OnboardingSkills): Promise<void> {
  // Re-parse for safety even though the wizard already validated.
  OnboardingSkillsSchema.parse(input);
  // Skills already live in the draft store via toggleSkill — nothing
  // further to do here. Keeping the function as the surface area lets
  // us swap to a network call later without touching call sites.
}

export async function submitPortfolio(input: OnboardingPortfolio): Promise<void> {
  const payload = OnboardingPortfolioSchema.parse(input);
  useOnboardingDraft.getState().setPortfolio(payload);
}

export interface OnboardingFinalizeResult {
  userId: string;
  completedAt: string;
}

/**
 * Thrown by `finalizeOnboarding` when required uploads / fields are
 * missing. The wizard surfaces `missing` in a toast so the user knows
 * which step to go fix. Backend would also reject — failing here is
 * faster + clearer.
 */
export class OnboardingPreconditionError extends Error {
  readonly missing: string[];
  constructor(missing: string[]) {
    super(`Onboarding can't complete — missing: ${missing.join(", ")}.`);
    this.missing = missing;
    this.name = "OnboardingPreconditionError";
  }
}

export async function finalizeOnboarding(): Promise<OnboardingFinalizeResult> {
  const draft = useOnboardingDraft.getState();
  const { avatarUrl, portfolioUrl, nidUrl } = draft.portfolio;
  const headline = draft.basic.headline;
  const skills = draft.skills.filter(Boolean);

  const missing: string[] = [];
  if (!headline) missing.push("professional headline");
  if (skills.length === 0) missing.push("at least one skill");
  if (!nidUrl) missing.push("government ID");
  if (!portfolioUrl) missing.push("CV / portfolio PDF");
  if (missing.length > 0) throw new OnboardingPreconditionError(missing);

  const updated = await authService.updateProfile({
    onboardingCompleted: true,
    headline,
    skills,
    ...(avatarUrl ? { avatarUrl } : {}),
  });

  // Mirror onto the auth store so guards (ProtectedRoute) immediately
  // stop redirecting to /onboarding.
  useAuthStore.getState().setUser(updated);

  // IMPORTANT: do NOT reset the draft store here. The parent
  // OnboardingPage subscribes to `step` from this store — calling
  // `draft.reset()` mid-finalize sets `step = 1`, which makes the
  // parent unmount StepComplete and remount StepBasic. That's the
  // "loop" symptom (user sees step 1 instead of the success screen).
  //
  // The draft is cleared on actual navigation — see StepComplete's
  // navigation handlers, where `useOnboardingDraft.getState().reset()`
  // runs right before `navigate(...)`. Until then, leaving the data
  // in localStorage means a refresh on the success screen still
  // resolves cleanly (the route guard sees `onboardingCompleted`
  // and bounces to the dashboard).
  return { userId: updated.id, completedAt: new Date().toISOString() };
}
