import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Avatar, Button, Card } from "@shared/ui";
import { Icon, type IconName } from "@shared/icons";
import { routes } from "@shared/config/routes";

interface TeamMember {
  name: string;
  /** i18n key under `about.roles` */
  roleKey: "ceo" | "cofounder";
  /** Public photo filename (under /public/team/). */
  slug: string;
}

// TODO: replace placeholder photos at /public/team/<slug>.jpg with real headshots.
const TEAM: ReadonlyArray<TeamMember> = [
  { name: "Raunak Regmi", roleKey: "ceo", slug: "raunak-regmi" },
  { name: "Samikshya Dhamala", roleKey: "cofounder", slug: "samikshya-dhamala" },
  { name: "Unika Ghimire", roleKey: "cofounder", slug: "unika-ghimire" },
  { name: "Pratikshya Ghimire", roleKey: "cofounder", slug: "pratikshya-ghimire" },
  { name: "Shreya Bhatta", roleKey: "cofounder", slug: "shreya-bhatta" },
];

interface PillarRow {
  icon: IconName;
  titleKey: string;
  bodyKey: string;
}

const PILLARS: ReadonlyArray<PillarRow> = [
  { icon: "GraduationCap", titleKey: "about.pillar1Title", bodyKey: "about.pillar1Body" },
  { icon: "ShieldCheck", titleKey: "about.pillar2Title", bodyKey: "about.pillar2Body" },
  { icon: "Zap", titleKey: "about.pillar3Title", bodyKey: "about.pillar3Body" },
];

export default function AboutPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <main className="container-page" style={{ paddingTop: 64, paddingBottom: 72 }}>
      {/* ---- Hero ---- */}
      <section style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 64px" }}>
        <span
          style={{
            display: "inline-block",
            padding: "6px 14px",
            borderRadius: "var(--radius-full)",
            background: "var(--brand-50)",
            color: "var(--brand-700)",
            fontFamily: "var(--font-text)",
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          {t("about.badge")}
        </span>
        <h1 style={h1Style}>{t("about.heroTitle")}</h1>
        <p style={leadStyle}>{t("about.heroSubtitle")}</p>
      </section>

      {/* ---- Story ---- */}
      <section style={{ maxWidth: 880, margin: "0 auto 72px" }}>
        <div className="aav-split" style={{ alignItems: "center" }}>
          <div>
            <h2 style={h2Style}>{t("about.storyTitle")}</h2>
            <p style={paragraphStyle}>{t("about.story1")}</p>
            <p style={paragraphStyle}>{t("about.story2")}</p>
            <p style={paragraphStyle}>{t("about.story3")}</p>
          </div>
          <Card tone="well" padding={28}>
            <h3 style={h3Style}>{t("about.missionTitle")}</h3>
            <p style={{ ...paragraphStyle, marginBottom: 16 }}>{t("about.missionLead")}</p>
            <ul style={listStyle}>
              <MissionRow text={t("about.mission1")} />
              <MissionRow text={t("about.mission2")} />
              <MissionRow text={t("about.mission3")} />
            </ul>
          </Card>
        </div>
      </section>

      {/* ---- What's different ---- */}
      <section style={{ maxWidth: 1040, margin: "0 auto 72px" }}>
        <header style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={h2Style}>{t("about.pillarsTitle")}</h2>
          <p style={{ ...leadStyle, maxWidth: 600, margin: "0 auto" }}>
            {t("about.pillarsSubtitle")}
          </p>
        </header>
        <div className="aav-grid-3">
          {PILLARS.map((p) => (
            <Card key={p.titleKey} padding={28}>
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "var(--radius-md)",
                  background: "var(--brand-50)",
                  color: "var(--brand-700)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 14,
                }}
              >
                <Icon name={p.icon} size={22} />
              </span>
              <h3 style={h3Style}>{t(p.titleKey)}</h3>
              <p style={{ ...paragraphStyle, marginBottom: 0 }}>{t(p.bodyKey)}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ---- Team ---- */}
      <section style={{ maxWidth: 1040, margin: "0 auto 72px" }}>
        <header style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={h2Style}>{t("about.teamTitle")}</h2>
          <p style={{ ...leadStyle, maxWidth: 600, margin: "0 auto" }}>
            {t("about.teamSubtitle")}
          </p>
        </header>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
          }}
        >
          {TEAM.map((m) => (
            <TeamCard key={m.slug} member={m} />
          ))}
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section style={{ maxWidth: 880, margin: "0 auto" }}>
        <Card tone="dark" padding={36}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 16,
            }}
          >
            <h2 style={{ ...h2Style, color: "#fff", margin: 0 }}>{t("about.ctaTitle")}</h2>
            <p
              style={{
                fontFamily: "var(--font-text)",
                fontSize: 16,
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.85)",
                margin: 0,
                maxWidth: 480,
              }}
            >
              {t("about.ctaSubtitle")}
            </p>
            <div className="aav-row-wrap" style={{ justifyContent: "center", marginTop: 8 }}>
              <Button onDark variant="primary" size="lg" onClick={() => navigate(routes.signUp)}>
                {t("common.signUpFree")}
              </Button>
              <Button onDark variant="outline" size="lg" onClick={() => navigate(routes.contact)}>
                {t("common.talkToUs")}
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
}

