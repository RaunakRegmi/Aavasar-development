import { useTranslation } from "react-i18next";
import { Avatar, Card } from "@shared/ui";
import { Icon } from "@shared/icons";

// Note: testimonials are real personal quotes — names + quotes are kept in
// English (their original language). Section chrome + the "Verified Student"
// chip are translated.
const items: ReadonlyArray<{ name: string; role: string; quote: string }> = [
  {
    name: "Aarav Shrestha",
    role: "Design Student @ KU",
    quote:
      "Aavasar helped me land my first UI internship while still in university. The portfolio I built through small gigs was exactly what recruiters were looking for.",
  },
  {
    name: "Sneha Adhikari",
    role: "CS Major @ Tribhuvan University",
    quote:
      "I paid for my final semester purely through Python tutoring gigs I found here. The platform is so easy to use and the payments are always on time.",
  },
  {
    name: "Bibek Tamang",
    role: "Marketing Junior @ Pokhara University",
    quote:
      "Managing social media for local startups via Aavasar gave me real-world experience that no classroom could provide. It's been a game changer.",
  },
];

export function SuccessStories() {
  const { t } = useTranslation();
  return (
    <section
      style={{
        background: "var(--surface-1)",
        padding: "56px 0",
        borderTop: "1px solid var(--border-default)",
        borderBottom: "1px solid var(--border-default)",
      }}
    >
      <div className="container-page">
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 28,
              color: "var(--text-strong)",
              margin: "0 0 8px",
            }}
          >
            {t("landing.successStories.title")}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-text)",
              fontSize: 15,
              color: "var(--text-muted)",
              margin: 0,
            }}
          >
            {t("landing.successStories.subtitle")}
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {items.map((it) => (
            <Card
              key={it.name}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar name={it.name} size={44} />
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-text)",
                      fontWeight: 700,
                      fontSize: 15,
                      color: "var(--text-strong)",
                    }}
                  >
                    {it.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-text)",
                      fontSize: 13,
                      color: "var(--text-subtle)",
                    }}
                  >
                    {it.role}
                  </div>
                </div>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-text)",
                  fontSize: 14,
                  lineHeight: 1.6,
                  fontStyle: "italic",
                  color: "var(--text-body)",
                  margin: 0,
                }}
              >
                &ldquo;{it.quote}&rdquo;
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: "var(--success-600)",
                  fontFamily: "var(--font-text)",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                <Icon name="BadgeCheck" size={16} /> {t("common.verifiedStudent")}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
