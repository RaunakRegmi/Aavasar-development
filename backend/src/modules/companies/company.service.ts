import { ConflictError } from "@lib/errors";
import type { AuthedUser } from "@middlewares/auth";
import { CompanyRepository } from "./company.repository";
import type { CompanyRegistrationRequest, CompanyRegistrationResponse } from "./company.contracts";

export class CompanyService {
  constructor(private readonly repo: CompanyRepository) {}

  async register(
    actor: AuthedUser,
    input: CompanyRegistrationRequest,
  ): Promise<CompanyRegistrationResponse> {
    const existing = await this.repo.findByContactUserId(actor.id);
    if (existing) {
      throw new ConflictError("You already have a registered company.");
    }

    const row = await this.repo.create({
      name: input.name,
      panVat: input.panVat,
      registrationNumber: input.registrationNumber,
      ownerPhone: input.ownerPhone ?? null,
      logoUrl: input.logoUrl ?? null,
      documentUrl: input.documentUrl ?? null,
      registrationStatus: "pending_review",
      contactUserId: actor.id,
    });

    return this.toDto(row);
  }

  private toDto(row: Record<string, unknown>): CompanyRegistrationResponse {
    const r = row as any;
    return {
      id: r.id,
      name: r.name,
      registrationStatus: r.registrationStatus,
      panVat: r.panVat ?? null,
      registrationNumber: r.registrationNumber ?? null,
      ownerPhone: r.ownerPhone ?? null,
      logoUrl: r.logoUrl ?? null,
      documentUrl: r.documentUrl ?? null,
      contactUserId: r.contactUserId,
      createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
    };
  }
}
