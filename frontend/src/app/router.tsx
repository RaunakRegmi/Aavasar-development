import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { routes } from "@shared/config/routes";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { MarketingLayout } from "@shared/layouts/MarketingLayout";
import { StudentLayout } from "@shared/layouts/StudentLayout";
import { RecruiterLayout } from "@shared/layouts/RecruiterLayout";
import { PageLoader } from "@shared/ui/PageLoader";

const LandingPage = lazy(() => import("@pages/marketing/LandingPage"));
const SignUpPage = lazy(() => import("@pages/marketing/SignUpPage"));
const LoginPage = lazy(() => import("@pages/marketing/LoginPage"));
const ForgotPasswordPage = lazy(() => import("@pages/marketing/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@pages/marketing/ResetPasswordPage"));
const HowItWorksPage = lazy(() => import("@pages/marketing/HowItWorksPage"));
const PricingPage = lazy(() => import("@pages/marketing/PricingPage"));
const OnboardingPage = lazy(() => import("@pages/onboarding/OnboardingPage"));
const StudentDashboardPage = lazy(() => import("@pages/student/StudentDashboardPage"));
const StudentFindWorkPage = lazy(() => import("@pages/student/StudentFindWorkPage"));
const StudentGigDetailPage = lazy(() => import("@pages/student/StudentGigDetailPage"));
const RecruiterDashboardPage = lazy(() => import("@pages/recruiter/RecruiterDashboardPage"));
const BrowseTalentPage = lazy(() => import("@pages/recruiter/BrowseTalentPage"));
const StudentProfilePage = lazy(() => import("@features/profile/pages/StudentProfilePage"));
const RecruiterProfilePage = lazy(() => import("@features/profile/pages/RecruiterProfilePage"));
const CompanyRegistrationPage = lazy(() => import("@features/recruiter/pages/CompanyRegistrationPage"));
const PostGigPage = lazy(() => import("@features/recruiter/pages/PostGigPage"));
const RecruiterMyGigsPage = lazy(() => import("@features/recruiter/pages/RecruiterMyGigsPage"));
const RecruiterTalentDetailPage = lazy(() => import("@features/recruiter/pages/RecruiterTalentDetailPage"));
const ApplicantDetailPage = lazy(() => import("@pages/recruiter/ApplicantDetailPage"));
const ComingSoonPage = lazy(() => import("@pages/ComingSoonPage"));
const AuthCallbackPage = lazy(() => import("@pages/auth/AuthCallbackPage"));

function withSuspense(node: ReactNode) {
  return <Suspense fallback={<PageLoader />}>{node}</Suspense>;
}

/**
 * Mount the reusable <ComingSoonPage> at a route with a contextual title.
 * Used wherever a destination route exists in `routes.ts` but the real
 * page implementation hasn't shipped yet. Keeps navigation alive.
 */
function stub(title: string, subtitle?: string) {
  return withSuspense(<ComingSoonPage title={title} subtitle={subtitle} />);
}

