import { useTranslation } from "react-i18next";
import { Icon, type IconName } from "@shared/icons";

interface Column {
  icon: IconName;
  heading: string;
  steps: ReadonlyArray<[string, string]>;
}

export function HowItWorks() {
  const { t } = useTranslation();
  const cols: ReadonlyArray<Column> = [
    {
      icon: "GraduationCap",
      heading: t("landing.howItWorks.forStudents"),
      steps: [
        [t("landing.howItWorks.students.step1Title"), t("landing.howItWorks.students.step1Body")],
        [t("landing.howItWorks.students.step2Title"), t("landing.howItWorks.students.step2Body")],
        [t("landing.howItWorks.students.step3Title"), t("landing.howItWorks.students.step3Body")],
      ],
    },
    {
      icon: "Building2",
      heading: t("landing.howItWorks.forBusinesses"),
      steps: [
        [t("landing.howItWorks.businesses.step1Title"), t("landing.howItWorks.businesses.step1Body")],
        [t("landing.howItWorks.businesses.step2Title"), t("landing.howItWorks.businesses.step2Body")],
        [t("landing.howItWorks.businesses.step3Title"), t("landing.howItWorks.businesses.step3Body")],
      ],
    },
  ];

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
          {t("landing.howItWorks.title")}
        </h2>
        <p
          style={{
            fontFamily: "var(--font-text)",
            fontSize: 16,
            color: "var(--text-muted)",
            margin: 0,
          }}
        >
          {t("landing.howItWorks.subtitle")}
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
