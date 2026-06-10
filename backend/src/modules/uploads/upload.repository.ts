import type { PrismaClient, Upload } from "@prisma/client";
import type { UploadKind } from "@lib/upload";

export class UploadRepository {
  constructor(private readonly db: PrismaClient) {}

  create(input: {
    userId: string;
    kind: UploadKind;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    storageKey: string;
    url: string;
  }): Promise<Upload> {
    return this.db.upload.create({ data: input });
  }

  findById(id: string): Promise<Upload | null> {
    return this.db.upload.findUnique({ where: { id } });
  }

  /** Most recent upload of a kind for a user — used to surface "your CV". */
  findLatest(userId: string, kind: UploadKind): Promise<Upload | null> {
    return this.db.upload.findFirst({
      where: { userId, kind },
      orderBy: { createdAt: "desc" },
    });
  }

  delete(id: string): Promise<void> {
    return this.db.upload.delete({ where: { id } }).then(() => undefined);
  }
}
