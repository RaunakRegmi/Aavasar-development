import { z } from "zod";

/** A numeric limit, where `null` means "unlimited". */
const LimitSchema = z.number().int().nonnegative().nullable();

export const BillingMeSchema = z.object({
  tier: z.enum(["basic", "professional", "enterprise"]),
  planName: z.string(),
  status: z.string().nullable(),
  currentPeriodEnd: z.string().datetime().nullable(),
  extraGigSlots: z.number().int().nonnegative(),
  limits: z.object({
    maxActiveGigs: LimitSchema,
    applicationsPerMonth: LimitSchema,
    featuredSlots: LimitSchema,
    aiScreening: z.boolean(),
    apiAccess: z.boolean(),
  }),
  usage: z.object({
    activeGigs: z.number().int().nonnegative(),
    activeGigsLimit: LimitSchema,
    applicationsThisMonth: z.number().int().nonnegative(),
    applicationsLimit: LimitSchema,
  }),
});
export type BillingMe = z.infer<typeof BillingMeSchema>;

export const CheckoutResponseSchema = z.object({ url: z.string().url() });
export type CheckoutResponse = z.infer<typeof CheckoutResponseSchema>;

export const CheckoutTargetSchema = z.enum(["professional", "addon_gigslots", "addon_featured"]);
export type CheckoutTarget = z.infer<typeof CheckoutTargetSchema>;
