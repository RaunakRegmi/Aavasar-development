import { useTranslation } from "react-i18next";
import { Button } from "@shared/ui";

interface CtaBandProps {
  onSignUp: () => void;
  onHire: () => void;
}

export function CtaBand({ onSignUp, onHire }: CtaBandProps) {
  const { t } = useTranslation();
  return (
    <section className="container-page" style={{ paddingBottom: 72 }}>
      <div
        style={{
          borderRadius: "var(--radius-xl)",
          background: "linear-gradient(135deg, var(--brand-700), var(--brand-900))",
          padding: "56px 48px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 34,
            color: "#fff",
            letterSpacing: "-0.02em",
            margin: "0 0 14px",
          }}
        >
          {t("landing.cta.title")}
        </h2>
        <p
          style={{
            fontFamily: "var(--font-text)",
            fontSize: 16,
            lineHeight: 1.6,
            color: "var(--brand-200)",
            margin: "0 auto 28px",
            maxWidth: 540,
          }}
        >
          {t("landing.cta.subtitle")}
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Button onDark variant="primary" size="lg" onClick={onSignUp}>
            {t("landing.cta.primary")}
          </Button>
          <Button onDark variant="secondary" size="lg" onClick={onHire}>
            {t("landing.cta.secondary")}
          </Button>
        </div>
      </div>
    </section>
  );
}
