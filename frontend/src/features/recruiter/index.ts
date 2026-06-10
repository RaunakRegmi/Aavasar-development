export {
  CompanyRegistrationFormSchema,
  CompanyRegistrationRequestSchema,
  CompanyRegistrationResponseSchema,
  CompanyRegistrationStatusSchema,
} from "./contracts/company.registration.contract";
export type {
  CompanyRegistrationFormValues,
  CompanyRegistrationRequest,
  CompanyRegistrationResponse,
  CompanyRegistrationStatus,
} from "./contracts/company.registration.contract";

export { companyService } from "./api/company.service";
export type { CompanyService } from "./api/company.service";

export { registerCompany } from "./company/registerCompany.usecase";

export { useRegisterCompany, recruiterQueryKeys } from "./hooks/useRegisterCompany";

export { default as CompanyRegistrationPage } from "./pages/CompanyRegistrationPage";
