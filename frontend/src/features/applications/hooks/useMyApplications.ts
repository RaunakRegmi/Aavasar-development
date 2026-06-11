import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listMyApplications } from "../application/listMyApplications.usecase";
import { applicationService } from "../api/application.service";
import type { ApplicationStatus } from "../contracts/application.contract";

export const applicationQueryKeys = {
  my: ["applications", "my"] as const,
  forGig: (gigId: string) => ["applications", "gig", gigId] as const,
  detail: (id: string) => ["applications", "detail", id] as const,
};

/** Student: my applications. */
export function useMyApplications() {
  return useQuery({
    queryKey: applicationQueryKeys.my,
    queryFn: listMyApplications,
    staleTime: 15_000,
  });
}

/** Recruiter: applicants for one of my gigs. */
export function useGigApplicants(gigId: string | undefined) {
  return useQuery({
    queryKey: applicationQueryKeys.forGig(gigId ?? ""),
    queryFn: () => applicationService.listForGig(gigId!),
    enabled: !!gigId,
    staleTime: 15_000,
  });
}

/** Recruiter: a single applicant's detail. */
export function useApplicant(id: string | undefined) {
  return useQuery({
    queryKey: applicationQueryKeys.detail(id ?? ""),
    queryFn: () => applicationService.getApplicant(id!),
    enabled: !!id,
    staleTime: 15_000,
  });
}

/** Recruiter: accept/reject/advance — invalidates applicant lists + detail. */
export function useUpdateApplicationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) =>
      applicationService.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["applications"] }),
  });
}
