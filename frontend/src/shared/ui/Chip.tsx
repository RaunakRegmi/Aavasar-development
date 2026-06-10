import { Icon } from "@shared/icons";

/**
 * Toggle chip — used in the onboarding skills selector. Off = bordered
 * pill on white; on = solid slate with a checkmark.
 */
export interface ChipProps {
  label: string;
  on: boolean;
  onClick: () => void;
}

export function Chip({ label, on, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        fontFamily: "var(--font-text)",
        fontSize: 14,
        fontWeight: 600,
        padding: "9px 16px",
        borderRadius: "var(--radius-full)",
        cursor: "pointer",
        border: `1px solid ${on ? "var(--brand-700)" : "var(--border-default)"}`,
        background: on ? "var(--brand-700)" : "var(--surface-0)",
        color: on ? "#fff" : "var(--text-body)",
        transition: "all var(--dur-fast) var(--ease-standard)",
      }}
    >
      {label}
      {on && <Icon name="Check" size={15} />}
    </button>
  );
}
