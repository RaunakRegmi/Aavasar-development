/**
 * LAYER 2 — `/me` hook.
 *
 * React Query is the single source of truth for the aggregate while a
 * profile page is mounted. The query key `["me"]` is shared with the
 * mutations that change profile state (PATCH /me/profile, PATCH
 * /auth/password, POST /uploads/banner|portfolio|nid), each of which
 * invalidates this key on success so the dashboard updates.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useIsAuthenticated, useUpdateProfile } from "@features/auth";
import type { UpdateProfileRequest } from "@features/auth";
import { getMe } from "../application/getMe.usecase";

export const meQueryKeys = {
  all: ["me"] as const,
};

/**
 * Fetches the aggregate while there is an authenticated session. We
 * disable the query when the auth store is empty so the post-logout
 * flush doesn't synchronously refetch and 401.
 */
export function useMe() {
  const authed = useIsAuthenticated();
  return useQuery({
    queryKey: meQueryKeys.all,
    queryFn: getMe,
    enabled: authed,
    staleTime: 30_000,
  });
}

/**
 * PATCH /me/profile. Reuses `useUpdateProfile` under the hood (single
 * source of truth in the auth feature) and also invalidates the `me`
 * query so the dashboard re-fetches the aggregate.
 */
export function usePatchProfile() {
  const qc = useQueryClient();
  const inner = useUpdateProfile();
  return useMutation({
    mutationFn: (payload: UpdateProfileRequest) => inner.mutateAsync(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: meQueryKeys.all }),
  });
}
