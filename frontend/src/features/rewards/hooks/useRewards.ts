import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore, useIsAuthenticated } from "@features/auth";
import { useToast } from "@shared/ui";
import { getPerks, getRewards, redeemPerk } from "../application/rewards.usecase";

export const rewardsKeys = {
  me: ["rewards", "me"] as const,
  perks: ["rewards", "perks"] as const,
};

function useEnabled() {
  const authed = useIsAuthenticated();
  const hasToken = useAuthStore((s) => !!s.session?.accessToken);
  return authed && hasToken;
}

export function useRewards() {
  const enabled = useEnabled();
  return useQuery({ queryKey: rewardsKeys.me, queryFn: getRewards, enabled, staleTime: 15_000 });
}

export function usePerks() {
  const enabled = useEnabled();
  return useQuery({ queryKey: rewardsKeys.perks, queryFn: getPerks, enabled, staleTime: 15_000 });
}

export function useRedeemPerk() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (perkKey: string) => redeemPerk(perkKey),
    onSuccess: (res) => {
      toast.success(`Redeemed ${res.redeemed.title}`, {
        description: `${res.redeemed.cost} points spent · ${res.balance} remaining.`,
      });
      qc.invalidateQueries({ queryKey: rewardsKeys.me });
      qc.invalidateQueries({ queryKey: rewardsKeys.perks });
    },
    onError: (err: unknown) => {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Please try again.";
      toast.error("Couldn't redeem perk", { description: msg });
    },
  });
}
