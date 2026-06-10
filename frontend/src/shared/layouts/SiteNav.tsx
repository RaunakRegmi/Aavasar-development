import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button, IconButton } from "@shared/ui";
import { Icon } from "@shared/icons";
import { routes } from "@shared/config/routes";

const links: ReadonlyArray<{ label: string; to: string }> = [
  { label: "Find Gigs", to: routes.gigs },
  { label: "How It Works", to: routes.howItWorks },
  { label: "About", to: routes.about },
  { label: "Contact", to: routes.contact },
];

export function SiteNav() {
  const navigate = useNavigate();
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
          maxWidth: "var(--container-max)",
          margin: "0 auto",
          height: "var(--nav-height)",
          padding: "0 var(--container-pad)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <Link
            to={routes.home}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            <img
              src="/aavasar-mark.png"
              alt=""
              style={{ width: 32, height: 32 }}
            />
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 24,
                color: "var(--brand-700)",
                letterSpacing: "-0.01em",
              }}
            >
              Aavasar
            </span>
          </Link>
          <div style={{ display: "flex", gap: 24 }}>
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                end
                style={({ isActive }) => ({
                  fontFamily: "var(--font-text)",
                  fontSize: 15,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "var(--brand-700)" : "var(--text-muted)",
                  textDecoration: "none",
                  padding: "6px 0",
                  borderBottom: isActive
                    ? "2px solid var(--brand-700)"
                    : "2px solid transparent",
                })}
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Button variant="secondary" onClick={() => navigate(routes.logIn)}>
            Log In
          </Button>
          <Button variant="primary" onClick={() => navigate(routes.signUp)}>
            Sign Up
          </Button>
          <span style={{ width: 1, height: 24, background: "var(--border-strong)" }} />
          <IconButton ariaLabel="Help" onClick={() => navigate(routes.help)}>
            <Icon name="HelpCircle" size={20} />
          </IconButton>
        </div>
      </nav>
    </header>
  );
}
