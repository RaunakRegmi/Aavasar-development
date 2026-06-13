import { useNavigate } from "react-router-dom";
import { Button } from "@shared/ui";
import { routes } from "@shared/config/routes";
import { useCurrentUser } from "@features/auth";
import { PLAN_CARDS, COMPARISON_ROWS, ADD_ONS, type PlanTier } from "@features/billing";

const SALES_EMAIL = "sales@aavasar.np";

export default function PricingPage() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const isRecruiter = user?.role === "recruiter";

  function handleCta(tier: PlanTier) {
    if (tier === "enterprise") {
      window.location.assign(`mailto:${SALES_EMAIL}?subject=Enterprise%20plan%20enquiry`);
      return;
    }
    if (tier === "professional" && isRecruiter) {
      navigate(routes.recruiterBilling);
      return;
    }
    // Guests (and students viewing the page) start by creating an account.
    navigate(isRecruiter ? routes.recruiterBilling : routes.signUp);
  }

  return (
    <main className="container-page" style={{ paddingTop: 64, paddingBottom: 72 }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 style={h1Style}>Plans that scale with your hiring</h1>
        <p style={leadStyle}>
          Start free, upgrade when you're ready. Pricing for recruiters and businesses — students
          always join free.
        </p>
      </div>

      {/* Plan cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 24,
          maxWidth: 1040,
          margin: "0 auto",
          alignItems: "stretch",
        }}
      >
        {PLAN_CARDS.map((plan) => (
          <div
            key={plan.tier}
            style={{
              borderRadius: "var(--radius-xl)",
              border: `1px solid ${plan.popular ? "var(--brand-700)" : "var(--border-default)"}`,
              background: plan.popular ? "var(--surface-2)" : "var(--surface-0)",
              padding: 32,
              display: "flex",
              flexDirection: "column",
              position: "relative",
              boxShadow: plan.popular ? "var(--shadow-md)" : "var(--shadow-xs)",
            }}
          >
            {plan.popular && (
              <span style={popularBadgeStyle}>Most Popular</span>
            )}
            <h2 style={planNameStyle}>{plan.name}</h2>
            <div style={{ marginBottom: 8 }}>
              <span style={priceStyle}>{plan.price}</span>
              {plan.period && <span style={periodStyle}>{plan.period}</span>}
            </div>
            <p style={taglineStyle}>{plan.tagline}</p>
            <div style={{ flex: 1 }} />
            <div style={{ marginTop: 24 }}>
              <Button
                variant={plan.popular ? "primary" : "outline"}
                size="lg"
                full
                onClick={() => handleCta(plan.tier)}
              >
                {plan.cta}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <section style={{ maxWidth: 1040, margin: "56px auto 0" }}>
        <h2 style={{ ...h1Style, fontSize: "clamp(20px, 4vw, 26px)", marginBottom: 24 }}>
          Compare features
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={{ ...thStyle, textAlign: "left" }}>Feature</th>
                <th style={thStyle}>Basic</th>
                <th style={{ ...thStyle, color: "var(--brand-700)" }}>Professional</th>
                <th style={thStyle}>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, i) => (
                <tr key={row.label} style={{ background: i % 2 ? "var(--surface-1)" : "transparent" }}>
                  <td style={{ ...tdStyle, textAlign: "left", fontWeight: 600, color: "var(--text-strong)" }}>
                    {row.label}
                  </td>
                  <td style={tdStyle}>{renderCell(row.basic)}</td>
                  <td style={tdStyle}>{renderCell(row.professional)}</td>
                  <td style={tdStyle}>{renderCell(row.enterprise)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add-ons */}
      <section style={{ maxWidth: 1040, margin: "56px auto 0" }}>
        <h2 style={{ ...h1Style, fontSize: "clamp(20px, 4vw, 26px)", marginBottom: 8 }}>Add-ons</h2>
        <p style={{ ...leadStyle, marginBottom: 24 }}>
          Need a little more? Top up capacity without switching plans.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {ADD_ONS.map((addon) => (
            <div
              key={addon.target}
              style={{
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-lg)",
                background: "var(--surface-0)",
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                <strong style={{ color: "var(--text-strong)", fontSize: 16 }}>{addon.name}</strong>
                <span style={{ color: "var(--brand-700)", fontWeight: 700, fontSize: 16 }}>
                  {addon.price}
                </span>
              </div>
              <p style={{ ...taglineStyle, margin: 0 }}>{addon.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function renderCell(value: string | boolean) {
  if (value === true) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand-600)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-label="Included">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
  if (value === false) {
    return <span style={{ color: "var(--text-muted)" }} aria-label="Not included">—</span>;
  }
  return <span style={{ color: "var(--text-strong)" }}>{value}</span>;
}

const h1Style = {
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  fontSize: "clamp(26px, 5vw, 38px)",
  letterSpacing: "-0.02em",
  color: "var(--text-strong)",
  margin: "0 0 12px",
} as const;

const leadStyle = {
  fontFamily: "var(--font-text)",
  fontSize: 16,
  color: "var(--text-muted)",
  maxWidth: 560,
  margin: "0 auto",
} as const;

const popularBadgeStyle = {
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
  whiteSpace: "nowrap",
} as const;

const planNameStyle = {
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  fontSize: 20,
  color: "var(--text-strong)",
  margin: "0 0 4px",
} as const;

const priceStyle = {
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  fontSize: 36,
  color: "var(--text-strong)",
} as const;

const periodStyle = {
  fontFamily: "var(--font-text)",
  fontSize: 15,
  color: "var(--text-muted)",
  marginLeft: 4,
} as const;

const taglineStyle = {
  fontFamily: "var(--font-text)",
  fontSize: 14,
  lineHeight: 1.5,
  color: "var(--text-muted)",
  margin: "0 0 8px",
} as const;

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontFamily: "var(--font-text)",
  fontSize: 14,
  minWidth: 560,
} as const;

const thStyle = {
  padding: "14px 16px",
  textAlign: "center",
  fontWeight: 700,
  color: "var(--text-strong)",
  borderBottom: "2px solid var(--border-default)",
  fontFamily: "var(--font-display)",
} as const;

const tdStyle = {
  padding: "14px 16px",
  textAlign: "center",
  color: "var(--text-body)",
  borderBottom: "1px solid var(--border-subtle)",
} as const;
