import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Avatar, Button, IconButton } from "@shared/ui";
import { Icon, type IconName } from "@shared/icons";
import { routes } from "@shared/config/routes";
import { useCurrentUser, useLogOut } from "@features/auth";
import { useIsMobile } from "@shared/hooks/useMediaQuery";
import { LanguageToggle } from "@shared/i18n/LanguageToggle";
import { BottomTabBar, type TabItem } from "./BottomTabBar";
import { MobileTopBar } from "./MobileTopBar";

const sideItems: ReadonlyArray<{ labelKey: string; icon: IconName; to: string }> = [
  { labelKey: "recruiterNav.overview", icon: "LayoutGrid", to: routes.recruiterDashboard },
  { labelKey: "recruiterNav.myGigs", icon: "Briefcase", to: routes.recruiterMyGigs },
  { labelKey: "recruiterNav.applicants", icon: "Users", to: routes.recruiterApplicants },
  { labelKey: "recruiterNav.messages", icon: "Mail", to: routes.recruiterMessages },
  { labelKey: "recruiterNav.billing", icon: "CreditCard", to: routes.recruiterBilling },
  { labelKey: "recruiterNav.settings", icon: "Settings", to: routes.recruiterSettings },
];

function TopNav() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const { t } = useTranslation();

  const topLinks: ReadonlyArray<{ label: string; to: string }> = [
    { label: t("recruiterNav.dashboard"), to: routes.recruiterDashboard },
    { label: t("recruiterNav.browseTalent"), to: routes.recruiterBrowseTalent },
    { label: t("recruiterNav.resources"), to: routes.recruiterResources },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "var(--surface-0)",
        borderBottom: "1px solid var(--border-default)",
      }}
    >
      <nav
        style={{
          height: "var(--nav-height)",
          padding: "0 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/aavasar-mark.png" alt="" style={{ width: 30, height: 30 }} />
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 22,
                color: "var(--brand-700)",
              }}
            >
              Aavasar
            </span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {topLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end
                style={({ isActive }) => ({
                  fontFamily: "var(--font-text)",
                  fontSize: 15,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "var(--brand-700)" : "var(--text-muted)",
                  background: "none",
                  border: `1px solid ${isActive ? "var(--border-default)" : "transparent"}`,
                  borderRadius: "var(--radius-sm)",
                  padding: "7px 12px",
                  textDecoration: "none",
                })}
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <LanguageToggle />
          <IconButton
            ariaLabel={t("studentNav.messages")}
            onClick={() => navigate(routes.recruiterNotifications)}
          >
            <Icon name="Bell" size={20} />
          </IconButton>
          <IconButton
            ariaLabel={t("nav.help")}
            onClick={() => navigate(routes.help)}
          >
            <Icon name="HelpCircle" size={20} />
          </IconButton>
          <Button
            variant="primary"
            onClick={() => navigate(routes.recruiterPostGig)}
          >
            {t("common.postAGig")}
          </Button>
          <button
            type="button"
            onClick={() => navigate(routes.recruiterSettings)}
            aria-label={t("accountMenu.account")}
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            <Avatar src={user?.avatarUrl} name={user?.fullName} size={40} />
          </button>
        </div>
      </nav>
    </header>
  );
}

function SideNav() {
  const navigate = useNavigate();
  const logOut = useLogOut();
  const { t } = useTranslation();
  return (
    <aside
      style={{
        width: 240,
        flexShrink: 0,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        borderRight: "1px solid var(--border-default)",
        minHeight: "calc(100vh - var(--nav-height))",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 20,
            color: "var(--text-strong)",
          }}
        >
          {t("recruiterNav.title")}
        </div>
        <div
          style={{
            fontFamily: "var(--font-text)",
            fontSize: 13,
            color: "var(--text-subtle)",
          }}
        >
          {t("recruiterNav.subtitle")}
        </div>
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {sideItems.map((it) => (
          <NavLink key={it.labelKey} to={it.to} end>
            {({ isActive }) => (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: "var(--radius-sm)",
                  fontFamily: "var(--font-text)",
                  fontSize: 15,
                  fontWeight: isActive ? 600 : 500,
                  background: isActive ? "var(--brand-700)" : "transparent",
                  color: isActive ? "#fff" : "var(--text-muted)",
                }}
              >
                <Icon name={it.icon} size={18} />
                {t(it.labelKey)}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
        <button
          type="button"
          onClick={() => navigate(routes.recruiterBilling)}
          style={{
            fontFamily: "var(--font-text)",
            fontSize: 15,
            fontWeight: 600,
            color: "var(--success-600)",
            background: "var(--success-100)",
            border: "none",
            borderRadius: "var(--radius-sm)",
            padding: "10px 12px",
            cursor: "pointer",
          }}
        >
          {t("recruiterNav.upgrade")}
        </button>
        <button
          type="button"
          onClick={() =>
            logOut.mutate(undefined, {
              onSettled: () => navigate(routes.home),
            })
          }
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 12px",
            borderRadius: "var(--radius-sm)",
            border: "none",
            cursor: "pointer",
            background: "transparent",
            color: "var(--text-muted)",
            fontFamily: "var(--font-text)",
            fontSize: 15,
          }}
        >
          <Icon name="LogOut" size={18} />
          {t("common.logout")}
        </button>
      </div>
    </aside>
  );
}

function RecruiterMobileActions() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <>
      <IconButton ariaLabel={t("studentNav.messages")} onClick={() => navigate(routes.recruiterNotifications)}>
        <Icon name="Bell" size={20} />
      </IconButton>
      <Button
        variant="primary"
        size="sm"
        iconLeft={<Icon name="Plus" size={15} />}
        onClick={() => navigate(routes.recruiterPostGig)}
      >
        {t("common.post")}
      </Button>
    </>
  );
}

export function RecruiterLayout() {
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  const mobileTabs: ReadonlyArray<TabItem> = [
    { label: t("recruiterNav.home"), icon: "LayoutGrid", to: routes.recruiterDashboard },
    { label: t("recruiterNav.talent"), icon: "Users", to: routes.recruiterBrowseTalent },
    { label: t("recruiterNav.applicants"), icon: "Inbox", to: routes.recruiterApplicants },
    { label: t("recruiterNav.messages"), icon: "Mail", to: routes.recruiterMessages },
    { label: t("recruiterNav.settings"), icon: "Settings", to: routes.recruiterSettings },
  ];

  if (isMobile) {
    return (
      <div style={{ background: "var(--surface-page)", minHeight: "100vh" }}>
        <MobileTopBar accountHref={routes.recruiterSettings} actions={<RecruiterMobileActions />} />
        <main
          style={{
            minWidth: 0,
            paddingBottom: "calc(var(--bottom-nav-height) + env(safe-area-inset-bottom) + 8px)",
          }}
        >
          <Outlet />
        </main>
        <BottomTabBar tabs={mobileTabs} />
      </div>
    );
  }

  return (
    <div style={{ background: "var(--surface-page)", minHeight: "100vh" }}>
      <TopNav />
      <div style={{ display: "flex" }}>
        <SideNav />
        <main style={{ flex: 1, minWidth: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
