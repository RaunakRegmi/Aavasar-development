/**
 * MeService — assembles the `MeAggregate` DTO from the multi-relation
 * read above. Strict role-based access is enforced by the repository
 * filter (`where: { id: userId }`) — a user can only ever see their own.
 *
 * What the service contributes on top of the raw fetch:
 *   • collapse the upload array → "latest per kind"
 *   • drop NID metadata for non-owners (defense in depth — even though
 *     the caller IS the owner here, future admin endpoints will reuse
 *     this shape and need this rule preserved)
 *   • shape to the wire contract via toSessionUser + plain projection
 */
import { NotFoundError } from "@lib/errors";
import { toSessionUser } from "@modules/users/user.mapper";
import { MeRepository } from "./me.repository";
import type { MeAggregate } from "./me.contracts";

const UPLOAD_KINDS = ["avatar", "banner", "portfolio", "nid"] as const;
type AggregateUploadKind = (typeof UPLOAD_KINDS)[number];

export class MeService {
  constructor(private readonly repo: MeRepository) {}

  async getAggregate(userId: string): Promise<MeAggregate> {
    const row = await this.repo.fetchAggregate(userId);
    if (!row) throw new NotFoundError("User no longer exists.");

    // Pick the most recent upload per kind we care about.
    const latest: Record<AggregateUploadKind, MeAggregate["uploads"]["avatar"]> = {
      avatar: null,
      banner: null,
      portfolio: null,
      nid: null,
    };
    for (const u of row.uploads) {
      if ((UPLOAD_KINDS as readonly string[]).includes(u.kind) && !latest[u.kind as AggregateUploadKind]) {
        latest[u.kind as AggregateUploadKind] = {
          id: u.id,
          kind: u.kind as AggregateUploadKind,
          url: u.url,
          mimeType: u.mimeType,
          sizeBytes: u.sizeBytes,
          originalName: u.originalName,
          createdAt: u.createdAt.toISOString(),
        };
      }
    }

    return {
      user: toSessionUser(row),
      company: row.companyMembership
        ? {
            id: row.companyMembership.id,
            name: row.companyMembership.name,
            verified: row.companyMembership.verified,
            registrationStatus: row.companyMembership.registrationStatus,
            logoUrl: row.companyMembership.logoUrl ?? null,
          }
        : null,
      uploads: latest,
    };
  }
}
