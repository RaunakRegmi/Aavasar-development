/**
 * Use-case: create a gig (Post-a-Gig wizard). Pure function — validates
 * the payload against the contract, then delegates to the service.
 */
import { gigService } from "../api/gig.service";
import { CreateGigRequestSchema, type CreateGigInput, type Gig } from "../contracts/gig.contract";

export async function createGig(input: CreateGigInput): Promise<Gig> {
  const payload = CreateGigRequestSchema.parse(input);
  return gigService.create(payload);
}
