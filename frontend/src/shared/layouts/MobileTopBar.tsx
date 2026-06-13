/**
 * Slim sticky top bar for the mobile logged-in shell: brand on the left,
 * role-specific actions + an account menu (with Sign out, so logout stays
 * reachable once the sidebar is gone) on the right.
 */
import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Avatar } from "@shared/ui";
import { Icon } from "@shared/icons";
import { useCurrentUser, useLogOut } from "@features/auth";
import { routes } from "@shared/config/routes";
import { LanguageToggle } from "@shared/i18n/LanguageToggle";

interface MobileTopBarProps {
  /** Role-specific controls (e.g. recruiter "Post a Gig", notifications). */
  actions?: ReactNode;
  /** Where the account menu's "Account" entry links (profile/settings). */
  accountHref: string;
}

export function MobileTopBar({ actions, accountHref }: MobileTopBarProps) {
  const user = useCurrentUser();
  const logOut = useLogOut();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        height: 56,
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "var(--surface-0)",
        borderBottom: "1px solid var(--border-default)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <img src="/aavasar-mark.png" alt="" style={{ width: 26, height: 26 }} />
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, color: "var(--brand-700)" }}>
          Aavasar
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
        {actions}
        <button
          type="button"
          aria-label={t("accountMenu.account")}
          onClick={() => setMenuOpen((v) => !v)}
          style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", lineHeight: 0 }}
        >
          <Avatar src={user?.avatarUrl} name={user?.fullName} size={34} />
        </button>

        {menuOpen ? (
          <>
            {/* Click-away backdrop */}
            <div
              onClick={() => setMenuOpen(false)}
              style={{ position: "fixed", inset: 0, zIndex: 40 }}
            />
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                zIndex: 41,
                minWidth: 200,
                background: "var(--surface-0)",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-lg)",
                padding: 6,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ padding: "8px 10px 6px", borderBottom: "1px solid var(--border-subtle)", marginBottom: 4 }}>
                <div style={{ fontFamily: "var(--font-text)", fontSize: 13, fontWeight: 600, color: "var(--text-strong)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user?.fullName ?? t("accountMenu.account")}
                </div>
                <div style={{ fontFamily: "var(--font-text)", fontSize: 12, color: "var(--text-subtle)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user?.email}
                </div>
              </div>
              <div style={{ padding: "6px 10px 8px", borderBottom: "1px solid var(--border-subtle)", marginBottom: 4 }}>
                <div style={{ fontFamily: "var(--font-text)", fontSize: 11, fontWeight: 600, color: "var(--text-subtle)", marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  {t("common.language")}
                </div>
                <LanguageToggle />
              </div>
              <MenuItem icon="User" label={t("accountMenu.account")} onClick={() => { setMenuOpen(false); navigate(accountHref); }} />
              <MenuItem
                icon="LogOut"
                label={t("accountMenu.signOut")}
                onClick={() => {
                  setMenuOpen(false);
                  logOut.mutate(undefined, { onSettled: () => navigate(routes.home) });
                }}
              />
            </div>
          </>
        ) : null}
      </div>
    </header>
  );
}

function MenuItem({ icon, label, onClick }: { icon: "User" | "LogOut"; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 10px",
        borderRadius: "var(--radius-sm)",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        fontFamily: "var(--font-text)",
        fontSize: 14,
        fontWeight: 500,
        color: "var(--text-body)",
        textAlign: "left",
      }}
    >
      <Icon name={icon} size={16} />
      {label}
    </button>
  );
}
