import { request, requestEnvelope } from "@shared/lib/transport";
import {
  GigListSchema,
  GigPipelineRowSchema,
  GigSchema,
  type CreateGigRequest,
  type Gig,
  type GigFilters,
  type GigPipelineRow,
  type GigStatus,
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

  /** Recruiter's own gigs (all statuses) — backs the "My Gigs" page. */
  async mine(): Promise<{ items: Gig[]; total: number }> {
    const envelope = await requestEnvelope<unknown>({
      method: "GET",
      url: "/gigs/mine",
      params: { page: 1, pageSize: 50 },
    });
    const items = GigListSchema.parse(envelope.data);
    return { items, total: envelope.meta?.total ?? items.length };
  },

  /** Create a gig (draft or published, per `publish`). */
  async create(payload: CreateGigRequest): Promise<Gig> {
    const raw = await request<unknown>({ method: "POST", url: "/gigs", data: payload });
    return GigSchema.parse(raw);
  },

  /** Change a gig's status (e.g. publish a draft: draft → active). */
  async updateStatus(id: string, status: GigStatus): Promise<Gig> {
    const raw = await request<unknown>({
      method: "PATCH",
      url: `/gigs/${id}`,
      data: { status },
    });
    return GigSchema.parse(raw);
  },

  async remove(id: string): Promise<void> {
    await request<unknown>({ method: "DELETE", url: `/gigs/${id}` });
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
