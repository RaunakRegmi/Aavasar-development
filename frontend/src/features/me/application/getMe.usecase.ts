/**
 * LAYER 3 — `getMe` use case.
 *
 * The service is the only network seam; this layer exists so future
 * cross-cutting concerns (e.g. mirroring the SessionUser back onto
 * the auth store after a fresh fetch) have one home.
 */
import { useAuthStore } from "@features/auth";
import { meService } from "../api/me.service";
import type { MeAggregate } from "../contracts/me.contract";

export async function getMe(): Promise<MeAggregate> {
  const data = await meService.get();
  // Keep the auth store's SessionUser in step with whatever the server
  // most recently returned. Avoids a stale headline/skills on profile
  // pages after another tab patched the row.
  useAuthStore.getState().setUser(data.user);
  return data;
}
