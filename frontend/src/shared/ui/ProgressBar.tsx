import type { CSSProperties } from "react";

export interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  track?: string;
  height?: number;
  onDark?: boolean;
  style?: CSSProperties;
}

export function ProgressBar({
  value,
  max = 100,
  color = "var(--brand-700)",
  track = "var(--surface-2)",
  height = 8,
  onDark = false,
  style,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      style={{
        width: "100%",
        height,
        background: onDark ? "rgba(255,255,255,0.2)" : track,
        borderRadius: "var(--radius-full)",
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: onDark ? "#fff" : color,
          borderRadius: "var(--radius-full)",
          transition: "width var(--dur-slow) var(--ease-out)",
        }}
      />
    </div>
  );
}
