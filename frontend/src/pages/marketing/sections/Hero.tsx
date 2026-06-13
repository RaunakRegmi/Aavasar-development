import { useTranslation } from "react-i18next";
import { Button } from "@shared/ui";

interface HeroProps {
  onPrimary: () => void;
  onSecondary: () => void;
}

export function Hero({ onPrimary, onSecondary }: HeroProps) {
  const { t } = useTranslation();
  return (
    <section
      className="container-page"
      style={{ paddingTop: 56, paddingBottom: 24 }}
    >
      <div
        style={{
          position: "relative",
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
          minHeight: 340,
          display: "flex",
          alignItems: "center",
          background: "var(--brand-900)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url(/photos/hero-a.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(18,28,36,0.95) 0%, rgba(18,28,36,0.85) 48%, rgba(18,28,36,0.5) 78%, rgba(18,28,36,0.28) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            padding: "48px 56px",
            maxWidth: 620,
          }}
        >
          <span
            style={{
              display: "inline-block",
              fontFamily: "var(--font-text)",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--brand-200)",
              background: "rgba(255,255,255,0.12)",
              padding: "6px 12px",
              borderRadius: "var(--radius-full)",
              marginBottom: 20,
            }}
          >
            {t("landing.hero.badge")}
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 44,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#fff",
              margin: "0 0 16px",
            }}
          >
            {t("landing.hero.title")}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-text)",
              fontSize: 17,
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.85)",
              margin: "0 0 28px",
              maxWidth: 480,
            }}
          >
            {t("landing.hero.subtitle")}
          </p>
          <div style={{ display: "flex", gap: 14 }}>
            <Button onDark variant="primary" size="lg" onClick={onPrimary}>
              {t("common.exploreGigs")}
            </Button>
            <Button onDark variant="outline" size="lg" onClick={onSecondary}>
              {t("nav.howItWorks")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
