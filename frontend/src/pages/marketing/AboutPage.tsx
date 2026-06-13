import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Card } from "@shared/ui";
import { Icon, type IconName } from "@shared/icons";
import { routes } from "@shared/config/routes";

interface TeamMember {
  name: string;
  role: string;
  /** Public photo filename (under /public/team/). */
  slug: string;
}

// TODO: replace placeholder photos at /public/team/<slug>.jpg with real headshots.
const TEAM: ReadonlyArray<TeamMember> = [
  { name: "Raunak Regmi", role: "CEO / Founder", slug: "raunak-regmi" },
  { name: "Samikshya Dhamala", role: "Co-Founder", slug: "samikshya-dhamala" },
  { name: "Unika Ghimire", role: "Co-Founder", slug: "unika-ghimire" },
  { name: "Pratikshya Ghimire", role: "Co-Founder", slug: "pratikshya-ghimire" },
  { name: "Shreya Bhatta", role: "Co-Founder", slug: "shreya-bhatta" },
];

interface Pillar {
  icon: IconName;
  title: string;
  body: string;
}

const PILLARS: ReadonlyArray<Pillar> = [
  {
    icon: "GraduationCap",
    title: "Built for Nepali students",
    body: "Aavasar is designed around how students in Nepal actually work — flexible hours, gigs that fit a class schedule, and pay in NPR with no foreign-exchange friction.",
  },
  {
    icon: "ShieldCheck",
    title: "Vetted on both sides",
    body: "Every student profile is reviewed before it goes live, and recruiters verify their company before posting. Trust is the product.",
  },
  {
    icon: "Zap",
    title: "Hire in days, not months",
    body: "Recruiters post a gig, see qualified applicants the same day, and message candidates directly. No agencies, no inflated fees.",
  },
];

export default function AboutPage() {
  const navigate = useNavigate();

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
          About Aavasar
        </span>
        <h1 style={h1Style}>
          Connecting Nepali student talent with the work that matters
        </h1>
        <p style={leadStyle}>
          Aavasar is a marketplace where students earn real money and real experience while
          businesses across Nepal hire vetted, motivated talent — quickly, transparently, and
          at a fair price.
        </p>
      </section>

      {/* ---- Story ---- */}
      <section style={{ maxWidth: 880, margin: "0 auto 72px" }}>
        <div className="aav-split" style={{ alignItems: "center" }}>
          <div>
            <h2 style={h2Style}>Our story</h2>
            <p style={paragraphStyle}>
              Aavasar started with a simple frustration: Nepal is full of skilled,
              ambitious students — and businesses that desperately need their skills — but
              the two sides almost never meet at the right time.
            </p>
            <p style={paragraphStyle}>
              Students were stuck choosing between unpaid internships and gigs that didn't
              fit their schedule. Recruiters were posting to noisy job boards and waiting
              weeks for a single qualified applicant. We built Aavasar to close that gap.
            </p>
            <p style={paragraphStyle}>
              Today, students join free, build a verified portfolio, and apply to paid
              gigs that match their skills. Recruiters post a role, screen applicants the
              same day, and message the right person directly — no middlemen, no surprises.
            </p>
          </div>
          <Card tone="well" padding={28}>
            <h3 style={h3Style}>Our mission</h3>
            <p style={{ ...paragraphStyle, marginBottom: 16 }}>
              Make professional work-experience accessible to every Nepali student, and
              make hiring vetted talent a same-week decision for every Nepali business.
            </p>
            <ul style={listStyle}>
              <MissionRow text="Students earn while they study and graduate with a real portfolio." />
              <MissionRow text="Recruiters hire vetted talent in days, not months — at a fair price." />
              <MissionRow text="Every transaction is transparent, in NPR, and protected." />
            </ul>
          </Card>
        </div>
      </section>

      {/* ---- What's different ---- */}
      <section style={{ maxWidth: 1040, margin: "0 auto 72px" }}>
        <header style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={h2Style}>What's different about Aavasar</h2>
          <p style={{ ...leadStyle, maxWidth: 600, margin: "0 auto" }}>
            We're not a generic job board. Every feature is designed for the way Nepali
            students and recruiters actually work.
          </p>
        </header>
        <div className="aav-grid-3">
          {PILLARS.map((p) => (
            <Card key={p.title} padding={28}>
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
              <h3 style={h3Style}>{p.title}</h3>
              <p style={{ ...paragraphStyle, marginBottom: 0 }}>{p.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ---- Team ---- */}
      <section style={{ maxWidth: 1040, margin: "0 auto 72px" }}>
        <header style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={h2Style}>Meet the team</h2>
          <p style={{ ...leadStyle, maxWidth: 600, margin: "0 auto" }}>
            A small founding team based in Kathmandu, building Aavasar from the ground up.
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
            <h2
              style={{
                ...h2Style,
                color: "#fff",
                margin: 0,
              }}
            >
              Ready to be part of it?
            </h2>
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
              Join thousands of students and recruiters who are already using Aavasar to
              get work done across Nepal.
            </p>
            <div
              className="aav-row-wrap"
              style={{ justifyContent: "center", marginTop: 8 }}
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate(routes.signUp)}
              >
                Sign up free
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate(routes.contact)}
              >
                Talk to us
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
          {member.role}
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
