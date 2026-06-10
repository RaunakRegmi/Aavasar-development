import React from "react";

/**
 * Card — the base container. White fill, 1px border, soft shadow, 12px
 * radius by default. `tone="dark"` flips to a slate feature card (white
 * text, no border). `interactive` adds a hover lift.
 */
export function Card({
  children,
  tone = "default",
  radius = "md",
  padding = 24,
  interactive = false,
  style = {},
  ...rest
}) {
  const radii = { sm: "var(--radius-sm)", md: "var(--radius-md)", lg: "var(--radius-lg)", xl: "var(--radius-xl)" };
  const tones = {
    default: { background: "var(--surface-0)", border: "1px solid var(--border-default)", color: "var(--text-body)", boxShadow: "var(--shadow-sm)" },
    flat:    { background: "var(--surface-0)", border: "1px solid var(--border-default)", color: "var(--text-body)", boxShadow: "none" },
    well:    { background: "var(--surface-2)", border: "1px solid var(--border-subtle)", color: "var(--text-body)", boxShadow: "none" },
    dark:    { background: "var(--brand-700)", border: "1px solid transparent", color: "#fff", boxShadow: "var(--shadow-md)" },
    earth:   { background: "var(--accent-earth)", border: "1px solid transparent", color: "#fff", boxShadow: "var(--shadow-md)" },
  };
  const t = tones[tone] || tones.default;
  const base = {
    borderRadius: radii[radius] || radii.md,
    padding,
    boxSizing: "border-box",
    transition: "box-shadow var(--dur-base) var(--ease-standard), transform var(--dur-base) var(--ease-standard)",
    ...t,
    ...style,
  };
  return (
    <div
      style={base}
      onMouseEnter={interactive ? (e) => { e.currentTarget.style.boxShadow = "var(--shadow-lg)"; e.currentTarget.style.transform = "translateY(-2px)"; } : undefined}
      onMouseLeave={interactive ? (e) => { e.currentTarget.style.boxShadow = t.boxShadow; e.currentTarget.style.transform = "none"; } : undefined}
      {...rest}
    >
      {children}
    </div>
  );
}
