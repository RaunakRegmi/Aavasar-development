import { request } from "@shared/lib/transport";
import {
  OnboardingCompleteSchema,
  type OnboardingBasic,
  type OnboardingComplete,
  type OnboardingPortfolio,
  type OnboardingSkills,
} from "../contracts/onboarding.contract";

export const onboardingService = {
  async saveBasic(payload: OnboardingBasic): Promise<void> {
    await request<unknown>({ method: "PUT", url: "/onboarding/basic", data: payload });
  },
  async saveSkills(payload: OnboardingSkills): Promise<void> {
    await request<unknown>({ method: "PUT", url: "/onboarding/skills", data: payload });
  },
  async savePortfolio(payload: OnboardingPortfolio): Promise<void> {
    await request<unknown>({ method: "PUT", url: "/onboarding/portfolio", data: payload });
  },
  async finalize(): Promise<OnboardingComplete> {
    const raw = await request<unknown>({ method: "POST", url: "/onboarding/finalize" });
    return OnboardingCompleteSchema.parse(raw);
  },
};
