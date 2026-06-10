/**
 * Upload infrastructure — multer storage + per-kind validation +
 * a pluggable `UploadStorage` abstraction.
 *
 * Local-disk implementation today. To move to S3 / R2 / GCS, swap the
 * default export's storage adapter without touching callers. The URL
 * the controller hands back is the only externally visible contract.
 */
import crypto from "node:crypto";
import path from "node:path";
import fs from "node:fs";
import multer, { type FileFilterCallback } from "multer";
import type { Request } from "express";
import { env } from "@config/env";
import { BadRequestError } from "./errors";

export type UploadKind = "avatar" | "banner" | "portfolio" | "nid" | "attachment" | "companyLogo" | "companyDocument";

/** Allowed MIME types per upload kind. */
const ALLOWED_MIME: Record<UploadKind, ReadonlySet<string>> = {
  avatar: new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]),
  banner: new Set(["image/jpeg", "image/png", "image/webp"]),
  portfolio: new Set(["application/pdf"]),
  // NID accepts a clear photo of the card OR a scanned PDF.
  nid: new Set(["application/pdf", "image/jpeg", "image/png"]),
  attachment: new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]),
  companyLogo: new Set(["image/jpeg", "image/png", "image/webp"]),
  companyDocument: new Set(["application/pdf", "image/jpeg", "image/png"]),
};

const MAX_BYTES: Record<UploadKind, number> = {
  avatar: env.upload.maxAvatarBytes,
  banner: env.upload.maxDocumentBytes,
  portfolio: env.upload.maxDocumentBytes,
  nid: env.upload.maxDocumentBytes,
  attachment: env.upload.maxDocumentBytes,
  companyLogo: env.upload.maxAvatarBytes,
  companyDocument: env.upload.maxDocumentBytes,
};

/** Extension lookup by MIME. We never trust client-supplied extension. */
const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

export interface PersistedUpload {
  storageKey: string;       // relative key inside UPLOAD_DIR
  url: string;              // URL to surface to the client
  absolutePath: string;     // for the local adapter; ignored by remote adapters
  sizeBytes: number;
  mimeType: string;
  originalName: string;
}

/**
 * Storage adapter contract. The current implementation writes to local
 * disk under `UPLOAD_DIR/<userId>/<kind>/<filename>`; a future S3 adapter
 * would use `s3:putObject` to the same logical key.
 */
export interface UploadStorage {
  persist(args: {
    userId: string;
    kind: UploadKind;
    originalName: string;
    mimeType: string;
    buffer: Buffer;
  }): Promise<PersistedUpload>;
  remove(storageKey: string): Promise<void>;
}

class LocalUploadStorage implements UploadStorage {
  constructor(private readonly rootDir: string, private readonly publicBase: string) {}

  async persist(args: {
    userId: string;
    kind: UploadKind;
    originalName: string;
    mimeType: string;
    buffer: Buffer;
  }): Promise<PersistedUpload> {
    const ext = EXT_BY_MIME[args.mimeType] ?? "bin";
    const fileName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
    const relativeDir = path.posix.join(args.userId, args.kind);
    const absoluteDir = path.join(this.rootDir, relativeDir);
    await fs.promises.mkdir(absoluteDir, { recursive: true });

    const absolutePath = path.join(absoluteDir, fileName);
    await fs.promises.writeFile(absolutePath, args.buffer);

    const storageKey = path.posix.join(relativeDir, fileName);
    return {
      storageKey,
      url: `${this.publicBase}/${storageKey}`,
      absolutePath,
      sizeBytes: args.buffer.byteLength,
      mimeType: args.mimeType,
      originalName: args.originalName,
    };
  }

  async remove(storageKey: string): Promise<void> {
    const absolutePath = path.join(this.rootDir, storageKey);
    await fs.promises.rm(absolutePath, { force: true });
  }
}

/** Default storage adapter. Replace inside the container to swap backends. */
export const uploadStorage: UploadStorage = new LocalUploadStorage(
  path.resolve(env.upload.dir),
  env.upload.publicBase,
);

/**
 * Build a multer middleware for a given upload kind. Files are kept
 * in memory so the storage adapter (not multer) decides where the bytes
 * end up — that's how the S3 swap stays a one-file change.
 */
export function makeUploadMiddleware(kind: UploadKind) {
  const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    if (!ALLOWED_MIME[kind].has(file.mimetype)) {
      cb(
        new BadRequestError(
          `Unsupported file type for ${kind}: ${file.mimetype}.`,
        ) as unknown as Error,
      );
      return;
    }
    cb(null, true);
  };

  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_BYTES[kind], files: 1 },
    fileFilter,
  }).single("file");
}
