/**
 * Centralized route table. Every <Link>, <Navigate>, and useNavigate
 * call should reference these constants instead of hard-coding paths.
 * Renaming a route then becomes a one-line edit.
 *
 * Routes flagged with "TODO STUB" are mounted at <ComingSoonPage> until
 * their real implementation lands — they are NOT dead links, they show
 * a calm placeholder consistent with the brand voice.
 */
export const routes = {
  // ---- Marketing (public) ----
  home: "/",
  gigs: "/gigs",                          // Public gig listing
  gig: "/gigs/:id",                       // Public gig detail               TODO STUB
  howItWorks: "/how-it-works",               //                       NOW LIVE
  about: "/about",
  contact: "/contact",
  pricing: "/pricing",                    //                                 NOW LIVE
  forBusinesses: "/for-businesses",       //                                 TODO STUB
  forStudents: "/for-students",           //                                 TODO STUB
  successStories: "/success-stories",     //                                 TODO STUB
  help: "/help",                          //                                 TODO STUB
  safety: "/safety",                      //                                 TODO STUB
  terms: "/terms",                        //                                 TODO STUB
  privacy: "/privacy",                    //                                 TODO STUB
  cookies: "/cookies",                    //                                 TODO STUB
  careers: "/careers",                    //                                 TODO STUB
  press: "/press",                        //                                 TODO STUB

  // ---- Auth ----
  signUp: "/sign-up",
  logIn: "/log-in",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  authCallback: "/auth/callback",

  // ---- Onboarding ----
  onboarding: "/onboarding",

  // ---- Student app ----
  studentRoot: "/student",
  studentDashboard: "/student/dashboard",
  studentFindWork: "/student/find-work",
  studentGigDetail: "/student/gigs/:id",
  studentMyGigs: "/student/my-gigs",
  studentMessages: "/student/messages",
  studentMessageThread: "/student/messages/:conversationId",
  studentLearning: "/student/learning",
  studentProfile: "/student/profile",                //                       TODO STUB
  studentProfileEdit: "/student/profile/edit",       //                       TODO STUB
  studentNotifications: "/student/notifications",    //                       TODO STUB
  studentPeerNetwork: "/student/peer-network",       //                       TODO STUB
  studentSupport: "/student/support",                //                       TODO STUB

  // ---- Recruiter app ----
  recruiterRoot: "/recruiter",
  recruiterDashboard: "/recruiter/dashboard",
  recruiterCompanyRegistration: "/recruiter/company/register",
  recruiterBrowseTalent: "/recruiter/browse-talent",
  recruiterTalentDetail: "/recruiter/talent/:id",
  recruiterApplicants: "/recruiter/applicants",
  recruiterPostGig: "/recruiter/post-gig",
  recruiterMessages: "/recruiter/messages",
  recruiterMessageThread: "/recruiter/messages/:conversationId",
  recruiterSettings: "/recruiter/settings",
  recruiterMyGigs: "/recruiter/my-gigs",
  recruiterResources: "/recruiter/resources",         //                      TODO STUB
  recruiterNotifications: "/recruiter/notifications", //                      TODO STUB
  recruiterReports: "/recruiter/reports",             //                      TODO STUB
  recruiterUpgrade: "/recruiter/upgrade",             //                      TODO STUB
  recruiterBilling: "/recruiter/billing",             //                       NOW LIVE
  recruiterBillingSuccess: "/recruiter/billing/success",
  recruiterBillingCancel: "/recruiter/billing/cancel",

  // ---- Student perks (gamification) ----
  studentPerks: "/student/perks",                     //                       NOW LIVE
} as const;

export type RoutePath = (typeof routes)[keyof typeof routes];

/** Helper for building a public gig detail path. */
export function gigPath(id: string): string {
  return `/gigs/${encodeURIComponent(id)}`;
}

/** Helper for building a student gig detail path (authenticated). */
export function studentGigPath(id: string): string {
  return `/student/gigs/${encodeURIComponent(id)}`;
}

/** Helper for building an applicant detail path. */
export function applicantPath(id: string): string {
  return `/recruiter/applicants/${encodeURIComponent(id)}`;
}

/** Helper for building a recruiter-facing talent (student) detail path. */
export function talentPath(id: string): string {
  return `/recruiter/talent/${encodeURIComponent(id)}`;
}

/** Helpers for opening a specific conversation thread. */
export function recruiterConversationPath(conversationId: string): string {
  return `/recruiter/messages/${encodeURIComponent(conversationId)}`;
}
export function studentConversationPath(conversationId: string): string {
  return `/student/messages/${encodeURIComponent(conversationId)}`;
}
