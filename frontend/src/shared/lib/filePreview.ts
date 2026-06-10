export interface FilePreview {
  objectUrl: string;
  revoke: () => void;
}

export function createFilePreview(file: File): FilePreview {
  const objectUrl = URL.createObjectURL(file);
  return {
    objectUrl,
    revoke: () => URL.revokeObjectURL(objectUrl),
  };
}
