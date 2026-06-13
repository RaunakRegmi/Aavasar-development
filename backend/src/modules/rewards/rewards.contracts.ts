import { z } from "zod";

export const RedeemRequestSchema = z.object({
  perkKey: z.string().min(1),
});
export type RedeemRequest = z.infer<typeof RedeemRequestSchema>;
