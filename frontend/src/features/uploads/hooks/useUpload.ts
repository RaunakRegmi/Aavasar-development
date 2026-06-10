import { useMutation } from "@tanstack/react-query";
import { uploadFile } from "../application/upload.usecase";
import type { UploadDto, UploadKind } from "../contracts/upload.contract";

interface UploadMutationVars {
  kind: UploadKind;
  file: File;
}

/**
 * One mutation hook covers all three kinds (`avatar`, `portfolio`,
 * `attachment`). Callers do:
 *
 *     const upload = useUpload();
 *     const dto = await upload.mutateAsync({ kind: "avatar", file });
 */
export function useUpload() {
  return useMutation<UploadDto, Error, UploadMutationVars>({
    mutationFn: ({ kind, file }) => uploadFile(kind, file),
  });
}
