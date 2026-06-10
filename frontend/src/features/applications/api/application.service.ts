import { requestEnvelope } from "@shared/lib/transport";
import {
  GigApplicationListSchema,
  type GigApplication,
} from "../contracts/application.contract";

export const applicationService = {
  async listMy(): Promise<{ items: GigApplication[]; total: number }> {
    const envelope = await requestEnvelope<unknown>({
      method: "GET",
      url: "/gigs/applied",
    });
    const items = GigApplicationListSchema.parse(envelope.data);
    return { items, total: envelope.meta?.total ?? items.length };
  },
};

export type ApplicationService = typeof applicationService;
