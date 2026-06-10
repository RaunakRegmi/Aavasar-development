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
  howItWorks: "/how-it-works",
  about: "/about",
  contact: "/contact",
  pricing: "/pricing",                    //                                 TODO STUB
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

  // ---- Onboarding ----
  onboarding: "/onboarding",

  // ---- Student app ----
  studentRoot: "/student",
  studentDashboard: "/student/dashboard",
  studentFindWork: "/student/find-work",
  studentMyGigs: "/student/my-gigs",
  studentMessages: "/student/messages",
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
  recruiterApplicants: "/recruiter/applicants",
  recruiterPostGig: "/recruiter/post-gig",
  recruiterMessages: "/recruiter/messages",
  recruiterSettings: "/recruiter/settings",
  recruiterMyGigs: "/recruiter/my-gigs",
  recruiterResources: "/recruiter/resources",         //                      TODO STUB
  recruiterNotifications: "/recruiter/notifications", //                      TODO STUB
  recruiterReports: "/recruiter/reports",             //                      TODO STUB
  recruiterUpgrade: "/recruiter/upgrade",             //                      TODO STUB
} as const;

export type RoutePath = (typeof routes)[keyof typeof routes];

/** Helper for building a gig detail path. */
export function gigPath(id: string): string {
  return `/gigs/${encodeURIComponent(id)}`;
}

/** Helper for building an applicant detail path. */
export function applicantPath(id: string): string {
  return `/recruiter/applicants/${encodeURIComponent(id)}`;
}
