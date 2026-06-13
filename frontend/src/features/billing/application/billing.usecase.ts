import { billingService } from "../api/billing.service";
import type { CheckoutTarget } from "../contracts/billing.contract";

export const getBilling = () => billingService.me();
export const startCheckout = (target: CheckoutTarget) => billingService.checkout(target);
export const openBillingPortal = () => billingService.portal();
