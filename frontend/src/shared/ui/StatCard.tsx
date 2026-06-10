import type { CSSProperties, ReactNode } from "react";

export type StatIconTone = "slate" | "soft" | "success" | "info" | "earth" | "none";
export type StatDeltaTone = "success" | "danger" | "neutral";

const iconTones: Record<Exclude<StatIconTone, "none">, { bg: string; fg: string }> = {
  slate:   { bg: "var(--brand-700)", fg: "#fff" },
  soft:    { bg: "var(--brand-50)",  fg: "var(--brand-700)" },
  success: { bg: "var(--success-100)", fg: "var(--success-600)" },
  info:    { bg: "var(--info-100)", fg: "var(--info-600)" },
  earth:   { bg: "var(--accent-earth-100)", fg: "var(--accent-earth)" },
};

export interface StatCardProps {
  label: string;
  /** Accepts a string or any node — pass `<Skeleton />` while loading. */
  value: ReactNode;
  icon?: ReactNode;
  iconTone?: StatIconTone;
  delta?: string;
  deltaTone?: StatDeltaTone;
  style?: CSSProperties;
}

export function StatCard({
  label,
  value,
  icon,
  iconTone = "slate",
  delta,
  deltaTone = "success",
  style,
}: StatCardProps) {
  const it = iconTone === "none" ? null : iconTones[iconTone];
  const deltaColor =
    deltaTone === "success"
      ? "var(--success-600)"
      : deltaTone === "danger"
        ? "var(--danger-500)"
        : "var(--text-subtle)";
  return (
    <div
      style={{
        background: "var(--surface-0)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-md)",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        boxShadow: "var(--shadow-xs)",
        boxSizing: "border-box",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-text)",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "var(--text-subtle)",
          }}
        >
          {label}
        </span>
        {icon &&
          (it ? (
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--radius-sm)",
                background: it.bg,
                color: it.fg,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {icon}
            </span>
          ) : (
            <span
              style={{
                color: "var(--ink-500)",
                display: "inline-flex",
                flexShrink: 0,
              }}
            >
              {icon}
            </span>
          ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 32,
            lineHeight: 1.1,
            color: "var(--text-strong)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </span>
        {delta && (
          <span
            style={{
              fontFamily: "var(--font-text)",
              fontSize: 13,
              fontWeight: 600,
              color: deltaColor,
              whiteSpace: "nowrap",
            }}
          >
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}
