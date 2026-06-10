/**
 * Onboarding draft store — keeps the in-progress wizard answers
 * between page reloads. Wiped after `finalize` succeeds.
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  OnboardingBasic,
  OnboardingPortfolio,
} from "../contracts/onboarding.contract";

interface OnboardingState {
  step: 1 | 2 | 3 | 4;
  basic: Partial<OnboardingBasic>;
  skills: string[];
  portfolio: Partial<OnboardingPortfolio>;
  setStep: (s: OnboardingState["step"]) => void;
  setBasic: (b: Partial<OnboardingBasic>) => void;
  toggleSkill: (s: string) => void;
  setPortfolio: (p: Partial<OnboardingPortfolio>) => void;
  reset: () => void;
}

export const useOnboardingDraft = create<OnboardingState>()(
  persist(
    (set) => ({
      step: 1,
      basic: {},
      skills: ["React"],
      portfolio: { links: {} },
      setStep: (step) => set({ step }),
      setBasic: (b) => set((s) => ({ basic: { ...s.basic, ...b } })),
      toggleSkill: (skill) =>
        set((s) => ({
          skills: s.skills.includes(skill)
            ? s.skills.filter((x) => x !== skill)
            : [...s.skills, skill],
        })),
      setPortfolio: (p) => set((s) => ({ portfolio: { ...s.portfolio, ...p } })),
      reset: () => set({ step: 1, basic: {}, skills: [], portfolio: { links: {} } }),
    }),
    {
      name: "aavasar.onboarding.draft",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
