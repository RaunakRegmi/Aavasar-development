/**
 * LAYER 4 — `/me` service.
 *
 * The one and only place that knows the `GET /me` URL. The aggregated
 * payload is parsed through `MeAggregateSchema` before it leaves the
 * service — every downstream layer treats it as ground truth.
 */
import { request } from "@shared/lib/transport";
import { MeAggregateSchema, type MeAggregate } from "../contracts/me.contract";

export const meService = {
  async get(): Promise<MeAggregate> {
    const raw = await request<unknown>({ method: "GET", url: "/me" });
    return MeAggregateSchema.parse(raw);
  },
};

export type MeService = typeof meService;
