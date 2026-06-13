import { z } from "zod";

export const CheckoutRequestSchema = z.object({
  target: z.enum(["professional", "addon_gigslots", "addon_featured"]),
});

export type CheckoutRequest = z.infer<typeof CheckoutRequestSchema>;
