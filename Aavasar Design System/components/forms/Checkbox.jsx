import React from "react";

/**
 * Checkbox — square 4px-radius box, slate fill when checked. Pairs with
 * inline label text (e.g. "I agree to the Terms of Service").
 */
export function Checkbox({ checked = false, onChange, label, id, style = {} }) {
  const cbId = id || (typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-").slice(0, 24) : undefined);
  return (
    <label htmlFor={cbId} style={{ display: "inline-flex", alignItems: "flex-start", gap: 10, cursor: "pointer", ...style }}>
      <span
        style={{
          flexShrink: 0,
          width: 20,
          height: 20,
          marginTop: 1,
          borderRadius: "var(--radius-xs)",
          border: `1.5px solid ${checked ? "var(--brand-700)" : "var(--border-strong)"}`,
          background: checked ? "var(--brand-700)" : "var(--surface-0)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background var(--dur-fast), border-color var(--dur-fast)",
        }}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6.2L4.8 8.5L9.5 3.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <input id={cbId} type="checkbox" checked={checked} onChange={onChange} style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
      {label && (
        <span style={{ fontFamily: "var(--font-text)", fontSize: 14, lineHeight: 1.5, color: "var(--text-body)" }}>{label}</span>
      )}
    </label>
  );
}
