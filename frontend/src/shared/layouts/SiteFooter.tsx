import { Link } from "react-router-dom";
import { Icon, type IconName } from "@shared/icons";
import { routes, type RoutePath } from "@shared/config/routes";

interface FooterLink {
  label: string;
  to: RoutePath;
}

interface FooterColumn {
  heading: string;
  items: ReadonlyArray<FooterLink>;
}

const cols: ReadonlyArray<FooterColumn> = [
  {
    heading: "Platform",
    items: [
      { label: "Find Gigs", to: routes.gigs },
      { label: "Post a Job", to: routes.recruiterPostGig },
      { label: "How We Work", to: routes.howItWorks },
      { label: "Success Stories", to: routes.successStories },
      { label: "Pricing", to: routes.pricing },
    ],
  },
  {
    heading: "Company",
    items: [
      { label: "About Us", to: routes.about },
      { label: "Our Mission", to: routes.about },
      { label: "Careers", to: routes.careers },
      { label: "Press & Media", to: routes.press },
      { label: "Contact Us", to: routes.contact },
    ],
  },
  {
    heading: "Support",
    items: [
      { label: "Help Center", to: routes.help },
      { label: "Safety Center", to: routes.safety },
      { label: "Terms of Service", to: routes.terms },
      { label: "Privacy Policy", to: routes.privacy },
      { label: "Cookie Settings", to: routes.cookies },
    ],
  },
];

const socials: ReadonlyArray<{ icon: IconName; href: string; label: string }> = [
  { icon: "Share2", href: "https://twitter.com/aavasar", label: "Twitter" },
  { icon: "AtSign", href: "mailto:hello@aavasar.np", label: "Email" },
  { icon: "Globe", href: "https://aavasar.np", label: "Website" },
];

export function SiteFooter() {
  return (
    <footer
      style={{
        background: "var(--surface-3)",
        borderTop: "1px solid var(--border-default)",
        padding: "64px 0 32px",
      }}
    >
      <div className="container-page">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
            gap: 48,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Link
              to={routes.home}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 24,
                color: "var(--brand-700)",
                textDecoration: "none",
              }}
            >
              Aavasar
            </Link>
            <p
              style={{
                fontFamily: "var(--font-text)",
                fontSize: 16,
                lineHeight: 1.6,
                color: "var(--text-body)",
                margin: 0,
                maxWidth: 280,
              }}
            >
              The premier marketplace for student talent. Connecting tomorrow&apos;s leaders
              with today&apos;s opportunities through professional gigs and projects.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "var(--radius-md)",
                    background: "var(--surface-1)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--ink-700)",
                    border: "1px solid var(--border-default)",
                    textDecoration: "none",
                  }}
                >
                  <Icon name={s.icon} size={18} />
                </a>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div
              key={c.heading}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "var(--text-strong)",
                }}
              >
                {c.heading}
              </span>
              {c.items.map((i) => (
                <Link
                  key={i.label}
                  to={i.to}
                  style={{
                    fontFamily: "var(--font-text)",
                    fontSize: 15,
                    color: "var(--text-muted)",
                    textDecoration: "none",
                  }}
                >
                  {i.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid var(--border-default)",
            marginTop: 48,
            paddingTop: 32,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-text)",
              fontSize: 14,
              color: "var(--text-muted)",
            }}
          >
            © {new Date().getFullYear()} Aavasar Inc. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: 24 }}>
            <span
              style={{
                fontFamily: "var(--font-text)",
                fontSize: 14,
                color: "var(--text-muted)",
              }}
            >
              English (US)
            </span>
            <span
              style={{
                fontFamily: "var(--font-text)",
                fontSize: 14,
                color: "var(--text-muted)",
              }}
            >
              NPR (रु)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
