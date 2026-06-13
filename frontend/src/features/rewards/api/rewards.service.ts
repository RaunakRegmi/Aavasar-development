import { request } from "@shared/lib/transport";
import {
  PerkCatalogSchema,
  RedeemResponseSchema,
  RewardsMeSchema,
  type PerkCatalog,
  type RedeemResponse,
  type RewardsMe,
} from "../contracts/rewards.contract";

export const rewardsService = {
  async me(): Promise<RewardsMe> {
    return RewardsMeSchema.parse(await request<unknown>({ method: "GET", url: "/rewards/me" }));
  },
  async perks(): Promise<PerkCatalog> {
    return PerkCatalogSchema.parse(await request<unknown>({ method: "GET", url: "/rewards/perks" }));
  },
  async redeem(perkKey: string): Promise<RedeemResponse> {
    return RedeemResponseSchema.parse(
      await request<unknown>({ method: "POST", url: "/rewards/redeem", data: { perkKey } }),
    );
  },
};

export type RewardsService = typeof rewardsService;
