import { useNavigate } from "react-router-dom";
import { Hero } from "./sections/Hero";
import { StatsStrip } from "./sections/StatsStrip";
import { HowItWorks } from "./sections/HowItWorks";
import { FeaturedGigs } from "./sections/FeaturedGigs";
import { SuccessStories } from "./sections/SuccessStories";
import { RecentGigs } from "./sections/RecentGigs";
import { CtaBand } from "./sections/CtaBand";
import { routes } from "@shared/config/routes";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <main>
      <Hero
        onPrimary={() => navigate(routes.gigs)}
        onSecondary={() => navigate(routes.howItWorks)}
      />
      <StatsStrip />
      <HowItWorks />
      <FeaturedGigs
        onApplyUnauth={() => navigate(routes.signUp)}
        onViewAll={() => navigate(routes.gigs)}
      />
      <SuccessStories />
      <RecentGigs
        onApplyUnauth={() => navigate(routes.signUp)}
        onSeeMore={() => navigate(routes.gigs)}
      />
      <CtaBand
        onSignUp={() => navigate(routes.signUp)}
        onHire={() => navigate(routes.recruiterPostGig)}
      />
    </main>
  );
}
