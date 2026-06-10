import { useNavigate } from "react-router-dom";
import { Avatar, Badge, Button, Card, ProgressBar, Skeleton, StatCard, Tag, type BadgeTone } from "@shared/ui";
import { Icon } from "@shared/icons";
import { useRecruiterDashboard } from "@features/dashboard";
import { useRecruiterPipeline, type GigStatus } from "@features/gigs";
import { useCurrentUser } from "@features/auth";
import { formatShort, formatFull } from "@shared/lib/utils";
import { applicantPath, gigPath, routes } from "@shared/config/routes";

const SKEL_VALUE = <Skeleton width={72} height={28} radius="var(--radius-sm)" />;

/**
 * Maps the GigStatus domain enum onto Badge tones. Two domain states
 * (`completed`, `rejected`) reuse existing tones rather than introducing
 * one-off colors that don't yet exist in the DS palette.
 */
const STATUS_TO_TONE: Record<GigStatus, BadgeTone> = {
  active: "active",
  submitted: "submitted",
  reviewing: "reviewing",
  draft: "draft",
  completed: "success",
  rejected: "rejected",
};

const STATUS_LABEL: Record<GigStatus, string> = {
  active: "Active",
  submitted: "Submitted",
  reviewing: "Reviewing",
  draft: "Draft",
  completed: "Completed",
  rejected: "Rejected",
};

