import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button, IconButton } from "@shared/ui";
import { Icon } from "@shared/icons";
import { routes } from "@shared/config/routes";
import { useIsMobile } from "@shared/hooks/useMediaQuery";

const links: ReadonlyArray<{ label: string; to: string }> = [
  { label: "Find Gigs", to: routes.gigs },
  { label: "How It Works", to: routes.howItWorks },
  { label: "About", to: routes.about },
  { label: "Contact", to: routes.contact },
];

function Brand() {
  return (
    <Link to={routes.home} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
      <img src="/aavasar-mark.png" alt="" style={{ width: 32, height: 32 }} />
      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--brand-700)", letterSpacing: "-0.01em" }}>
        Aavasar
      </span>
    </Link>
  );
}

export function SiteNav() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

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
        {isMobile ? (
          <>
            <Brand />
            <IconButton ariaLabel="Menu" variant="bordered" onClick={() => setOpen((v) => !v)}>
              <Icon name={open ? "X" : "Menu"} size={20} />
            </IconButton>
          </>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
              <Brand />
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
                      borderBottom: isActive ? "2px solid var(--brand-700)" : "2px solid transparent",
                    })}
                  >
                    {l.label}
                  </NavLink>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Button variant="secondary" onClick={() => navigate(routes.logIn)}>Log In</Button>
              <Button variant="primary" onClick={() => navigate(routes.signUp)}>Sign Up</Button>
              <span style={{ width: 1, height: 24, background: "var(--border-strong)" }} />
              <IconButton ariaLabel="Help" onClick={() => navigate(routes.help)}>
                <Icon name="HelpCircle" size={20} />
              </IconButton>
            </div>
          </>
        )}
      </nav>

      {/* Mobile drawer */}
      {isMobile && open ? (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, top: "var(--nav-height)", background: "rgba(0,0,0,0.3)", zIndex: 18 }} />
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 19,
              background: "var(--surface-0)",
              borderBottom: "1px solid var(--border-default)",
              boxShadow: "var(--shadow-lg)",
              padding: "12px 16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                end
                onClick={() => setOpen(false)}
                style={({ isActive }) => ({
                  fontFamily: "var(--font-text)",
                  fontSize: 16,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "var(--brand-700)" : "var(--text-body)",
                  textDecoration: "none",
                  padding: "12px 8px",
                  borderRadius: "var(--radius-sm)",
                })}
              >
                {l.label}
              </NavLink>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <Button variant="secondary" full onClick={() => { setOpen(false); navigate(routes.logIn); }}>
                Log In
              </Button>
              <Button variant="primary" full onClick={() => { setOpen(false); navigate(routes.signUp); }}>
                Sign Up
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}
