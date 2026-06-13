import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore, useIsAuthenticated } from "@features/auth";
import { useToast } from "@shared/ui";
import { getBilling, openBillingPortal, startCheckout } from "../application/billing.usecase";
import type { CheckoutTarget } from "../contracts/billing.contract";

export const billingKeys = {
  me: ["billing", "me"] as const,
};

export function useBilling() {
  const authed = useIsAuthenticated();
  const hasToken = useAuthStore((s) => !!s.session?.accessToken);
  return useQuery({
    queryKey: billingKeys.me,
    queryFn: getBilling,
    enabled: authed && hasToken,
    staleTime: 15_000,
  });
}

/**
 * Starts a Stripe Checkout session and hard-redirects the browser to it.
 * On failure (e.g. Stripe not configured) surfaces the backend message.
 */
export function useStartCheckout() {
  const toast = useToast();
  return useMutation({
    mutationFn: (target: CheckoutTarget) => startCheckout(target),
    onSuccess: ({ url }) => {
      window.location.assign(url);
    },
    onError: (err: unknown) => {
      toast.error("Couldn't start checkout", { description: messageOf(err) });
    },
  });
}

export function useBillingPortal() {
  const toast = useToast();
  return useMutation({
    mutationFn: () => openBillingPortal(),
    onSuccess: ({ url }) => {
      window.location.assign(url);
    },
    onError: (err: unknown) => {
      toast.error("Couldn't open billing portal", { description: messageOf(err) });
    },
  });
}

function messageOf(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return "Please try again in a moment.";
}
