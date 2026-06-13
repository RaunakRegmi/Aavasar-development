import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, IconButton } from "@shared/ui";
import { Icon, type IconName } from "@shared/icons";
import { routes } from "@shared/config/routes";
import { useLogOut } from "@features/auth";
import { useIsMobile } from "@shared/hooks/useMediaQuery";
import { LanguageToggle } from "@shared/i18n/LanguageToggle";
import { BottomTabBar, type TabItem } from "./BottomTabBar";
import { MobileTopBar } from "./MobileTopBar";

interface NavItem {
  labelKey: string;
  icon: IconName;
  to: string;
}

const items: ReadonlyArray<NavItem> = [
  { labelKey: "studentNav.findWork", icon: "Search", to: routes.studentFindWork },
  { labelKey: "studentNav.myGigs", icon: "Briefcase", to: routes.studentMyGigs },
  { labelKey: "studentNav.messages", icon: "MessageSquare", to: routes.studentMessages },
  { labelKey: "studentNav.perks", icon: "Sparkles", to: routes.studentPerks },
  { labelKey: "studentNav.learning", icon: "GraduationCap", to: routes.studentLearning },
  { labelKey: "studentNav.profile", icon: "User", to: routes.studentProfile },
];

function Sidebar() {
  const navigate = useNavigate();
  const logOut = useLogOut();
  const { t } = useTranslation();
  return (
    <aside
      style={{
        width: "var(--sidebar-width)",
        flexShrink: 0,
        background: "var(--surface-0)",
        borderRight: "1px solid var(--border-default)",
        display: "flex",
        flexDirection: "column",
        padding: 24,
        gap: 24,
        minHeight: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img src="/aavasar-mark.png" alt="" style={{ width: 32, height: 32 }} />
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 22,
              color: "var(--brand-700)",
              lineHeight: 1,
            }}
          >
            Aavasar
          </div>
          <div
            style={{
              fontFamily: "var(--font-text)",
              fontSize: 12,
              color: "var(--text-subtle)",
            }}
          >
            {t("studentNav.subtitle")}
          </div>
        </div>
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <NavLink to={routes.studentDashboard} end>
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
                background: isActive ? "var(--surface-2)" : "transparent",
                color: isActive ? "var(--brand-700)" : "var(--text-muted)",
              }}
            >
              <Icon name="LayoutGrid" size={18} />
              {t("studentNav.dashboard")}
            </span>
          )}
        </NavLink>
        {items.map((it) => (
          <NavLink key={it.labelKey} to={it.to}>
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
                  background: isActive ? "var(--surface-2)" : "transparent",
                  color: isActive ? "var(--brand-700)" : "var(--text-muted)",
                }}
              >
                <Icon name={it.icon} size={18} />
                {t(it.labelKey)}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <Button
          variant="primary"
          full
          onClick={() => navigate(routes.studentProfileEdit)}
        >
          {t("studentNav.postProfile")}
        </Button>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <LanguageToggle />
        </div>
        <button
          type="button"
          onClick={() => navigate(routes.studentSupport)}
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
            marginTop: 8,
          }}
        >
          <Icon name="HelpCircle" size={18} />
          {t("studentNav.support")}
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
          {t("common.signOut")}
        </button>
      </div>
    </aside>
  );
}

function StudentMobileActions() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <IconButton ariaLabel={t("studentNav.messages")} onClick={() => navigate(routes.studentNotifications)}>
      <Icon name="Bell" size={20} />
    </IconButton>
  );
}

export function StudentLayout() {
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  const mobileTabs: ReadonlyArray<TabItem> = [
    { label: t("studentNav.home"), icon: "LayoutGrid", to: routes.studentDashboard },
    { label: t("studentNav.findWork"), icon: "Search", to: routes.studentFindWork },
    { label: t("studentNav.myGigs"), icon: "Briefcase", to: routes.studentMyGigs },
    { label: t("studentNav.messages"), icon: "MessageSquare", to: routes.studentMessages },
    { label: t("studentNav.profile"), icon: "User", to: routes.studentProfile },
  ];

  if (isMobile) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--surface-page)" }}>
        <MobileTopBar accountHref={routes.studentProfile} actions={<StudentMobileActions />} />
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
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--surface-page)",
      }}
    >
      <Sidebar />
      <main style={{ flex: 1, minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  );
}
