/**
 * Use-case: list gigs with sensible defaults + result enrichment.
 * Pure function — no React. The hook layer (L2) memoizes the result.
 */
import { gigService } from "../api/gig.service";
import { GigFiltersSchema, type Gig, type GigFilters } from "../contracts/gig.contract";

export interface ListGigsResult {
  items: Gig[];
  total: number;
  filters: GigFilters;
}

export async function listGigs(input: Partial<GigFilters> = {}): Promise<ListGigsResult> {
  const filters = GigFiltersSchema.parse(input);
  const { items, total } = await gigService.list(filters);
  return { items, total, filters };
}

export async function listFeaturedGigs(): Promise<Gig[]> {
  return gigService.featured();
}

export async function getGigById(id: string): Promise<Gig> {
  return gigService.getById(id);
}

export async function listRecruiterPipeline() {
  return gigService.pipeline();
}
