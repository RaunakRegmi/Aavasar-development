/**
 * Mock fixtures — kept in one file so designers can tweak the
 * "showroom" data without touching adapters. Each fixture matches
 * the L6 contract for that domain object, so a real backend can
 * later return the exact same shape without UI changes.
 */
import type { Gig, GigPipelineRow } from "@features/gigs";
import type {
  StudentDashboardKpis,
  ActiveGigSummary,
  UpcomingEvent,
  CourseProgress,
  RecruiterDashboardKpis,
  ApplicantPreview,
} from "@features/dashboard";
import type { AuthSession } from "@features/auth";

/**
 * Sessions are returned by FACTORY functions, not module-static constants.
 * Why: `expiresAt` is computed from `Date.now()`. If a constant were
 * frozen at module-import time, then after >1h of dev the session
 * returned by sign-in would already be "expired" — and AuthBoot's
 * `clearIfExpired` would wipe it the moment login succeeded, making
 * the whole app look broken. The factory ensures every response is
 * fresh.
 */
const SESSION_TTL_MS = 60 * 60_000;

export function makeStudentSession(): AuthSession {
  return {
    accessToken: "mock-student-token",
    refreshToken: "mock-student-refresh",
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
    user: {
      id: "u_student_1",
      email: "pratikshya@university.edu",
      fullName: "Pratikshya Sharma",
      role: "student",
      avatarUrl: "/photos/peer-network.jpg",
      onboardingCompleted: true,
      verified: true,
      skills: [],
    },
  };
}

export function makeRecruiterSession(): AuthSession {
  return {
    accessToken: "mock-recruiter-token",
    refreshToken: "mock-recruiter-refresh",
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
    user: {
      id: "u_recruiter_1",
      email: "sushma@company.com",
      fullName: "Sushma Karki",
      role: "recruiter",
      avatarUrl: "/photos/peer-network.jpg",
      onboardingCompleted: true,
      verified: true,
      skills: [],
    },
  };
}

/** Snapshots for fixtures that need the user shape directly (e.g. /auth/me). */
export const mockStudentSession: AuthSession = makeStudentSession();
export const mockRecruiterSession: AuthSession = makeRecruiterSession();

export const mockFeaturedGigs: Gig[] = [
  {
    id: "g1",
    title: "Lead UI Designer for EdTech MVP",
    category: "DESIGN",
    description:
      "Help us shape the future of learning by designing a cohesive, accessible, and vibrant mobile interface for K-12 students.",
    company: { id: "c1", name: "Acme EdTech", verified: true },
    location: "remote",
    duration: "2 Weeks",
    payKind: "hourly",
    pay: { amountMinor: 4500_00, currency: "NPR" },
    tags: ["Remote", "2 Weeks"],
    postedAt: new Date().toISOString(),
    status: "active",
    isPremium: true,
  },
  {
    id: "g2",
    title: "Advanced Calculus Tutor",
    category: "TUTORING",
    description:
      "Tutoring for high-school senior preparing for AP exams. 3 hours per week at the City Library.",
    company: { id: "c2", name: "City Library", verified: false },
    location: "onsite",
    duration: "Ongoing",
    payKind: "hourly",
    pay: { amountMinor: 3500_00, currency: "NPR" },
    tags: ["On-site", "Weekly"],
    postedAt: new Date().toISOString(),
    status: "active",
    isPremium: false,
  },
];

export const mockRecentGigs: Gig[] = [
  {
    id: "g3",
    title: "Event Photographer",
    category: "PHOTOGRAPHY",
    description: "Looking for a student photographer to cover a 4-hour campus event.",
    company: { id: "c3", name: "Acme Events", verified: true },
    location: "onsite",
    duration: "4 Hours",
    payKind: "hourly",
    pay: { amountMinor: 2500_00, currency: "NPR" },
    tags: ["4 Hours", "On-site"],
    postedAt: new Date().toISOString(),
    status: "active",
    isPremium: false,
  },
  {
    id: "g4",
    title: "Catalog Data Entry",
    category: "DATA ENTRY",
    description: "Updating product descriptions for a local retail e-commerce store.",
    company: { id: "c4", name: "Urban Goods", verified: false },
    location: "remote",
    duration: "3 Days",
    payKind: "hourly",
    pay: { amountMinor: 1800_00, currency: "NPR" },
    tags: ["3 Days", "Remote"],
    postedAt: new Date().toISOString(),
    status: "active",
    isPremium: false,
  },
  {
    id: "g5",
    title: "Social Media Reels Editor",
    category: "VIDEO EDITING",
    description: "Edit 5 vertical videos for TikTok and Instagram. Raw footage provided.",
    company: { id: "c5", name: "Creator Studio", verified: true },
    location: "remote",
    duration: "Project-based",
    payKind: "fixed",
    pay: { amountMinor: 20000_00, currency: "NPR" },
    tags: ["Project-based", "Remote"],
    postedAt: new Date().toISOString(),
    status: "active",
    isPremium: false,
  },
];

