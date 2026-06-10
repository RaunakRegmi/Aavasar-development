import React from "react";

/**
 * IconButton — square, subtle, for nav/toolbar actions (bell, settings,
 * help, share). ~12px radius squircle; hover fills with a faint tint.
 */
export function IconButton({
  children,
  size = 36,
  variant = "ghost",
  onDark = false,
  ariaLabel = "",
  style = {},
  ...rest
}) {
  const looks = {
    ghost: { background: "transparent", color: "var(--ink-700)", border: "1px solid transparent" },
    bordered: { background: "var(--surface-0)", color: "var(--ink-700)", border: "1px solid var(--border-default)" },
  };
  const look = onDark
    ? { background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid transparent" }
    : looks[variant] || looks.ghost;

  return (
    <button
      aria-label={ariaLabel}
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "var(--radius-md)",
        cursor: "pointer",
        transition: "background var(--dur-fast) var(--ease-standard)",
        ...look,
        ...style,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = onDark ? "rgba(255,255,255,0.2)" : "var(--surface-2)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = look.background; }}
      {...rest}
    >
      {children}
    </button>
  );
}
