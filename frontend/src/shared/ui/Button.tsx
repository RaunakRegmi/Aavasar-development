import {
  forwardRef,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  onDark?: boolean;
  full?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  type?: "button" | "submit" | "reset";
}

const sizes: Record<ButtonSize, CSSProperties & { fontSize: number; minHeight: number }> = {
  sm: { padding: "6px 14px", fontSize: 14, minHeight: 36 },
  md: { padding: "8px 20px", fontSize: 16, minHeight: 40 },
  lg: { padding: "12px 24px", fontSize: 16, minHeight: 48 },
};

const variants: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: "var(--primary)",
    color: "#fff",
    boxShadow: "var(--shadow-xs)",
  },
  secondary: { background: "transparent", color: "var(--brand-700)" },
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

const onDarkVariants: Record<ButtonVariant, CSSProperties> = {
  primary: { background: "#fff", color: "var(--brand-700)" },
  secondary: { background: "rgba(255,255,255,0.12)", color: "#fff" },
  outline: {
    background: "transparent",
    color: "#fff",
    borderColor: "rgba(255,255,255,0.4)",
  },
  danger: { background: "var(--danger-500)", color: "#fff" },
};

const hoverBg: Record<ButtonVariant, string> = {
  primary: "var(--primary-hover)",
  secondary: "var(--brand-50)",
  outline: "var(--surface-1)",
  danger: "var(--danger-600)",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    onDark = false,
    full = false,
    disabled = false,
    iconLeft,
    iconRight,
    style,
    type = "button",
    ...rest
  },
  ref,
) {
  const s = sizes[size];
  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontFamily: "var(--font-text)",
    fontWeight: 600,
    fontSize: s.fontSize,
    lineHeight: 1.5,
    padding: s.padding,
    minHeight: s.minHeight,
    width: full ? "100%" : "auto",
    borderRadius: "var(--radius-xs)",
    border: "1px solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    transition:
      "background var(--dur-fast) var(--ease-standard), border-color var(--dur-fast), color var(--dur-fast)",
    boxSizing: "border-box",
    whiteSpace: "nowrap",
    ...style,
  };

  let look = onDark ? onDarkVariants[variant] : variants[variant];
  if (disabled) {
    look = onDark
      ? { background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)" }
      : { background: "var(--ink-300)", color: "#fff" };
  }

  const handleEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || onDark) return;
    e.currentTarget.style.background = hoverBg[variant];
  };
  const handleLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    e.currentTarget.style.background = String(look.background ?? "");
  };

  return (
    <button
      ref={ref}
      type={type}
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
});
