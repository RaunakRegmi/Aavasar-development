import { companyService } from "../api/company.service";
import { CompanyRegistrationRequestSchema } from "../contracts/company.registration.contract";
import type { CompanyRegistrationRequest, CompanyRegistrationResponse } from "../contracts/company.registration.contract";

export async function registerCompany(payload: CompanyRegistrationRequest): Promise<CompanyRegistrationResponse> {
  const parsed = CompanyRegistrationRequestSchema.parse(payload);
  return companyService.register(parsed);
}
