import {
  forwardRef,
  useState,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { Icon } from "@shared/icons";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helper?: string;
  error?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  passwordToggle?: boolean;
  containerStyle?: CSSProperties;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    helper,
    error,
    type = "text",
    leading,
    trailing,
    passwordToggle = false,
    id,
    containerStyle,
    ...rest
  },
  ref,
) {
  const [show, setShow] = useState(false);
  const [focus, setFocus] = useState(false);
  const inputId =
    id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  const effectiveType = passwordToggle ? (show ? "text" : "password") : type;
  const borderColor = error
    ? "var(--danger-500)"
    : focus
      ? "var(--border-focus)"
      : "var(--border-default)";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        width: "100%",
        ...containerStyle,
      }}
    >
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontFamily: "var(--font-text)",
            fontSize: 14,
            fontWeight: 600,
            color: "var(--text-strong)",
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {leading && (
          <div
            style={{
              position: "absolute",
              left: 12,
              display: "flex",
              alignItems: "center",
              color: "var(--ink-500)",
              pointerEvents: "none",
            }}
          >
            {leading}
          </div>
        )}
        {/*
          Order matters: spread `{...rest}` FIRST so any onBlur/onFocus
          coming from `register(...)` is in place, then override with
          our own handlers that ALSO drive the focus ring state. This
          way RHF's onBlur (touched/dirty tracking) still fires AND
          our focus border updates correctly.
        */}
        <input
          ref={ref}
          id={inputId}
          type={effectiveType}
          style={{
            width: "100%",
            fontFamily: "var(--font-text)",
            fontSize: 16,
            color: "var(--text-strong)",
            background: "var(--surface-0)",
            border: `1px solid ${borderColor}`,
            borderRadius: "var(--radius-sm)",
            padding: "11px 14px",
            paddingLeft: leading ? 42 : 14,
            paddingRight: passwordToggle || trailing ? 44 : 14,
            outline: "none",
            boxShadow: focus ? "var(--shadow-focus)" : "none",
            transition: "border-color var(--dur-fast), box-shadow var(--dur-fast)",
            boxSizing: "border-box",
          }}
          {...rest}
          onFocus={(e) => {
            setFocus(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocus(false);
            rest.onBlur?.(e);
          }}
        />
        {passwordToggle && (
          <button
            type="button"
            aria-label={show ? "Hide password" : "Show password"}
            onClick={() => setShow((v) => !v)}
            style={{
              position: "absolute",
              right: 8,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--ink-500)",
              display: "flex",
              padding: 6,
            }}
          >
            <Icon name={show ? "EyeOff" : "Eye"} size={18} />
          </button>
        )}
        {!passwordToggle && trailing && (
          <div
            style={{
              position: "absolute",
              right: 10,
              display: "flex",
              alignItems: "center",
              color: "var(--ink-500)",
            }}
          >
            {trailing}
          </div>
        )}
      </div>
      {(helper || error) && (
        <span
          style={{
            fontFamily: "var(--font-text)",
            fontSize: 13,
            color: error ? "var(--danger-500)" : "var(--text-subtle)",
          }}
        >
          {error || helper}
        </span>
      )}
    </div>
  );
});
