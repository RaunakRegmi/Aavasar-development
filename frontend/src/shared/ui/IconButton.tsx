import {
  forwardRef,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from "react";

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children"> {
  children: ReactNode;
  size?: number;
  variant?: "ghost" | "bordered";
  onDark?: boolean;
  ariaLabel: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { children, size = 36, variant = "ghost", onDark = false, ariaLabel, style, ...rest },
    ref,
  ) {
    const looks: Record<"ghost" | "bordered", CSSProperties> = {
      ghost: {
        background: "transparent",
        color: "var(--ink-700)",
        border: "1px solid transparent",
      },
      bordered: {
        background: "var(--surface-0)",
        color: "var(--ink-700)",
        border: "1px solid var(--border-default)",
      },
    };
    const look: CSSProperties = onDark
      ? {
          background: "rgba(255,255,255,0.1)",
          color: "#fff",
          border: "1px solid transparent",
        }
      : looks[variant];

    return (
      <button
        ref={ref}
        type="button"
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
        onMouseEnter={(e) => {
          e.currentTarget.style.background = onDark
            ? "rgba(255,255,255,0.2)"
            : "var(--surface-2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = String(look.background ?? "");
        }}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
