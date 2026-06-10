import React, { useState } from "react";

/**
 * Text input with label + helper. White fill, 1px border, 4–8px radius,
 * slate focus ring. Supports password reveal and trailing element.
 */
export function Input({
  label,
  helper,
  error,
  type = "text",
  placeholder = "",
  value,
  defaultValue,
  onChange,
  leading = null,
  trailing = null,
  passwordToggle = false,
  id,
  style = {},
  ...rest
}) {
  const [show, setShow] = useState(false);
  const [focus, setFocus] = useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  const effectiveType = passwordToggle ? (show ? "text" : "password") : type;
  const borderColor = error ? "var(--danger-500)" : focus ? "var(--border-focus)" : "var(--border-default)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", ...style }}>
      {label && (
        <label htmlFor={inputId} style={{ fontFamily: "var(--font-text)", fontSize: 14, fontWeight: 600, color: "var(--text-strong)" }}>
          {label}
        </label>
      )}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {leading && (
          <div style={{ position: "absolute", left: 12, display: "flex", alignItems: "center", color: "var(--ink-500)", pointerEvents: "none" }}>{leading}</div>
        )}
        <input
          id={inputId}
          type={effectiveType}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
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
            paddingRight: (passwordToggle || trailing) ? 44 : 14,
            outline: "none",
            boxShadow: focus ? "var(--shadow-focus)" : "none",
            transition: "border-color var(--dur-fast), box-shadow var(--dur-fast)",
            boxSizing: "border-box",
          }}
          {...rest}
        />
        {passwordToggle && (
          <button
            type="button"
            aria-label={show ? "Hide password" : "Show password"}
            onClick={() => setShow((v) => !v)}
            style={{ position: "absolute", right: 8, background: "none", border: "none", cursor: "pointer", color: "var(--ink-500)", display: "flex", padding: 6 }}
          >
            <i data-lucide={show ? "eye-off" : "eye"} style={{ width: 18, height: 18 }}></i>
          </button>
        )}
        {!passwordToggle && trailing && (
          <div style={{ position: "absolute", right: 10, display: "flex", alignItems: "center" }}>{trailing}</div>
        )}
      </div>
      {(helper || error) && (
        <span style={{ fontFamily: "var(--font-text)", fontSize: 13, color: error ? "var(--danger-500)" : "var(--text-subtle)" }}>
          {error || helper}
        </span>
      )}
    </div>
  );
}
