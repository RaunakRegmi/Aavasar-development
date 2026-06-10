import { useQuery } from "@tanstack/react-query";
import {
  listFeaturedGigs,
  listGigs,
  listRecruiterPipeline,
} from "../application/listGigs.usecase";
import type { GigFilters } from "../contracts/gig.contract";

export const gigQueryKeys = {
  all: ["gigs"] as const,
  list: (filters: Partial<GigFilters>) => ["gigs", "list", filters] as const,
  featured: () => ["gigs", "featured"] as const,
  pipeline: () => ["gigs", "pipeline"] as const,
};

export function useGigList(filters: Partial<GigFilters> = {}) {
  return useQuery({
    queryKey: gigQueryKeys.list(filters),
    queryFn: () => listGigs(filters),
    staleTime: 30_000,
  });
}

export function useFeaturedGigs() {
  return useQuery({
    queryKey: gigQueryKeys.featured(),
    queryFn: listFeaturedGigs,
    staleTime: 5 * 60_000,
  });
}

export function useRecruiterPipeline() {
  return useQuery({
    queryKey: gigQueryKeys.pipeline(),
    queryFn: listRecruiterPipeline,
    staleTime: 15_000,
  });
}
