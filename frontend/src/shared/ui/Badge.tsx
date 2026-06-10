import type { CSSProperties, ReactNode } from "react";

export type BadgeTone =
  | "active"
  | "success"
  | "submitted"
  | "reviewing"
  | "info"
  | "draft"
  | "neutral"
  | "danger"
  | "rejected"
  | "warning"
  | "premium";

const TONES: Record<BadgeTone, { bg: string; fg: string }> = {
  active:    { bg: "var(--success-100)", fg: "var(--success-700-text)" },
  success:   { bg: "var(--success-100)", fg: "var(--success-700-text)" },
  submitted: { bg: "var(--info-100)",    fg: "var(--info-700-text)" },
  reviewing: { bg: "var(--info-100)",    fg: "var(--info-700-text)" },
  info:      { bg: "var(--info-100)",    fg: "var(--info-700-text)" },
  draft:     { bg: "var(--surface-2)",   fg: "var(--ink-600)" },
  neutral:   { bg: "var(--surface-2)",   fg: "var(--ink-600)" },
  danger:    { bg: "var(--danger-100)",  fg: "var(--danger-700-text)" },
  rejected:  { bg: "var(--danger-100)",  fg: "var(--danger-700-text)" },
  warning:   { bg: "var(--warning-100)", fg: "var(--warning-500)" },
  premium:   { bg: "var(--brand-700)",   fg: "#fff" },
};

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  uppercase?: boolean;
  style?: CSSProperties;
}

export function Badge({ children, tone = "neutral", uppercase = true, style }: BadgeProps) {
  const t = TONES[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily: "var(--font-text)",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: uppercase ? "0.04em" : 0,
        textTransform: uppercase ? "uppercase" : "none",
        padding: "4px 10px",
        borderRadius: "var(--radius-full)",
        background: t.bg,
        color: t.fg,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
