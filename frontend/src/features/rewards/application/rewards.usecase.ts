import { rewardsService } from "../api/rewards.service";

export const getRewards = () => rewardsService.me();
export const getPerks = () => rewardsService.perks();
export const redeemPerk = (perkKey: string) => rewardsService.redeem(perkKey);
