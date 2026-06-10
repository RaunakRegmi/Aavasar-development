import React from "react";

/**
 * Aavasar Button — solid slate primary, ghost secondary, outline,
 * plus on-dark inversion. 4px radius, soft shadow, quick color states.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  onDark = false,
  full = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { padding: "6px 14px", fontSize: 14, height: 36 },
    md: { padding: "8px 20px", fontSize: 16, height: 40 },
    lg: { padding: "12px 24px", fontSize: 16, height: 48 },
  };
  const s = sizes[size] || sizes.md;

  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontFamily: "var(--font-text)",
    fontWeight: 600,
    fontSize: s.fontSize,
    lineHeight: 1.5,
    padding: s.padding,
    minHeight: s.height,
    width: full ? "100%" : "auto",
    borderRadius: "var(--radius-xs)",
    border: "1px solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background var(--dur-fast) var(--ease-standard), border-color var(--dur-fast), color var(--dur-fast)",
    boxSizing: "border-box",
    whiteSpace: "nowrap",
    ...style,
  };

  const variants = {
    primary: {
      background: "var(--primary)",
      color: "#fff",
      boxShadow: "var(--shadow-xs)",
    },
    secondary: {
      background: "transparent",
      color: "var(--brand-700)",
    },
    outline: {
      background: "var(--surface-0)",
      color: "var(--brand-700)",
      borderColor: "var(--border-default)",
      boxShadow: "var(--shadow-xs)",
    },
    danger: {
      background: "var(--danger-500)",
      color: "#fff",
      boxShadow: "var(--shadow-xs)",
    },
  };

  const onDarkVariants = {
    primary: { background: "#fff", color: "var(--brand-700)" },
    secondary: { background: "rgba(255,255,255,0.12)", color: "#fff" },
    outline: { background: "transparent", color: "#fff", borderColor: "rgba(255,255,255,0.4)" },
    danger: { background: "var(--danger-500)", color: "#fff" },
  };

  let look = (onDark ? onDarkVariants : variants)[variant] || variants.primary;
  if (disabled) {
    look = onDark
      ? { background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)" }
      : { background: "var(--ink-300)", color: "#fff" };
  }

  const hoverBg = {
    primary: "var(--primary-hover)",
    secondary: "var(--brand-50)",
    outline: "var(--surface-1)",
    danger: "var(--danger-600)",
  };

  const handleEnter = (e) => {
    if (disabled || onDark) return;
    if (variant === "secondary" || variant === "outline") e.currentTarget.style.background = hoverBg[variant];
    else e.currentTarget.style.background = hoverBg[variant];
  };
  const handleLeave = (e) => {
    if (disabled) return;
    e.currentTarget.style.background = look.background;
  };

  return (
    <button
      style={{ ...base, ...look }}
      disabled={disabled}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
