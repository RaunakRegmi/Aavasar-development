import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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

const socials: ReadonlyArray<{ icon: IconName; href: string; label: string }> = [
  { icon: "Share2", href: "https://twitter.com/aavasar", label: "Twitter" },
  { icon: "AtSign", href: "mailto:hello@aavasar.np", label: "Email" },
  { icon: "Globe", href: "https://aavasar.np", label: "Website" },
];

export function SiteFooter() {
  const { t } = useTranslation();

  const cols: ReadonlyArray<FooterColumn> = [
    {
      heading: t("footer.platform"),
      items: [
        { label: t("footer.findGigs"), to: routes.gigs },
        { label: t("footer.postAJob"), to: routes.recruiterPostGig },
        { label: t("footer.howWeWork"), to: routes.howItWorks },
        { label: t("footer.successStories"), to: routes.successStories },
        { label: t("footer.pricing"), to: routes.pricing },
      ],
    },
    {
      heading: t("footer.company"),
      items: [
        { label: t("footer.aboutUs"), to: routes.about },
        { label: t("footer.ourMission"), to: routes.about },
        { label: t("footer.careers"), to: routes.careers },
        { label: t("footer.press"), to: routes.press },
        { label: t("footer.contactUs"), to: routes.contact },
      ],
    },
    {
      heading: t("footer.support"),
      items: [
        { label: t("footer.helpCenter"), to: routes.help },
        { label: t("footer.safetyCenter"), to: routes.safety },
        { label: t("footer.terms"), to: routes.terms },
        { label: t("footer.privacy"), to: routes.privacy },
        { label: t("footer.cookies"), to: routes.cookies },
      ],
    },
  ];

  return (
    <footer
      style={{
        background: "var(--surface-3)",
        borderTop: "1px solid var(--border-default)",
        padding: "64px 0 32px",
      }}
    >
      <div className="container-page">
        <div className="aav-footer-grid">
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
              {t("footer.tagline")}
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
              {c.items.map((i, idx) => (
                <Link
                  key={`${i.to}-${idx}`}
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
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-text)",
              fontSize: 14,
              color: "var(--text-muted)",
            }}
          >
            {t("footer.rights", { year: new Date().getFullYear() })}
          </span>
          <div style={{ display: "flex", gap: 24 }}>
            <span
              style={{
                fontFamily: "var(--font-text)",
                fontSize: 14,
                color: "var(--text-muted)",
              }}
            >
              {t("footer.lang")}
            </span>
            <span
              style={{
                fontFamily: "var(--font-text)",
                fontSize: 14,
                color: "var(--text-muted)",
              }}
            >
              {t("footer.currency")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