export const mockStudentKpis: StudentDashboardKpis = {
  totalEarnings: { amountMinor: 124_000_00, currency: "NPR" },
  activeGigs: 3,
  applications: 12,
  averageRating: 4.9,
};

export const mockActiveGigs: ActiveGigSummary[] = [
  {
    id: "ag1",
    title: "Frontend UI Bug Fixes",
    company: "Acme Tech Solutions",
    status: "active",
    statusLabel: "In Progress",
    milestone: "Next Milestone: Unit Testing (Oct 29)",
    amount: { amountMinor: 45_000_00, currency: "NPR" },
  },
  {
    id: "ag2",
    title: "Brand Identity Design",
    company: "Nova Creative",
    status: "submitted",
    statusLabel: "Submitted",
    milestone: "Status: Under Review",
    amount: { amountMinor: 30_000_00, currency: "NPR" },
  },
];

export const mockUpcoming: UpcomingEvent[] = [
  {
    id: "ev1",
    title: "Interview: Acme Events",
    occursAt: "2024-10-28T10:30:00+05:45",
    subtitle: "10:30 AM · Video Call",
  },
  {
    id: "ev2",
    title: "Deadline: Logo Drafts",
    occursAt: "2024-10-30T17:00:00+05:45",
    subtitle: "5:00 PM · Submission Port",
  },
];

export const mockCourse: CourseProgress = {
  id: "course-meta-fe",
  title: "Meta Front-End Developer",
  progress: 68,
};

export const mockRecruiterKpis: RecruiterDashboardKpis = {
  activeGigs: 14,
  activeGigsDelta: "+2 this week",
  newApplicants: 42,
  newApplicantsDelta: "+18%",
  pendingInterviews: 8,
  pendingInterviewsNext: "Next: 2 PM",
  totalHired: 128,
};

export const mockRecruiterPipeline: GigPipelineRow[] = [
  {
    id: "rg1",
    title: "UI/UX Design Intern",
    subtitle: "Product Team · Remote",
    postedAt: "2023-10-12T00:00:00Z",
    applicantCount: 24,
    applicantFillPct: 80,
    status: "active",
  },
  {
    id: "rg2",
    title: "Junior Web Developer",
    subtitle: "Engineering · Hybrid",
    postedAt: "2023-10-15T00:00:00Z",
    applicantCount: 12,
    applicantFillPct: 45,
    status: "reviewing",
  },
  {
    id: "rg3",
    title: "Social Media Coordinator",
    subtitle: "Marketing · Remote",
    postedAt: "2023-10-18T00:00:00Z",
    applicantCount: 31,
    applicantFillPct: 95,
    status: "active",
  },
  {
    id: "rg4",
    title: "Content Writer (Freelance)",
    subtitle: "Editorial · Remote",
    postedAt: "2023-10-20T00:00:00Z",
    applicantCount: 9,
    applicantFillPct: 30,
    status: "draft",
  },
];

export const mockApplicants: ApplicantPreview[] = [
  {
    id: "ap1",
    fullName: "Aayush Shrestha",
    appliedFor: "Applied for UI/UX Design Intern",
    skills: ["FIGMA", "PROTOTYPING", "PYTHON"],
  },
  { id: "ap2", fullName: "Binod Thapa", appliedFor: "Web Developer Applicant", skills: [] },
  { id: "ap3", fullName: "Isha Giri", appliedFor: "Social Media Coordinator", skills: [] },
  { id: "ap4", fullName: "Rohan Adhikari", appliedFor: "Content Writer Applicant", skills: [] },
];