export default function RecruiterDashboardPage() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const { kpis, applicants } = useRecruiterDashboard();
  const { data: pipeline = [] } = useRecruiterPipeline();
  const firstName = user?.fullName.split(" ")[0] ?? "Sushma";
  const top = applicants.data?.[0];

  return (
    <div style={{ padding: "32px 40px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 28,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 38,
              color: "var(--text-strong)",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Welcome back, {firstName}!
          </h1>
          <p
            style={{
              fontFamily: "var(--font-text)",
              fontSize: 16,
              color: "var(--text-muted)",
              margin: "4px 0 0",
            }}
          >
            Today is {formatFull(new Date().toISOString())}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex" }}>
            {["Aayush", "Binod", "Isha"].map((n, i) => (
              <span key={n} style={{ marginLeft: i ? -10 : 0 }}>
                <Avatar
                  name={n}
                  size={36}
                  style={{ border: "2px solid var(--surface-page)" }}
                />
              </span>
            ))}
            <span
              style={{
                marginLeft: -10,
                width: 36,
                height: 36,
                borderRadius: "9999px",
                background: "var(--surface-2)",
                border: "2px solid var(--surface-page)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-text)",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-muted)",
              }}
            >
              +12
            </span>
          </div>
          <span
            style={{
              fontFamily: "var(--font-text)",
              fontSize: 14,
              color: "var(--text-muted)",
            }}
          >
            Recent applicants for UX Researcher
          </span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <StatCard
          label="Active Gigs"
          value={kpis.data?.activeGigs.toString() ?? SKEL_VALUE}
          delta={kpis.data?.activeGigsDelta}
          icon={<Icon name="Briefcase" />}
          iconTone="slate"
        />
        <StatCard
          label="New Applicants"
          value={kpis.data?.newApplicants.toString() ?? SKEL_VALUE}
          delta={kpis.data?.newApplicantsDelta}
          icon={<Icon name="UserPlus" />}
          iconTone="info"
        />
        <StatCard
          label="Pending Interviews"
          value={kpis.data?.pendingInterviews.toString() ?? SKEL_VALUE}
          delta={kpis.data?.pendingInterviewsNext}
          deltaTone="neutral"
          icon={<Icon name="Calendar" />}
          iconTone="earth"
        />
        <StatCard
          label="Total Hired"
          value={kpis.data?.totalHired.toString() ?? SKEL_VALUE}
          delta="Total"
          deltaTone="neutral"
          icon={<Icon name="CheckCircle" />}
          iconTone="success"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: 28 }}>
        <Card padding={0}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 24px",
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 20,
                color: "var(--text-strong)",
                margin: 0,
              }}
            >
              Active Gigs
            </h2>
            <button
              type="button"
              onClick={() => navigate(routes.recruiterMyGigs)}
              style={{
                fontFamily: "var(--font-text)",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--brand-700)",
                textDecoration: "none",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              View All →
            </button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Gig Title", "Date Posted", "Applicants", "Status"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "12px 24px",
                      fontFamily: "var(--font-text)",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: "var(--text-subtle)",
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pipeline.map((g) => (
                <tr
                  key={g.id}
                  onClick={() => navigate(gigPath(g.id))}
                  style={{ cursor: "pointer" }}
                >
                  <td
                    style={{
                      padding: "16px 24px",
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-text)",
                        fontWeight: 600,
                        fontSize: 15,
                        color: "var(--text-strong)",
                      }}
                    >
                      {g.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-text)",
                        fontSize: 13,
                        color: "var(--text-subtle)",
                      }}
                    >
                      {g.subtitle}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "16px 24px",
                      borderBottom: "1px solid var(--border-subtle)",
                      fontFamily: "var(--font-text)",
                      fontSize: 14,
                      color: "var(--text-muted)",
                    }}
                  >
                    {formatShort(g.postedAt)}
                  </td>
                  <td
                    style={{
                      padding: "16px 24px",
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: 16,
                          color: "var(--text-strong)",
                        }}
                      >
                        {g.applicantCount}
                      </span>
                      <div style={{ width: 70 }}>
                        <ProgressBar value={g.applicantFillPct} height={6} />
                      </div>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "16px 24px",
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    <Badge tone={STATUS_TO_TONE[g.status]}>
                      {STATUS_LABEL[g.status]}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card style={{ padding: 0 }}>
          <div style={{ padding: "20px 22px 12px" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 20,
                color: "var(--text-strong)",
                margin: 0,
              }}
            >
              New Applicants
            </h2>
            <p
              style={{
                fontFamily: "var(--font-text)",
                fontSize: 13,
                color: "var(--text-subtle)",
                margin: "2px 0 0",
              }}
            >
              Review top student talent
            </p>
          </div>
          <div style={{ padding: "0 22px" }}>
            {top && (
              <div
                style={{
                  border: "1px solid var(--border-default)",
                  borderRadius: "var(--radius-md)",
                  padding: 16,
                  cursor: "pointer",
                }}
                onClick={() => navigate(applicantPath(top.id))}
              >
                <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                  <Avatar name={top.fullName} size={48} shape="squircle" />
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-text)",
                        fontWeight: 700,
                        fontSize: 15,
                        color: "var(--text-strong)",
                      }}
                    >
                      {top.fullName}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-text)",
                        fontSize: 13,
                        color: "var(--text-muted)",
                      }}
                    >
                      {top.appliedFor}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                  {top.skills.map((s) => <Tag key={s}>{s}</Tag>)}
                </div>
                <Button
                  variant="primary"
                  full
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(applicantPath(top.id));
                  }}
                >
                  View Profile
                </Button>
              </div>
            )}
            {(applicants.data ?? []).slice(1).map((a) => (
              <div
                key={a.id}
                onClick={() => navigate(applicantPath(a.id))}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 0",
                  borderBottom: "1px dashed var(--border-default)",
                  cursor: "pointer",
                }}
              >
                <Avatar name={a.fullName} size={40} />
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-text)",
                      fontWeight: 600,
                      fontSize: 14,
                      color: "var(--text-strong)",
                    }}
                  >
                    {a.fullName}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-text)",
                      fontSize: 13,
                      color: "var(--text-subtle)",
                    }}
                  >
                    {a.appliedFor}
                  </div>
                </div>
              </div>
            ))}
            <div style={{ textAlign: "center", padding: "14px 0 18px" }}>
              <button
                type="button"
                onClick={() => navigate(routes.recruiterApplicants)}
                style={{
                  fontFamily: "var(--font-text)",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--brand-700)",
                  textDecoration: "none",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                View 18 more applicants
              </button>
            </div>
          </div>
        </Card>
      </div>

      <div
        style={{
          marginTop: 28,
          borderRadius: "var(--radius-lg)",
          background:
            "linear-gradient(135deg, var(--brand-700), var(--brand-900))",
          padding: "32px 36px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 32,
        }}
      >
        <div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 22,
              color: "#fff",
              margin: "0 0 8px",
            }}
          >
            Talent Pulse: October Report
          </h3>
          <p
            style={{
              fontFamily: "var(--font-text)",
              fontSize: 15,
              lineHeight: 1.6,
              color: "var(--brand-200)",
              margin: 0,
              maxWidth: 620,
            }}
          >
            Student interest in your active gigs has increased by 24% compared to
            last month. Use our new &lsquo;Instant Interview&rsquo; feature to connect with
            top performers faster. Hiring costs estimated at NPR 45,000 per
            placement.
          </p>
        </div>
        <Button
          onDark
          variant="primary"
          size="lg"
          style={{ flexShrink: 0 }}
          onClick={() => navigate(routes.recruiterReports)}
        >
          Explore Reports
        </Button>
      </div>
    </div>
  );
}
