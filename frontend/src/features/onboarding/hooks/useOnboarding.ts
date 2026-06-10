import { useMutation } from "@tanstack/react-query";
import {
  finalizeOnboarding,
  submitBasic,
  submitPortfolio,
  submitSkills,
} from "../application/onboarding.usecase";
import { useOnboardingDraft } from "../store/onboarding.store";

export function useOnboardingState() {
  return useOnboardingDraft();
}

export function useSubmitBasic() {
  return useMutation({ mutationFn: submitBasic });
}
export function useSubmitSkills() {
  return useMutation({ mutationFn: submitSkills });
}
export function useSubmitPortfolio() {
  return useMutation({ mutationFn: submitPortfolio });
}
export function useFinalizeOnboarding() {
  return useMutation({ mutationFn: finalizeOnboarding });
}
