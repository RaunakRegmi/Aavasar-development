import { Icon, type IconName } from "@shared/icons";

interface Column {
  icon: IconName;
  heading: string;
  steps: ReadonlyArray<[string, string]>;
}

const cols: ReadonlyArray<Column> = [
  {
    icon: "GraduationCap",
    heading: "For Students",
    steps: [
      ["Create Your Profile", "Highlight your skills, portfolio, and education to stand out to employers."],
      ["Find Relevant Gigs", "Browse thousands of student-specific tasks and apply with one click."],
      ["Get Paid Securely", "Complete your tasks and receive payments directly to your account. No hidden fees."],
    ],
  },
  {
    icon: "Building2",
    heading: "For Businesses",
    steps: [
      ["Post a Task", "Define your project, set your budget, and post in minutes to reach top student talent."],
      ["Review Top Talent", "Filter through vetted applications and choose the best fit for your needs."],
      ["Scale Your Team", "Get quality work done efficiently while helping students build their portfolios."],
    ],
  },
];

export function HowItWorks() {
  return (
    <section className="container-page" style={{ paddingBottom: 64 }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 34,
            letterSpacing: "-0.02em",
            color: "var(--text-strong)",
            margin: "0 0 10px",
          }}
        >
          Seamless Experience for Everyone
        </h2>
        <p
          style={{
            fontFamily: "var(--font-text)",
            fontSize: 16,
            color: "var(--text-muted)",
            margin: 0,
          }}
        >
          Whether you&apos;re looking to earn or looking to hire, Aavasar makes it
          simple, fast, and secure.
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 64,
          maxWidth: 920,
          margin: "0 auto",
        }}
      >
        {cols.map((col) => (
          <div key={col.heading}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "var(--radius-sm)",
                  background: "var(--brand-700)",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name={col.icon} />
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 22,
                  color: "var(--text-strong)",
                }}
              >
                {col.heading}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {col.steps.map(([h, b], i) => (
                <div key={h} style={{ display: "flex", gap: 16 }}>
                  <span
                    style={{
                      flexShrink: 0,
                      width: 28,
                      height: 28,
                      borderRadius: "var(--radius-full)",
                      background: "var(--surface-2)",
                      color: "var(--brand-700)",
                      fontWeight: 700,
                      fontSize: 13,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-text)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-text)",
                        fontWeight: 700,
                        fontSize: 16,
                        color: "var(--text-strong)",
                        marginBottom: 4,
                      }}
                    >
                      {h}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-text)",
                        fontSize: 14,
                        lineHeight: 1.5,
                        color: "var(--text-muted)",
                      }}
                    >
                      {b}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
