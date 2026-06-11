import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getGigById,
  listFeaturedGigs,
  listGigs,
  listRecruiterPipeline,
} from "../application/listGigs.usecase";
import { createGig } from "../application/createGig.usecase";
import { deleteGig, listMyGigs, updateGigStatus } from "../application/myGigs.usecase";
import type { CreateGigInput, GigFilters, GigStatus } from "../contracts/gig.contract";

export const gigQueryKeys = {
  all: ["gigs"] as const,
  list: (filters: Partial<GigFilters>) => ["gigs", "list", filters] as const,
  detail: (id: string) => ["gigs", "detail", id] as const,
  featured: () => ["gigs", "featured"] as const,
  pipeline: () => ["gigs", "pipeline"] as const,
  mine: () => ["gigs", "mine"] as const,
};

export function useGigList(filters: Partial<GigFilters> = {}) {
  return useQuery({
    queryKey: gigQueryKeys.list(filters),
    queryFn: () => listGigs(filters),
    staleTime: 30_000,
  });
}

export function useGigById(id: string | undefined) {
  return useQuery({
    queryKey: gigQueryKeys.detail(id!),
    queryFn: () => getGigById(id!),
    enabled: !!id,
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

/** Recruiter's own gigs (all statuses) for the "My Gigs" page. */
export function useMyGigs() {
  return useQuery({
    queryKey: gigQueryKeys.mine(),
    queryFn: listMyGigs,
    staleTime: 15_000,
  });
}

/** Invalidate every gig query (public lists + featured + mine). */
function useInvalidateGigs() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: gigQueryKeys.all });
}

export function useCreateGig() {
  const invalidate = useInvalidateGigs();
  return useMutation({
    mutationFn: (payload: CreateGigInput) => createGig(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateGigStatus() {
  const invalidate = useInvalidateGigs();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: GigStatus }) =>
      updateGigStatus(id, status),
    onSuccess: invalidate,
  });
}

export function useDeleteGig() {
  const invalidate = useInvalidateGigs();
  return useMutation({
    mutationFn: (id: string) => deleteGig(id),
    onSuccess: invalidate,
  });
}
