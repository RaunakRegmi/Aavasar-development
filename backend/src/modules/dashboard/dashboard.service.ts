/**
 * DashboardService — maps the raw aggregations into the exact DTO shapes
 * the frontend `features/dashboard` contracts expect.
 */
import { DashboardRepository } from "./dashboard.repository";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const npr = (amountMinor: number) => ({ amountMinor, currency: "NPR" as const });

export class DashboardService {
  constructor(private readonly repo: DashboardRepository) {}

  // ---------- Student ----------

  async studentKpis(userId: string) {
    const k = await this.repo.studentKpis(userId);
    return {
      totalEarnings: npr(k.totalEarningsMinor),
      activeGigs: k.activeGigs,
      applications: k.applications,
      averageRating: 0, // no ratings system yet
    };
  }

  async studentActiveGigs(userId: string) {
    const rows = await this.repo.studentActiveGigs(userId);
    return rows.map((a: any) => ({
      id: a.gig.id,
      title: a.gig.title,
      company: a.gig.company?.name ?? "Individual recruiter",
      status: a.gig.status as "active" | "reviewing" | "submitted",
      statusLabel: cap(a.gig.status),
      milestone: a.status === "accepted" ? "In progress" : cap(a.status),
      amount: npr(a.gig.payAmountMinor),
    }));
  }

  async studentUpcoming() {
    return []; // no events source yet
  }

  async studentCourse() {
    return null; // no learning system yet
  }

  // ---------- Recruiter ----------

  async recruiterKpis(userId: string) {
    const k = await this.repo.recruiterKpis(userId);
    return {
      activeGigs: k.activeGigs,
      activeGigsDelta: k.newGigs > 0 ? `+${k.newGigs}` : "—",
      newApplicants: k.newApplicants,
      newApplicantsDelta: k.newApplicants > 0 ? `+${k.newApplicants}` : "—",
      pendingInterviews: k.pendingInterviews,
      pendingInterviewsNext: "Next 7 days",
      totalHired: k.totalHired,
    };
  }

  async recruiterApplicants(userId: string) {
    const rows = await this.repo.recruiterApplicants(userId);
    return rows.map((a: any) => ({
      id: a.id,
      fullName: a.user.fullName,
      ...(a.user.avatarUrl ? { avatarUrl: a.user.avatarUrl } : {}),
      appliedFor: a.gig.title,
      skills: a.user.skills ?? [],
    }));
  }

  async recruiterPipeline(userId: string) {
    const rows = await this.repo.recruiterPipeline(userId);
    return rows.map((g: any) => ({
      id: g.id,
      title: g.title,
      subtitle: g.company?.name ?? g.category,
      postedAt: g.postedAt.toISOString(),
      applicantCount: g._count.applications,
      applicantFillPct: Math.min(100, g._count.applications * 20),
      status: g.status,
    }));
  }
}
