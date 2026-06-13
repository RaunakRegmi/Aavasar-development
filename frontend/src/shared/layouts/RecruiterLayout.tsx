import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Avatar, Button, IconButton } from "@shared/ui";
import { Icon, type IconName } from "@shared/icons";
import { routes } from "@shared/config/routes";
import { useCurrentUser, useLogOut } from "@features/auth";
import { useIsMobile } from "@shared/hooks/useMediaQuery";
import { BottomTabBar, type TabItem } from "./BottomTabBar";
import { MobileTopBar } from "./MobileTopBar";

const topLinks: ReadonlyArray<{ label: string; to: string }> = [
  { label: "Dashboard", to: routes.recruiterDashboard },
  { label: "Browse Talent", to: routes.recruiterBrowseTalent },
  { label: "Resources", to: routes.recruiterResources },
];

const sideItems: ReadonlyArray<{ label: string; icon: IconName; to: string }> = [
  { label: "Overview", icon: "LayoutGrid", to: routes.recruiterDashboard },
  { label: "My Gigs", icon: "Briefcase", to: routes.recruiterMyGigs },
  { label: "Applicants", icon: "Users", to: routes.recruiterApplicants },
  { label: "Messages", icon: "Mail", to: routes.recruiterMessages },
  { label: "Settings", icon: "Settings", to: routes.recruiterSettings },
];

const mobileTabs: ReadonlyArray<TabItem> = [
  { label: "Home", icon: "LayoutGrid", to: routes.recruiterDashboard },
  { label: "Talent", icon: "Users", to: routes.recruiterBrowseTalent },
  { label: "Applicants", icon: "Inbox", to: routes.recruiterApplicants },
  { label: "Messages", icon: "Mail", to: routes.recruiterMessages },
  { label: "Settings", icon: "Settings", to: routes.recruiterSettings },
];

function TopNav() {
  const navigate = useNavigate();
  const user = useCurrentUser();
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
                key={l.label}
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
          <IconButton
            ariaLabel="Notifications"
            onClick={() => navigate(routes.recruiterNotifications)}
          >
            <Icon name="Bell" size={20} />
          </IconButton>
          <IconButton
            ariaLabel="Help"
            onClick={() => navigate(routes.help)}
          >
            <Icon name="HelpCircle" size={20} />
          </IconButton>
          <Button
            variant="primary"
            onClick={() => navigate(routes.recruiterPostGig)}
          >
            Post a Gig
          </Button>
          <button
            type="button"
            onClick={() => navigate(routes.recruiterSettings)}
            aria-label="Account"
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
          Recruiter Admin
        </div>
        <div
          style={{
            fontFamily: "var(--font-text)",
            fontSize: 13,
            color: "var(--text-subtle)",
          }}
        >
          Manage your talent pipeline
        </div>
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {sideItems.map((it) => (
          <NavLink key={it.label} to={it.to} end>
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
                {it.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
        <button
          type="button"
          onClick={() => navigate(routes.recruiterUpgrade)}
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
          Upgrade Plan
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
          Logout
        </button>
      </div>
    </aside>
  );
}

function RecruiterMobileActions() {
  const navigate = useNavigate();
  return (
    <>
      <IconButton ariaLabel="Notifications" onClick={() => navigate(routes.recruiterNotifications)}>
        <Icon name="Bell" size={20} />
      </IconButton>
      <Button
        variant="primary"
        size="sm"
        iconLeft={<Icon name="Plus" size={15} />}
        onClick={() => navigate(routes.recruiterPostGig)}
      >
        Post
      </Button>
    </>
  );
}

export function RecruiterLayout() {
  const isMobile = useIsMobile();

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
