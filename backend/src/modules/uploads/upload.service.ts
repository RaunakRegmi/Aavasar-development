/**
 * UploadService — pure orchestration. Doesn't know about Express.
 *
 *   1. Stream bytes to the storage adapter.
 *   2. Persist metadata to the DB.
 *   3. Side-effect: if the upload is an `avatar`, mirror its URL onto
 *      the user row so reads of `SessionUser.avatarUrl` resolve without
 *      a second query.
 *
 * Failure handling: if step 2 fails after step 1 succeeded, we roll the
 * storage write back via `storage.remove(...)`. Without that, a DB
 * outage would orphan bytes on disk.
 */
import { UploadRepository } from "./upload.repository";
import { UserRepository } from "@modules/users/user.repository";
import { uploadStorage, type UploadKind } from "@lib/upload";
import { logger } from "@config/logger";
import { BadRequestError, InternalError } from "@lib/errors";
import type { UploadDto } from "./upload.contracts";

export class UploadService {
  constructor(
    private readonly uploads: UploadRepository,
    private readonly users: UserRepository,
  ) {}

  async upload(args: {
    userId: string;
    kind: UploadKind;
    file: Express.Multer.File | undefined;
  }): Promise<UploadDto> {
    if (!args.file) {
      throw new BadRequestError("No file received — attach one as `file` in form-data.");
    }
    if (args.file.size === 0) {
      throw new BadRequestError("File is empty.");
    }

    const persisted = await uploadStorage.persist({
      userId: args.userId,
      kind: args.kind,
      originalName: args.file.originalname,
      mimeType: args.file.mimetype,
      buffer: args.file.buffer,
    });

    let row;
    try {
      row = await this.uploads.create({
        userId: args.userId,
        kind: args.kind,
        originalName: persisted.originalName,
        mimeType: persisted.mimeType,
        sizeBytes: persisted.sizeBytes,
        storageKey: persisted.storageKey,
        url: persisted.url,
      });
    } catch (err) {
      // Compensate the storage write so we don't orphan bytes on disk.
      await uploadStorage.remove(persisted.storageKey).catch((cleanupErr) =>
        logger.error(
          { event: "upload.cleanup.failed", storageKey: persisted.storageKey, err: cleanupErr },
          "Failed to clean up orphaned upload bytes.",
        ),
      );
      throw new InternalError("Could not record upload — please retry.", err);
    }

    // Mirror image URLs onto the user row so a subsequent read of
    // SessionUser is already current. NID/portfolio aren't mirrored —
    // they live in the Upload table only (the aggregated `/me`
    // response resolves them via UploadRepository.findLatest).
    if (args.kind === "avatar") {
      await this.users.update(args.userId, { avatarUrl: persisted.url });
    } else if (args.kind === "banner") {
      await this.users.update(args.userId, { bannerUrl: persisted.url });
    }

    return {
      id: row.id,
      kind: row.kind,
      url: row.url,
      mimeType: row.mimeType,
      sizeBytes: row.sizeBytes,
      originalName: row.originalName,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
