/**
 * Dashboard repository — read-only aggregations across gigs/applications
 * for the student & recruiter dashboard surfaces. Kept here (vs threading
 * through gig/application repos) so each dashboard read is one query plan.
 */
import type { PrismaClient } from "@prisma/client";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export class DashboardRepository {
  constructor(private readonly db: PrismaClient) {}

  // ---------- Student ----------

  async studentKpis(userId: string) {
    const [applications, activeGigs, completedAccepted] = await this.db.$transaction([
      this.db.application.count({ where: { userId } }),
      this.db.application.count({
        where: { userId, status: "accepted", gig: { status: "active" } },
      }),
      this.db.application.findMany({
        where: { userId, status: "accepted", gig: { status: "completed" } },
        select: { gig: { select: { payAmountMinor: true } } },
      }),
    ]);
    const totalEarningsMinor = completedAccepted.reduce(
      (sum, a) => sum + (a.gig?.payAmountMinor ?? 0),
      0,
    );
    return { applications, activeGigs, totalEarningsMinor };
  }

  studentActiveGigs(userId: string) {
    return this.db.application.findMany({
      where: {
        userId,
        status: { in: ["accepted", "reviewing", "pending"] },
        gig: { status: { in: ["active", "reviewing", "submitted"] } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { gig: { include: { company: { select: { name: true } } } } },
    });
  }

  // ---------- Recruiter ----------

  async recruiterKpis(userId: string) {
    const weekAgo = new Date(Date.now() - WEEK_MS);
    const [activeGigs, newGigs, newApplicants, pendingInterviews, totalHired] =
      await this.db.$transaction([
        this.db.gig.count({ where: { postedByUserId: userId, status: "active" } }),
        this.db.gig.count({
          where: { postedByUserId: userId, status: "active", postedAt: { gte: weekAgo } },
        }),
        this.db.application.count({
          where: { gig: { postedByUserId: userId }, createdAt: { gte: weekAgo } },
        }),
        this.db.application.count({
          where: { gig: { postedByUserId: userId }, status: "reviewing" },
        }),
        this.db.application.count({
          where: { gig: { postedByUserId: userId }, status: "accepted" },
        }),
      ]);
    return { activeGigs, newGigs, newApplicants, pendingInterviews, totalHired };
  }

  recruiterApplicants(userId: string) {
    return this.db.application.findMany({
      where: { gig: { postedByUserId: userId } },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        user: { select: { fullName: true, avatarUrl: true, skills: true } },
        gig: { select: { title: true } },
      },
    });
  }

  recruiterPipeline(userId: string) {
    return this.db.gig.findMany({
      where: { postedByUserId: userId },
      orderBy: { postedAt: "desc" },
      include: {
        company: { select: { name: true } },
        _count: { select: { applications: true } },
      },
    });
  }
}
