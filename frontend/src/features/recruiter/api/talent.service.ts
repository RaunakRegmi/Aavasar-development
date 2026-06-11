import { request, requestEnvelope } from "@shared/lib/transport";
import {
  TalentListSchema,
  TalentSchema,
  type Talent,
  type TalentFilters,
} from "../contracts/talent.contract";

export const talentService = {
  async list(filters: TalentFilters): Promise<{ items: Talent[]; total: number }> {
    const envelope = await requestEnvelope<unknown>({
      method: "GET",
      url: "/talent",
      params: filters,
    });
    const items = TalentListSchema.parse(envelope.data);
    return { items, total: envelope.meta?.total ?? items.length };
  },

  async getById(id: string): Promise<Talent> {
    const raw = await request<unknown>({ method: "GET", url: `/talent/${id}` });
    return TalentSchema.parse(raw);
  },
};

export type TalentService = typeof talentService;
