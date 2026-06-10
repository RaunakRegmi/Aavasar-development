import { useMutation } from "@tanstack/react-query";
import { registerCompany } from "../company/registerCompany.usecase";
import type { CompanyRegistrationRequest, CompanyRegistrationResponse } from "../contracts/company.registration.contract";

export const recruiterQueryKeys = {
  company: ["recruiter", "company"] as const,
};

export function useRegisterCompany() {
  return useMutation<CompanyRegistrationResponse, Error, CompanyRegistrationRequest>({
    mutationFn: registerCompany,
  });
}
