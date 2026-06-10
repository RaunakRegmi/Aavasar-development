import { request, requestEnvelope } from "@shared/lib/transport";
import {
  GigListSchema,
  GigPipelineRowSchema,
  GigSchema,
  type Gig,
  type GigFilters,
  type GigPipelineRow,
} from "../contracts/gig.contract";
import { z } from "zod";

export const gigService = {
  /** Public listing (marketing site + Student "Find Work"). */
  async list(filters: GigFilters): Promise<{ items: Gig[]; total: number }> {
    const envelope = await requestEnvelope<unknown>({
      method: "GET",
      url: "/gigs",
      params: filters,
    });
    const items = GigListSchema.parse(envelope.data);
    return { items, total: envelope.meta?.total ?? items.length };
  },

  async featured(): Promise<Gig[]> {
    const raw = await request<unknown>({ method: "GET", url: "/gigs/featured" });
    return GigListSchema.parse(raw);
  },

  async getById(id: string): Promise<Gig> {
    const raw = await request<unknown>({ method: "GET", url: `/gigs/${id}` });
    return GigSchema.parse(raw);
  },

  /** Recruiter-side: aggregated rows for the "Active Gigs" table. */
  async pipeline(): Promise<GigPipelineRow[]> {
    const raw = await request<unknown>({
      method: "GET",
      url: "/recruiter/gigs/pipeline",
    });
    return z.array(GigPipelineRowSchema).parse(raw);
  },
};

export type GigService = typeof gigService;
