/**
 * Upload use-case: client-side guardrails THEN network call.
 *
 *   1. Size check against the L6 `UPLOAD_LIMITS` table.
 *   2. MIME check (`accept`).
 *   3. Hand off to the L4 service.
 *
 * The backend re-validates everything — these are the UX-level
 * "fail in <50ms before we burn bandwidth" checks. If we ever swap to
 * resumable uploads (tus / s3 multipart) this is the single seam.
 */
import { uploadService } from "../api/upload.service";
import {
  UPLOAD_LIMITS,
  type UploadDto,
  type UploadKind,
} from "../contracts/upload.contract";

export interface UploadValidationError {
  code: "TOO_LARGE" | "WRONG_TYPE" | "EMPTY";
  message: string;
}

export function validateForUpload(
  kind: UploadKind,
  file: File,
): UploadValidationError | null {
  const limits = UPLOAD_LIMITS[kind];
  if (file.size === 0) {
    return { code: "EMPTY", message: "That file is empty." };
  }
  if (file.size > limits.maxBytes) {
    const limitMb = Math.round(limits.maxBytes / (1024 * 1024));
    return {
      code: "TOO_LARGE",
      message: `File is too large — keep it under ${limitMb} MB.`,
    };
  }
  if (!(limits.accept as ReadonlyArray<string>).includes(file.type)) {
    return {
      code: "WRONG_TYPE",
      message: `Unsupported format — ${limits.label.toLowerCase()}`,
    };
  }
  return null;
}

export async function uploadFile(kind: UploadKind, file: File): Promise<UploadDto> {
  const issue = validateForUpload(kind, file);
  if (issue) throw new Error(issue.message);
  return uploadService.upload(kind, file);
}
