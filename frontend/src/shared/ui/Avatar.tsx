import { useState, type CSSProperties } from "react";
import { resolveImageUrl } from "@shared/lib/resolveImageUrl";

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: number;
  shape?: "circle" | "squircle";
  style?: CSSProperties;
}

export function Avatar({ src, name = "", size = 40, shape = "circle", style }: AvatarProps) {
  const [broken, setBroken] = useState(false);
  const resolvedSrc = resolveImageUrl(src);
  const showImg = resolvedSrc && !broken;

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
  const radius = shape === "circle" ? "9999px" : "var(--radius-md)";
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: "var(--brand-50)",
        color: "var(--brand-700)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-text)",
        fontWeight: 600,
        fontSize: Math.round(size * 0.4),
        overflow: "hidden",
        flexShrink: 0,
        border: "1px solid var(--border-subtle)",
        ...style,
      }}
    >
      {showImg ? (
        <img
          src={resolvedSrc}
          alt={name}
          onError={() => setBroken(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        initials || "?"
      )}
    </span>
  );
}
