import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export type CardTone = "default" | "flat" | "well" | "dark" | "earth";
export type CardRadius = "sm" | "md" | "lg" | "xl";

const radii: Record<CardRadius, string> = {
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
  xl: "var(--radius-xl)",
};

const tones: Record<CardTone, CSSProperties> = {
  default: {
    background: "var(--surface-0)",
    border: "1px solid var(--border-default)",
    color: "var(--text-body)",
    boxShadow: "var(--shadow-sm)",
  },
  flat: {
    background: "var(--surface-0)",
    border: "1px solid var(--border-default)",
    color: "var(--text-body)",
    boxShadow: "none",
  },
  well: {
    background: "var(--surface-2)",
    border: "1px solid var(--border-subtle)",
    color: "var(--text-body)",
    boxShadow: "none",
  },
  dark: {
    background: "var(--brand-700)",
    border: "1px solid transparent",
    color: "#fff",
    boxShadow: "var(--shadow-md)",
  },
  earth: {
    background: "var(--accent-earth)",
    border: "1px solid transparent",
    color: "#fff",
    boxShadow: "var(--shadow-md)",
  },
};

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  tone?: CardTone;
  radius?: CardRadius;
  padding?: number;
  interactive?: boolean;
}

export function Card({
  children,
  tone = "default",
  radius = "md",
  padding = 24,
  interactive = false,
  style,
  ...rest
}: CardProps) {
  const t = tones[tone];
  const base: CSSProperties = {
    borderRadius: radii[radius],
    padding,
    boxSizing: "border-box",
    transition:
      "box-shadow var(--dur-base) var(--ease-standard), transform var(--dur-base) var(--ease-standard)",
    ...t,
    ...style,
  };
  return (
    <div
      style={base}
      onMouseEnter={
        interactive
          ? (e) => {
              e.currentTarget.style.boxShadow = "var(--shadow-lg)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }
          : undefined
      }
      onMouseLeave={
        interactive
          ? (e) => {
              e.currentTarget.style.boxShadow = String(t.boxShadow ?? "");
              e.currentTarget.style.transform = "none";
            }
          : undefined
      }
      {...rest}
    >
      {children}
    </div>
  );
}
