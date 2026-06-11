import { request, requestEnvelope } from "@shared/lib/transport";
import {
  ApplicantDetailSchema,
  ApplicantListSchema,
  GigApplicationListSchema,
  type Applicant,
  type ApplicantDetail,
  type ApplicationStatus,
  type GigApplication,
} from "../contracts/application.contract";

export const applicationService = {
  /** Student: my own applications. */
  async listMy(): Promise<{ items: GigApplication[]; total: number }> {
    const envelope = await requestEnvelope<unknown>({
      method: "GET",
      url: "/gigs/applied",
    });
    const items = GigApplicationListSchema.parse(envelope.data);
    return { items, total: envelope.meta?.total ?? items.length };
  },

  /** Recruiter: applicants for one of my gigs. */
  async listForGig(gigId: string): Promise<{ items: Applicant[]; total: number }> {
    const envelope = await requestEnvelope<unknown>({
      method: "GET",
      url: `/gigs/${gigId}/applications`,
      params: { page: 1, pageSize: 100 },
    });
    const items = ApplicantListSchema.parse(envelope.data);
    return { items, total: envelope.meta?.total ?? items.length };
  },

  /** Recruiter: a single applicant's full detail. */
  async getApplicant(id: string): Promise<ApplicantDetail> {
    const raw = await request<unknown>({ method: "GET", url: `/gigs/applications/${id}` });
    return ApplicantDetailSchema.parse(raw);
  },

  /** Recruiter: accept/reject/advance an application. */
  async updateStatus(id: string, status: ApplicationStatus): Promise<void> {
    await request<unknown>({
      method: "PATCH",
      url: `/gigs/${id}/status`,
      data: { status },
    });
  },
};

export type ApplicationService = typeof applicationService;
