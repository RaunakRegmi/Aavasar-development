import React from "react";

/**
 * SegmentedControl — the Student / Recruiter style toggle. Active segment
 * is a white card with a soft shadow; inactive segments are flat on a
 * surface-1 track.
 */
export function SegmentedControl({ options = [], value, onChange, style = {} }) {
  return (
    <div
      role="tablist"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${options.length}, 1fr)`,
        gap: 4,
        padding: 4,
        background: "var(--surface-1)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-sm)",
        ...style,
      }}
    >
      {options.map((opt) => {
        const val = typeof opt === "string" ? opt : opt.value;
        const label = typeof opt === "string" ? opt : opt.label;
        const icon = typeof opt === "string" ? null : opt.icon;
        const active = val === value;
        return (
          <button
            key={val}
            role="tab"
            aria-selected={active}
            onClick={() => onChange && onChange(val)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontFamily: "var(--font-text)",
              fontSize: 15,
              fontWeight: 600,
              padding: "10px 12px",
              borderRadius: "var(--radius-xs)",
              border: "none",
              cursor: "pointer",
              color: active ? "var(--brand-700)" : "var(--text-muted)",
              background: active ? "var(--surface-0)" : "transparent",
              boxShadow: active ? "var(--shadow-sm)" : "none",
              transition: "background var(--dur-base) var(--ease-standard), color var(--dur-fast)",
            }}
          >
            {icon}
            {label}
          </button>
        );
      })}
    </div>
  );
}
