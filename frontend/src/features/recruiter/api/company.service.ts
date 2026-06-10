import { request } from "@shared/lib/transport";
import {
  CompanyRegistrationResponseSchema,
  type CompanyRegistrationRequest,
  type CompanyRegistrationResponse,
} from "../contracts/company.registration.contract";

export const companyService = {
  async register(payload: CompanyRegistrationRequest): Promise<CompanyRegistrationResponse> {
    const raw = await request<unknown>({
      method: "POST",
      url: "/companies/register",
      data: payload,
    });
    return CompanyRegistrationResponseSchema.parse(raw);
  },
};

export type CompanyService = typeof companyService;
