import React from "react";

/**
 * Tag / skill chip — square-ish, neutral or slate-tinted. Used for skills
 * (FIGMA, PYTHON, REACT) and gig meta (Remote, 2 Weeks, On-site).
 */
export function Tag({ children, variant = "neutral", style = {} }) {
  const looks = {
    neutral: { bg: "var(--surface-2)", fg: "var(--ink-700)", border: "transparent" },
    outline: { bg: "transparent", fg: "var(--ink-700)", border: "var(--border-default)" },
    brand:   { bg: "var(--brand-50)", fg: "var(--brand-700)", border: "transparent" },
    onDark:  { bg: "rgba(255,255,255,0.14)", fg: "#fff", border: "transparent" },
  };
  const l = looks[variant] || looks.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily: "var(--font-text)",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.02em",
        padding: "5px 10px",
        borderRadius: "var(--radius-xs)",
        background: l.bg,
        color: l.fg,
        border: `1px solid ${l.border}`,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
