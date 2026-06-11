/**
 * Mock route table. Each entry matches an L4 service call by
 * `method + url pattern` and returns canned data shaped to the
 * L6 contract. When the real backend ships, flip
 * `VITE_USE_MOCKS=false` and these become inert.
 */
import {
  makeRecruiterSession,
  makeStudentSession,
  mockActiveGigs,
  mockApplicants,
  mockCourse,
  mockFeaturedGigs,
  mockRecentGigs,
  mockRecruiterKpis,
  mockRecruiterPipeline,
  mockStudentKpis,
  mockStudentSession,
  mockUpcoming,
} from "./fixtures";

export interface MockHandler {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  match: RegExp;
  resolve: (req: { url: string; data?: unknown }) =>
    | { status: number; data: unknown }
    | Promise<{ status: number; data: unknown }>;
}

const ok = (data: unknown) => ({ status: 200, data: { data } });

export const handlers: MockHandler[] = [
  /* ----- Auth ----- */
  {
    method: "POST",
    match: /\/auth\/sign-up$/,
    resolve: ({ data }) => {
      const role = (data as { role?: string } | undefined)?.role;
      if (role === "recruiter") return ok(makeRecruiterSession());
      // First-time students need onboarding.
      const session = makeStudentSession();
      return ok({
        ...session,
        user: { ...session.user, onboardingCompleted: false },
      });
    },
  },
  {
    method: "POST",
    match: /\/auth\/log-in$/,
    resolve: ({ data }) => {
      const email = (data as { email?: string } | undefined)?.email ?? "";
      return ok(email.includes("company") ? makeRecruiterSession() : makeStudentSession());
    },
  },
  { method: "POST", match: /\/auth\/log-out$/, resolve: () => ok(null) },
  { method: "GET", match: /\/auth\/me$/, resolve: () => ok(mockStudentSession.user) },
  {
    method: "PATCH",
    match: /\/auth\/me$/,
    resolve: ({ data }) =>
      ok({
        ...mockStudentSession.user,
        ...(typeof data === "object" && data !== null ? data : {}),
      }),
  },
  {
    method: "POST",
    match: /\/uploads\/avatar$/,
    resolve: () =>
      ok({
        id: `up_${Math.random().toString(36).slice(2, 10)}`,
        kind: "avatar",
        url: "/photos/peer-network.jpg",
        mimeType: "image/jpeg",
        sizeBytes: 1234,
        originalName: "avatar.jpg",
        createdAt: new Date().toISOString(),
      }),
  },
  {
    method: "POST",
    match: /\/uploads\/portfolio$/,
    resolve: () =>
      ok({
        id: `up_${Math.random().toString(36).slice(2, 10)}`,
        kind: "portfolio",
        url: "https://example.com/sample-portfolio.pdf",
        mimeType: "application/pdf",
        sizeBytes: 234567,
        originalName: "portfolio.pdf",
        createdAt: new Date().toISOString(),
      }),
  },
  {
    method: "POST",
    match: /\/auth\/forgot-password$/,
    // Always 200 — never leak whether the address exists.
    resolve: () => ok(null),
  },
  {
    method: "POST",
    match: /\/auth\/reset-password$/,
    resolve: () => ok(makeStudentSession()),
  },
  {
    method: "POST",
    match: /\/auth\/refresh$/,
    resolve: () => {
      const s = makeStudentSession();
      return ok({
        ...s,
        accessToken: "mock-student-token-rotated",
        refreshToken: "mock-refresh-rotated",
      });
    },
  },

  /* ----- Applications (must come before generic gig routes) ----- */
  {
    method: "POST",
    match: /\/gigs\/apply$/,
    resolve: () => ok({ id: `app_${Date.now()}`, status: "pending", createdAt: new Date().toISOString() }),
  },
  {
    method: "GET",
    match: /\/gigs\/applied(\?.*)?$/,
    resolve: () => ({
      status: 200,
      data: { data: [], meta: { total: 0 } },
    }),
  },

  /* ----- Gigs ----- */
  {
    method: "GET",
    match: /\/gigs\/featured$/,
    resolve: () => ok(mockFeaturedGigs),
  },
  {
    method: "GET",
    match: /\/gigs(\?.*)?$/,
    resolve: () => ({
      status: 200,
      data: { data: mockRecentGigs, meta: { total: mockRecentGigs.length } },
    }),
  },
  {
    method: "GET",
    match: /\/gigs\/[a-zA-Z0-9]+$/,
    resolve: () => ok(mockRecentGigs[0] ?? mockFeaturedGigs[0]),
  },
  {
    method: "GET",
    match: /\/recruiter\/gigs\/pipeline$/,
    resolve: () => ok(mockRecruiterPipeline),
  },

  /* ----- Dashboard ----- */
  { method: "GET", match: /\/student\/dashboard\/kpis$/, resolve: () => ok(mockStudentKpis) },
  { method: "GET", match: /\/student\/dashboard\/active-gigs$/, resolve: () => ok(mockActiveGigs) },
  { method: "GET", match: /\/student\/dashboard\/upcoming$/, resolve: () => ok(mockUpcoming) },
  { method: "GET", match: /\/student\/dashboard\/course$/, resolve: () => ok(mockCourse) },
  { method: "GET", match: /\/recruiter\/dashboard\/kpis$/, resolve: () => ok(mockRecruiterKpis) },
  { method: "GET", match: /\/recruiter\/dashboard\/applicants$/, resolve: () => ok(mockApplicants) },

  /* ----- Me (profile aggregate) ----- */
  {
    method: "GET",
    match: /\/me(\?.*)?$/,
    resolve: () => ok({
      user: {
        ...mockStudentSession.user,
        role: "recruiter",
        headline: "Head of Talent · Aavasar",
        bio: "Connecting student talent with real-world opportunities.",
      },
      company: {
        id: "cmp_1",
        name: "Aavasar Inc.",
        verified: true,
      },
      uploads: { avatar: null, banner: null, portfolio: null, nid: null },
    }),
  },

  /* ----- Notifications ----- */
  {
    method: "GET",
    match: /\/notifications(\?.*)?$/,
    resolve: () => ({
      status: 200,
      data: {
        data: [
          {
            id: "n1",
            kind: "application_created",
            title: "New application received",
            description: "A student applied to \"UX Designer\"",
            link: null,
            readAt: null,
            createdAt: new Date().toISOString(),
          },
          {
            id: "n2",
            kind: "profile_verified",
            title: "Profile verified",
            description: "Your account has been verified successfully.",
            link: null,
            readAt: new Date(Date.now() - 86400000).toISOString(),
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ],
        meta: { total: 2, unread: 1 },
      },
    }),
  },
  {
    method: "POST",
    match: /\/notifications\/mark-all-read$/,
    resolve: () => ({ status: 204, data: null }),
  },

];
