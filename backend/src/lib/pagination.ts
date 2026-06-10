/**
 * Pagination + sort helpers shared by every listing endpoint.
 *
 * The `PaginationSchema` plugs into a controller's Zod chain; the
 * resulting `{ page, pageSize, skip, take }` is what repositories
 * pass into Prisma directly.
 */
import { z } from "zod";

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
});
export type Pagination = z.infer<typeof PaginationSchema>;

export interface PrismaPageArgs {
  skip: number;
  take: number;
}

export function toPrismaPage({ page, pageSize }: Pagination): PrismaPageArgs {
  return { skip: (page - 1) * pageSize, take: pageSize };
}

/**
 * Sort helper. Accepts a comma-separated `sort` query string like
 * `-postedAt,title` and returns Prisma-style orderBy objects.
 * Pass a whitelist so users can't sort by `passwordHash`.
 */
export function parseSort<TField extends string>(
  raw: string | undefined,
  whitelist: ReadonlyArray<TField>,
): Array<Record<TField, "asc" | "desc">> {
  if (!raw) return [];
  return raw
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => {
      const desc = token.startsWith("-");
      const field = (desc ? token.slice(1) : token) as TField;
      if (!whitelist.includes(field)) return null;
      return { [field]: desc ? "desc" : "asc" } as Record<TField, "asc" | "desc">;
    })
    .filter((x): x is Record<TField, "asc" | "desc"> => x !== null);
}
