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

  /* ----- Onboarding -----
   * The per-step writes are local-only (see features/onboarding/
   * application/onboarding.usecase.ts). Finalize goes through
   * PATCH /auth/me, handled above.
   */
];
