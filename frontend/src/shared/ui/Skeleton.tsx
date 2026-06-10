import type { CSSProperties } from "react";

/**
 * Skeleton — a tinted rectangle that pulses gently. Used everywhere
 * the dashboards (and any data-bound list) wait on a network response.
 * Replaces the broken-looking "—" placeholders that used to appear
 * before the first request resolved.
 */
export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  style?: CSSProperties;
}

export function Skeleton({
  width = "100%",
  height = 16,
  radius = "var(--radius-xs)",
  style,
}: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width,
        height,
        borderRadius: radius,
        background:
          "linear-gradient(90deg, var(--surface-2) 0%, var(--surface-1) 40%, var(--surface-2) 80%)",
        backgroundSize: "200% 100%",
        animation: "aav-skel 1.4s ease-in-out infinite",
        ...style,
      }}
    >
      <style>{`@keyframes aav-skel {
        0%   { background-position: 100% 0; }
        100% { background-position: -100% 0; }
      }`}</style>
    </span>
  );
}

/**
 * SkeletonText — a stack of skeleton lines that approximates a
 * paragraph. Last line is shorter so it reads as "real" text shape.
 */
export function SkeletonText({
  lines = 3,
  lineHeight = 12,
  gap = 8,
}: {
  lines?: number;
  lineHeight?: number;
  gap?: number;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={lineHeight}
          width={i === lines - 1 ? "60%" : "100%"}
        />
      ))}
    </div>
  );
}