const router = createBrowserRouter([
  /* ---------------- Marketing (public) ---------------- */
  {
    element: <MarketingLayout />,
    children: [
      { path: routes.home, element: withSuspense(<LandingPage />) },
      { path: routes.signUp, element: withSuspense(<SignUpPage />) },
      { path: routes.logIn, element: withSuspense(<LoginPage />) },
      { path: routes.forgotPassword, element: withSuspense(<ForgotPasswordPage />) },
      { path: routes.resetPassword, element: withSuspense(<ResetPasswordPage />) },

      // Public destinations — stubbed until each marketing page ships.
      { path: routes.gigs, element: stub("Browse Gigs", "Our public gig listing is opening soon. In the meantime, sign up to see live opportunities tailored to you.") },
      { path: routes.gig, element: stub("Gig Details", "The full gig detail page is on the way.") },
      { path: routes.howItWorks, element: withSuspense(<HowItWorksPage />) },
      { path: routes.about, element: stub("About Aavasar", "Our story page is being written.") },
      { path: routes.contact, element: stub("Contact Us", "A contact form is on the way. For now, reach out at hello@aavasar.np.") },
      { path: routes.pricing, element: withSuspense(<PricingPage />) },
      { path: routes.forBusinesses, element: stub("For Businesses", "Hire vetted student talent — full pitch page coming soon.") },
      { path: routes.forStudents, element: stub("For Students", "Find gigs that fit your schedule — full pitch page coming soon.") },
      { path: routes.successStories, element: stub("Success Stories") },
      { path: routes.help, element: stub("Help Center") },
      { path: routes.safety, element: stub("Safety Center") },
      { path: routes.terms, element: stub("Terms of Service") },
      { path: routes.privacy, element: stub("Privacy Policy") },
      { path: routes.cookies, element: stub("Cookie Settings") },
      { path: routes.careers, element: stub("Careers") },
      { path: routes.press, element: stub("Press & Media") },
    ],
  },

  /* ---------------- Onboarding (post-signup) ---------------- */
  {
    element: <ProtectedRoute />,
    children: [{ path: routes.onboarding, element: withSuspense(<OnboardingPage />) }],
  },

  /* ---------------- Student app ---------------- */
  {
    element: <ProtectedRoute allow={["student"]} />,
    children: [
      {
        element: <StudentLayout />,
        children: [
          { path: routes.studentRoot, element: <Navigate to={routes.studentDashboard} replace /> },
          { path: routes.studentDashboard, element: withSuspense(<StudentDashboardPage />) },
          { path: routes.studentFindWork, element: withSuspense(<StudentFindWorkPage />) },
          { path: routes.studentGigDetail, element: withSuspense(<StudentGigDetailPage />) },
          { path: routes.studentMyGigs, element: stub("My Gigs", "Your active and past gigs will live here.") },
          { path: routes.studentMessages, element: stub("Messages", "Inbox + chat threads coming soon.") },
          { path: routes.studentLearning, element: stub("Learning", "Your course progress and recommended tracks.") },
          { path: routes.studentProfile, element: withSuspense(<StudentProfilePage />) },
          { path: routes.studentProfileEdit, element: withSuspense(<StudentProfilePage />) },
          { path: routes.studentNotifications, element: withSuspense(<StudentProfilePage />) },
          { path: routes.studentPeerNetwork, element: stub("Peer Network", "Connect with 500+ students on campus.") },
          { path: routes.studentSupport, element: stub("Support") },
        ],
      },
    ],
  },

  /* ---------------- Recruiter app ---------------- */
  {
    element: <ProtectedRoute allow={["recruiter"]} />,
    children: [
      {
        element: <RecruiterLayout />,
        children: [
          { path: routes.recruiterRoot, element: <Navigate to={routes.recruiterDashboard} replace /> },
          { path: routes.recruiterDashboard, element: withSuspense(<RecruiterDashboardPage />) },
          { path: routes.recruiterCompanyRegistration, element: withSuspense(<CompanyRegistrationPage />) },
          { path: routes.recruiterBrowseTalent, element: withSuspense(<BrowseTalentPage />) },
          { path: routes.recruiterApplicants, element: stub("Applicants", "Pipeline + filters + applicant detail will live here.") },
          { path: "/recruiter/applicants/:id", element: withSuspense(<ApplicantDetailPage />) },
          { path: routes.recruiterPostGig, element: withSuspense(<PostGigPage />) },
          { path: routes.recruiterMessages, element: stub("Messages") },
          { path: routes.recruiterSettings, element: withSuspense(<RecruiterProfilePage />) },
          { path: routes.recruiterMyGigs, element: withSuspense(<RecruiterMyGigsPage />) },
          { path: routes.recruiterTalentDetail, element: withSuspense(<RecruiterTalentDetailPage />) },
          { path: routes.recruiterResources, element: stub("Resources") },
          { path: routes.recruiterNotifications, element: withSuspense(<RecruiterProfilePage />) },
          { path: routes.recruiterReports, element: stub("Talent Pulse Reports") },
          { path: routes.recruiterUpgrade, element: stub("Upgrade Plan") },
        ],
      },
    ],
  },

  /* ---------------- Standalone (no layout) ---------------- */
  { path: routes.authCallback, element: withSuspense(<AuthCallbackPage />) },

  { path: "*", element: <Navigate to={routes.home} replace /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
