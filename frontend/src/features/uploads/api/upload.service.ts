/**
 * L4 — Upload service. Posts multipart/form-data to the backend and
 * parses the response through the L6 contract.
 *
 * Unlike other services in this codebase, we DON'T pass through the
 * generic `request<T>` helper because that one sets
 * `Content-Type: application/json`. multipart/form-data must let the
 * browser set the Content-Type so it can include the boundary value.
 */
import { http } from "@shared/lib/transport";
import { UploadDtoSchema, type UploadDto, type UploadKind } from "../contracts/upload.contract";

const PATH_BY_KIND: Record<UploadKind, string> = {
  avatar: "/uploads/avatar",
  banner: "/uploads/banner",
  portfolio: "/uploads/portfolio",
  nid: "/uploads/nid",
  attachment: "/uploads/attachment",
  companyLogo: "/uploads/company-logo",
  companyDocument: "/uploads/company-document",
};

export const uploadService = {
  async upload(kind: UploadKind, file: File): Promise<UploadDto> {
    const body = new FormData();
    body.append("file", file);
    // Pass the raw FormData; axios will set the right multipart header.
    const res = await http.request<{ data: unknown }>({
      method: "POST",
      url: PATH_BY_KIND[kind],
      data: body,
      // Explicitly clear the default so axios writes the boundary header.
      headers: { "Content-Type": undefined as unknown as string },
    });
    return UploadDtoSchema.parse(res.data.data);
  },
};

export type UploadService = typeof uploadService;
