/**
 * Mapper — Prisma `Gig` (with its `company` + `postedBy` relations loaded)
 * → public `GigDto`. Snake-case → camelCase + integer-minor → Money object.
 *
 * A gig is posted EITHER under a company OR by an individual recruiter.
 * We collapse both into a single `poster` identity so the UI renders one
 * consistent shape; `postedAs` disambiguates the two.
 */
import type { Company, Gig, User } from "@prisma/client";
import type { GigDto } from "./gig.contracts";

export type GigWithRelations = Gig & {
  company: Pick<Company, "id" | "name" | "verified" | "logoUrl"> | null;
  postedBy: Pick<User, "id" | "fullName" | "avatarUrl" | "verified">;
};

export function toGigDto(row: GigWithRelations): GigDto {
  const poster = row.company
    ? {
        id: row.company.id,
        name: row.company.name,
        avatarUrl: row.company.logoUrl ?? null,
        verified: row.company.verified,
      }
    : {
        id: row.postedBy.id,
        name: row.postedBy.fullName,
        avatarUrl: row.postedBy.avatarUrl ?? null,
        verified: row.postedBy.verified,
      };

  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    postedAs: row.company ? "company" : "individual",
    poster,
    location: row.location,
    duration: row.duration,
    payKind: row.payKind,
    pay: { amountMinor: row.payAmountMinor, currency: "NPR" },
    tags: row.tags,
    postedAt: row.postedAt.toISOString(),
    status: row.status,
    isPremium: row.isPremium,
  };
}
