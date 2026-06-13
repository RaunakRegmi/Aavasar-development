import { request } from "@shared/lib/transport";
import {
  BillingMeSchema,
  CheckoutResponseSchema,
  type BillingMe,
  type CheckoutResponse,
  type CheckoutTarget,
} from "../contracts/billing.contract";

export const billingService = {
  async me(): Promise<BillingMe> {
    return BillingMeSchema.parse(
      await request<unknown>({ method: "GET", url: "/billing/me" }),
    );
  },
  async checkout(target: CheckoutTarget): Promise<CheckoutResponse> {
    return CheckoutResponseSchema.parse(
      await request<unknown>({ method: "POST", url: "/billing/checkout", data: { target } }),
    );
  },
  async portal(): Promise<CheckoutResponse> {
    return CheckoutResponseSchema.parse(
      await request<unknown>({ method: "POST", url: "/billing/portal" }),
    );
  },
};

export type BillingService = typeof billingService;
