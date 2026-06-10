import { z } from "zod";

export const CompanyRegistrationStatusSchema = z.enum(["pending_review", "approved", "rejected"]);

export const CompanyRegistrationRequestSchema = z.object({
  name: z.string().min(1, "Company name is required.").max(200),
  panVat: z.string().max(50).optional(),
  registrationNumber: z.string().max(100).optional(),
  ownerPhone: z.string().min(7, "Phone number must be at least 7 digits.").max(20),
  logoUrl: z.string().url().optional(),
  documentUrl: z.string().url().optional(),
});

export const CompanyRegistrationResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  registrationStatus: CompanyRegistrationStatusSchema,
  panVat: z.string().nullable(),
  registrationNumber: z.string().nullable(),
  ownerPhone: z.string().nullable(),
  logoUrl: z.string().nullable(),
  documentUrl: z.string().nullable(),
  contactUserId: z.string(),
  createdAt: z.string(),
});

export const CompanySchema = CompanyRegistrationResponseSchema.extend({
  verified: z.boolean(),
  updatedAt: z.string(),
});

export type CompanyRegistrationRequest = z.infer<typeof CompanyRegistrationRequestSchema>;
export type CompanyRegistrationResponse = z.infer<typeof CompanyRegistrationResponseSchema>;
export type Company = z.infer<typeof CompanySchema>;
