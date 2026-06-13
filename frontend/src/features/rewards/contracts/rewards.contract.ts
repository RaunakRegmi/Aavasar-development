import { z } from "zod";

export const PointsTransactionSchema = z.object({
  id: z.string(),
  delta: z.number().int(),
  reason: z.string(),
  label: z.string(),
  createdAt: z.string().datetime(),
});
export type PointsTransaction = z.infer<typeof PointsTransactionSchema>;

export const RewardsMeSchema = z.object({
  balance: z.number().int().nonnegative(),
  transactions: z.array(PointsTransactionSchema),
});
export type RewardsMe = z.infer<typeof RewardsMeSchema>;

export const PerkSchema = z.object({
  key: z.string(),
  title: z.string(),
  description: z.string(),
  cost: z.number().int().nonnegative(),
  affordable: z.boolean(),
});
export type Perk = z.infer<typeof PerkSchema>;

export const PerkCatalogSchema = z.object({
  balance: z.number().int().nonnegative(),
  perks: z.array(PerkSchema),
});
export type PerkCatalog = z.infer<typeof PerkCatalogSchema>;

export const RedeemResponseSchema = z.object({
  balance: z.number().int().nonnegative(),
  redeemed: z.object({
    key: z.string(),
    title: z.string(),
    cost: z.number().int().nonnegative(),
  }),
});
export type RedeemResponse = z.infer<typeof RedeemResponseSchema>;
