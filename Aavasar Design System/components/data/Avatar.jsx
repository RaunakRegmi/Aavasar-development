import React from "react";

/**
 * Avatar — circle or squircle. Renders a photo (src) or initials on a
 * slate tint. Sizes via `size` px.
 */
export function Avatar({ src = null, name = "", size = 40, shape = "circle", style = {} }) {
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
      {src ? (
        <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        initials || "?"
      )}
    </span>
  );
}
