/**
 * Public DTO for an upload. Whatever the storage backend, the client
 * only ever sees `url + mimeType + sizeBytes + originalName`.
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
