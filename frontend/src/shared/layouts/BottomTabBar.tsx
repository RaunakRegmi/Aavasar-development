/**
 * Fixed bottom tab bar — the mobile primary navigation for the logged-in
 * app (replaces the desktop sidebar below 768px). Pages reserve space for
 * it via `padding-bottom` in the layout.
 */
import { NavLink } from "react-router-dom";
import { Icon, type IconName } from "@shared/icons";

export interface TabItem {
  label: string;
  icon: IconName;
  to: string;
}

export function BottomTabBar({ tabs }: { tabs: ReadonlyArray<TabItem> }) {
  return (
    <nav
      aria-label="Primary"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        display: "grid",
        gridTemplateColumns: `repeat(${tabs.length}, 1fr)`,
        background: "var(--surface-0)",
        borderTop: "1px solid var(--border-default)",
        paddingBottom: "env(safe-area-inset-bottom)",
        boxShadow: "0 -2px 8px rgba(27,28,29,0.06)",
      }}
    >
      {tabs.map((t) => (
        <NavLink
          key={t.label}
          to={t.to}
          end
          style={({ isActive }) => ({
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            height: 58,
            textDecoration: "none",
            fontFamily: "var(--font-text)",
            fontSize: 10.5,
            fontWeight: 600,
            color: isActive ? "var(--brand-700)" : "var(--text-muted)",
          })}
        >
          {({ isActive }) => (
            <>
              <Icon name={t.icon} size={21} strokeWidth={isActive ? 2.1 : 1.75} />
              <span style={{ lineHeight: 1, whiteSpace: "nowrap" }}>{t.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
