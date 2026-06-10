/**
 * Upload wire contract — mirrors the backend's `UploadDto` exactly
 * (see backend/src/modules/uploads/upload.contracts.ts).
 */
import { z } from "zod";

export const UploadKindSchema = z.enum(["avatar", "banner", "portfolio", "nid", "attachment", "companyLogo", "companyDocument"]);
export type UploadKind = z.infer<typeof UploadKindSchema>;

export const UploadDtoSchema = z.object({
  id: z.string(),
  kind: UploadKindSchema,
  url: z.string(),
  mimeType: z.string(),
  sizeBytes: z.number().int().nonnegative(),
  originalName: z.string(),
  createdAt: z.string(),
});
export type UploadDto = z.infer<typeof UploadDtoSchema>;

/**
 * Client-side guardrails. Backend re-validates — these are just the
 * UX-level "fail fast before we burn upload bandwidth" checks.
 */
export const UPLOAD_LIMITS = {
  avatar: {
    maxBytes: 2 * 1024 * 1024,
    accept: ["image/jpeg", "image/png", "image/gif", "image/webp"] as const,
    label: "JPG, PNG, GIF or WebP — max 2 MB.",
  },
  banner: {
    maxBytes: 10 * 1024 * 1024,
    accept: ["image/jpeg", "image/png", "image/webp"] as const,
    label: "JPG, PNG or WebP — max 10 MB.",
  },
  portfolio: {
    maxBytes: 10 * 1024 * 1024,
    accept: ["application/pdf"] as const,
    label: "PDF only — max 10 MB.",
  },
  nid: {
    maxBytes: 10 * 1024 * 1024,
    accept: ["application/pdf", "image/jpeg", "image/png"] as const,
    label: "PDF or clear photo (JPG/PNG) — max 10 MB. Kept private.",
  },
  attachment: {
    maxBytes: 10 * 1024 * 1024,
    accept: ["application/pdf", "image/jpeg", "image/png", "image/webp"] as const,
    label: "PDF or image — max 10 MB.",
  },
  companyLogo: {
    maxBytes: 2 * 1024 * 1024,
    accept: ["image/jpeg", "image/png", "image/webp"] as const,
    label: "JPG, PNG or WebP — max 2 MB.",
  },
  companyDocument: {
    maxBytes: 10 * 1024 * 1024,
    accept: ["application/pdf", "image/jpeg", "image/png"] as const,
    label: "PDF or clear photo (JPG/PNG) — max 10 MB.",
  },
} as const satisfies Record<
  UploadKind,
  { maxBytes: number; accept: ReadonlyArray<string>; label: string }
>;
