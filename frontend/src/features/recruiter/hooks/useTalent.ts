/**
 * React Query bindings for the recruiter "Find Talent" surface — a
 * paginated/filterable student list and a single student detail.
 */
import { useQuery } from "@tanstack/react-query";
import { talentService } from "../api/talent.service";
import type { TalentFilters } from "../contracts/talent.contract";

export const talentQueryKeys = {
  all: ["talent"] as const,
  list: (filters: Partial<TalentFilters>) => ["talent", "list", filters] as const,
  detail: (id: string) => ["talent", "detail", id] as const,
};

export function useTalentList(filters: Partial<TalentFilters> = {}) {
  return useQuery({
    queryKey: talentQueryKeys.list(filters),
    queryFn: () => talentService.list(filters),
    staleTime: 30_000,
  });
}

export function useTalentById(id: string | undefined) {
  return useQuery({
    queryKey: talentQueryKeys.detail(id!),
    queryFn: () => talentService.getById(id!),
    enabled: !!id,
    staleTime: 30_000,
  });
}
