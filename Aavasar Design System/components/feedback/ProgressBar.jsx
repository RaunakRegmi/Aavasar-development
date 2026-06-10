import React from "react";

/**
 * ProgressBar — thin rounded track with a slate (or custom) fill. Used for
 * profile completion, course progress, and applicant-volume bars.
 */
export function ProgressBar({ value = 0, max = 100, color = "var(--brand-700)", track = "var(--surface-2)", height = 8, onDark = false, style = {} }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
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
