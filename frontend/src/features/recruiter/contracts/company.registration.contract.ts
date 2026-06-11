import { z } from "zod";

export const CompanyRegistrationStatusSchema = z.enum(["pending_review", "approved", "rejected"]);

export const CompanyRegistrationRequestSchema = z.object({
  name: z.string().min(1, "Company name is required.").max(200),
  panVat: z.string().min(1, "PAN / VAT number is required.").max(50),
  registrationNumber: z.string().min(1, "Registration number is required.").max(100),
  ownerPhone: z
    .string()
    .min(7, "Phone number must be at least 7 digits.")
    .max(20, "Phone number is too long."),
  // Upload URLs are app-relative paths (e.g. "/uploads/..."), not absolute
  // URLs — match the avatarUrl contract rather than rejecting with .url().
  logoUrl: z.string().min(1).max(2048).optional(),
  documentUrl: z.string().min(1).max(2048).optional(),
});

export const CompanyRegistrationFormSchema = z.object({
  name: z.string().min(1, "Company name is required.").max(200),
  panVat: z
    .string()
    .min(1, "PAN / VAT number is required.")
    .max(50, "PAN/VAT must be under 50 characters."),
  registrationNumber: z
    .string()
    .min(1, "Registration number is required.")
    .max(100, "Registration number is too long."),
  ownerPhone: z
    .string()
    .min(7, "Phone number must be at least 7 digits.")
    .max(20, "Phone number is too long."),
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

export type CompanyRegistrationFormValues = z.infer<typeof CompanyRegistrationFormSchema>;
export type CompanyRegistrationRequest = z.infer<typeof CompanyRegistrationRequestSchema>;
export type CompanyRegistrationResponse = z.infer<typeof CompanyRegistrationResponseSchema>;
export type CompanyRegistrationStatus = z.infer<typeof CompanyRegistrationStatusSchema>;
