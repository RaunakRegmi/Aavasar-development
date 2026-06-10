/**
 * Mapper — Prisma `Gig` (with its `company` relation loaded) → public
 * `GigDto`. Snake-case → camelCase + integer-minor → Money object.
 */
import type { Company, Gig } from "@prisma/client";
import type { GigDto } from "./gig.contracts";

export type GigWithCompany = Gig & { company: Pick<Company, "id" | "name" | "verified"> };

export function toGigDto(row: GigWithCompany): GigDto {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    company: { id: row.company.id, name: row.company.name, verified: row.company.verified },
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
