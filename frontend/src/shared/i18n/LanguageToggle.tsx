/**
 * Compact EN / नेपाली pill. Mounted in every primary header so the user
 * can switch UI language from anywhere in the app. Persists via
 * `setLanguage()` (localStorage).
 */
import { useTranslation } from "react-i18next";
import { Icon } from "@shared/icons";
import { currentLanguage, setLanguage, type SupportedLang } from "./";

interface LanguageToggleProps {
  /** Render against a dark surface (footer/CTA bands). */
  onDark?: boolean;
  /** "compact" (default) shows only EN/नेपाली pill; "wide" prepends a globe + label. */
  size?: "compact" | "wide";
}

export function LanguageToggle({ onDark = false, size = "compact" }: LanguageToggleProps) {
  const { t, i18n } = useTranslation();
  // Re-render on language change is wired by react-i18next.
  const lang = (i18n.language?.split("-")[0] ?? currentLanguage()) as SupportedLang;

  const fg = onDark ? "#fff" : "var(--text-muted)";
  const fgActive = onDark ? "#fff" : "var(--brand-700)";
  const bgActive = onDark ? "rgba(255,255,255,0.18)" : "var(--brand-50)";
  const border = onDark ? "rgba(255,255,255,0.32)" : "var(--border-default)";

  function pick(next: SupportedLang) {
    if (next === lang) return;
    setLanguage(next);
  }

  return (
    <div
      role="group"
      aria-label={t("common.language")}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: 2,
        borderRadius: "var(--radius-full)",
        border: `1px solid ${border}`,
        background: onDark ? "rgba(255,255,255,0.05)" : "var(--surface-0)",
        fontFamily: "var(--font-text)",
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      {size === "wide" && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "0 8px",
            color: fg,
            gap: 4,
          }}
        >
          <Icon name="Globe" size={14} />
        </span>
      )}
      <Pill active={lang === "en"} fg={lang === "en" ? fgActive : fg} bg={lang === "en" ? bgActive : "transparent"} onClick={() => pick("en")}>
        EN
      </Pill>
      <Pill active={lang === "ne"} fg={lang === "ne" ? fgActive : fg} bg={lang === "ne" ? bgActive : "transparent"} onClick={() => pick("ne")}>
        नेपाली
      </Pill>
    </div>
  );
}

function Pill({
  active,
  fg,
  bg,
  onClick,
  children,
}: {
  active: boolean;
  fg: string;
  bg: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      style={{
        appearance: "none",
        border: "none",
        cursor: "pointer",
        padding: "5px 12px",
        borderRadius: "var(--radius-full)",
        background: bg,
        color: fg,
        fontFamily: "inherit",
        fontSize: "inherit",
        fontWeight: 600,
        lineHeight: 1,
      }}
    >
      {children}
    </button>
  );
}