function MissionRow({ text }: { text: string }) {
  return (
    <li
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        fontFamily: "var(--font-text)",
        fontSize: 14,
        lineHeight: 1.55,
        color: "var(--text-body)",
        marginBottom: 8,
      }}
    >
      <span style={{ color: "var(--brand-700)", marginTop: 2, flexShrink: 0 }}>
        <Icon name="Check" size={16} />
      </span>
      <span>{text}</span>
    </li>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  const { t } = useTranslation();
  // TODO: replace with a real photo at /public/team/<slug>.jpg.
  // Falls back to Avatar (initials) until the file exists.
  const [broken, setBroken] = useState(false);
  const src = `/team/${member.slug}.jpg`;

  return (
    <div
      style={{
        textAlign: "center",
        padding: "24px 16px",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-default)",
        background: "var(--surface-0)",
        boxShadow: "var(--shadow-xs)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      {broken ? (
        <Avatar name={member.name} size={96} />
      ) : (
        <img
          src={src}
          alt={member.name}
          onError={() => setBroken(true)}
          style={{
            width: 96,
            height: 96,
            borderRadius: "9999px",
            objectFit: "cover",
            border: "1px solid var(--border-subtle)",
          }}
        />
      )}
      <div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 16,
            color: "var(--text-strong)",
            lineHeight: 1.3,
          }}
        >
          {member.name}
        </div>
        <div
          style={{
            fontFamily: "var(--font-text)",
            fontSize: 13,
            color: "var(--text-muted)",
            marginTop: 2,
          }}
        >
          {t(`about.roles.${member.roleKey}`)}
        </div>
      </div>
    </div>
  );
}

const h1Style = {
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  fontSize: "clamp(32px, 6vw, 48px)",
  letterSpacing: "-0.025em",
  lineHeight: 1.15,
  color: "var(--text-strong)",
  margin: "0 0 16px",
} as const;

const h2Style = {
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  fontSize: "clamp(22px, 4vw, 30px)",
  letterSpacing: "-0.02em",
  color: "var(--text-strong)",
  margin: "0 0 16px",
} as const;

const h3Style = {
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  fontSize: 18,
  letterSpacing: "-0.01em",
  color: "var(--text-strong)",
  margin: "0 0 10px",
} as const;

const leadStyle = {
  fontFamily: "var(--font-text)",
  fontSize: 17,
  lineHeight: 1.6,
  color: "var(--text-muted)",
  margin: 0,
} as const;

const paragraphStyle = {
  fontFamily: "var(--font-text)",
  fontSize: 15,
  lineHeight: 1.65,
  color: "var(--text-body)",
  margin: "0 0 14px",
} as const;

const listStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0,
} as const;
