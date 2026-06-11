/**
 * Use-cases for the recruiter "My Gigs" management page: list own gigs,
 * publish a draft (draft → active), and delete. Pure functions — no React.
 */
import { gigService } from "../api/gig.service";
import type { Gig, GigStatus } from "../contracts/gig.contract";

export async function listMyGigs(): Promise<{ items: Gig[]; total: number }> {
  return gigService.mine();
}

export async function updateGigStatus(id: string, status: GigStatus): Promise<Gig> {
  return gigService.updateStatus(id, status);
}

export async function deleteGig(id: string): Promise<void> {
  return gigService.remove(id);
}
