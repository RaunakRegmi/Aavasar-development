import { useNavigate } from "react-router-dom";
import { Button } from "@shared/ui";
import { routes } from "@shared/config/routes";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Get started with basic access to the platform.",
    features: [
      "Browse & apply to gigs",
      "Basic profile",
      "Email notifications",
      "Community access",
    ],
    cta: "Get Started",
    ctaVariant: "outline" as const,
    popular: false,
  },
  {
    name: "Student Pro",
    price: "$9",
    period: "/month",
    description: "Stand out and land more gigs with premium tools.",
    features: [
      "All Free features",
      "Profile boost in search",
      "Priority applications",
      "Skills assessments",
      "Portfolio builder",
    ],
    cta: "Start Free Trial",
    ctaVariant: "primary" as const,
    popular: true,
  },
  {
    name: "Business",
    price: "$49",
    period: "/month",
    description: "Hire top student talent with advanced recruiting tools.",
    features: [
      "Unlimited gig postings",
      "AI-matched candidates",
      "Advanced filters & search",
      "Team accounts (3 seats)",
      "Priority support",
    ],
    cta: "Contact Sales",
    ctaVariant: "outline" as const,
    popular: false,
  },
];

export default function PricingPage() {
  const navigate = useNavigate();
  return (
    <main className="container-page" style={{ paddingTop: 64, paddingBottom: 72 }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 38,
            letterSpacing: "-0.02em",
            color: "var(--text-strong)",
            margin: "0 0 12px",
          }}
        >
          Simple, Transparent Pricing
        </h1>
        <p
          style={{
            fontFamily: "var(--font-text)",
            fontSize: 16,
            color: "var(--text-muted)",
            maxWidth: 540,
            margin: "0 auto",
          }}
        >
          Start free and upgrade as you grow. No hidden fees, no surprise charges.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        {plans.map((plan) => (
          <div
            key={plan.name}
            style={{
              borderRadius: "var(--radius-xl)",
              border: `1px solid ${plan.popular ? "var(--brand-700)" : "var(--border-default)"}`,
              background: plan.popular ? "var(--surface-2)" : "var(--surface)",
              padding: 32,
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {plan.popular && (
              <span
                style={{
                  position: "absolute",
                  top: -12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "var(--brand-700)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "4px 16px",
                  borderRadius: "var(--radius-full)",
                  fontFamily: "var(--font-text)",
                }}
              >
                Most Popular
              </span>
            )}
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 20,
                color: "var(--text-strong)",
                margin: "0 0 4px",
              }}
            >
              {plan.name}
            </h2>
            <div style={{ marginBottom: 8 }}>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 36,
                  color: "var(--text-strong)",
                }}
              >
                {plan.price}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-text)",
                  fontSize: 15,
                  color: "var(--text-muted)",
                }}
              >
                {plan.period}
              </span>
            </div>
            <p
              style={{
                fontFamily: "var(--font-text)",
                fontSize: 14,
                lineHeight: 1.5,
                color: "var(--text-muted)",
                margin: "0 0 24px",
              }}
            >
              {plan.description}
            </p>
            <div style={{ flex: 1 }}>
              {plan.features.map((f) => (
                <div
                  key={f}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "6px 0",
                    fontFamily: "var(--font-text)",
                    fontSize: 14,
                    color: "var(--text-strong)",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--brand-600)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {f}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 28 }}>
              <Button
                variant={plan.ctaVariant}
                size="lg"
                full
                onClick={() => navigate(routes.signUp)}
              >
                {plan.cta}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
