import { useNavigate } from "react-router-dom";
import { HowItWorks } from "./sections/HowItWorks";
import { CtaBand } from "./sections/CtaBand";
import { routes } from "@shared/config/routes";

export default function HowItWorksPage() {
  const navigate = useNavigate();
  return (
    <main>
      <div className="container-page" style={{ paddingTop: 64 }}>
        <HowItWorks />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 32,
            maxWidth: 920,
            margin: "0 auto 56px",
          }}
        >
          <FeatureCard
            title="Safe & Secure"
            description="All profiles are verified. Payments are escrow-protected until work is delivered."
          />
          <FeatureCard
            title="Flexible Hours"
            description="Work around your class schedule. Set your own availability and commit to what fits."
          />
          <FeatureCard
            title="Build Your Portfolio"
            description="Every gig completed adds to your professional portfolio with real client feedback."
          />
        </div>
      </div>
      <CtaBand
        onSignUp={() => navigate(routes.signUp)}
        onHire={() => navigate(routes.recruiterPostGig)}
      />
    </main>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
}

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "32px 24px",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-default)",
      }}
    >
      <span
        style={{
          width: 48,
          height: 48,
          borderRadius: "var(--radius-md)",
          background: "var(--brand-50)",
          color: "var(--brand-700)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </span>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 18,
          color: "var(--text-strong)",
          margin: "0 0 8px",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "var(--font-text)",
          fontSize: 14,
          lineHeight: 1.55,
          color: "var(--text-muted)",
          margin: 0,
        }}
      >
        {description}
      </p>
    </div>
  );
}
