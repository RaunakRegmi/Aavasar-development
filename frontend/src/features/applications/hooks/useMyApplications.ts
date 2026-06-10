import { useQuery } from "@tanstack/react-query";
import { listMyApplications } from "../application/listMyApplications.usecase";

export const applicationQueryKeys = {
  my: ["applications", "my"] as const,
};

export function useMyApplications() {
  return useQuery({
    queryKey: applicationQueryKeys.my,
    queryFn: listMyApplications,
    staleTime: 15_000,
  });
}
