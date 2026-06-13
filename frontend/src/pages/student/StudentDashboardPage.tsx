/**
 * Student Hub dashboard. Pulls dashboard slice data through the
 * 6-layer pipeline (hook → use case → service → transport → contract).
 */
import { useNavigate } from "react-router-dom";
import { Avatar, Badge, Button, Card, ProgressBar, Skeleton, StatCard } from "@shared/ui";
import { Icon } from "@shared/icons";
import { useCurrentUser } from "@features/auth";
import { useStudentDashboard } from "@features/dashboard";
import { formatNpr, splitDayMonth } from "@shared/lib/utils";
import { routes, gigPath } from "@shared/config/routes";

const SKEL_VALUE = <Skeleton width={96} height={28} radius="var(--radius-sm)" />;

export default function StudentDashboardPage() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const { kpis, activeGigs, upcoming, course } = useStudentDashboard();

  const firstName = user?.fullName.split(" ")[0] ?? "there";

  return (
    <div className="aav-page" style={{ maxWidth: 1180 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Avatar
            src={user?.avatarUrl}
            name={user?.fullName}
            size={64}
            shape="squircle"
          />
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(26px, 5vw, 38px)",
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
              Your profile is 85% complete. Add your latest project to stand out.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          iconLeft={<Icon name="Settings" size={16} />}
          onClick={() => navigate(routes.studentProfileEdit)}
        >
          Edit Profile
        </Button>
      </div>

      {/* KPI strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <StatCard
          label="Total Earnings"
          value={kpis.data ? formatNpr(kpis.data.totalEarnings) : SKEL_VALUE}
          icon={<Icon name="Banknote" />}
          iconTone="success"
        />
        <StatCard
          label="Active Gigs"
          value={kpis.data?.activeGigs?.toString() ?? SKEL_VALUE}
          icon={<Icon name="Rocket" />}
          iconTone="info"
        />
        <StatCard
          label="Applications"
          value={kpis.data?.applications?.toString() ?? SKEL_VALUE}
          icon={<Icon name="FileText" />}
          iconTone="soft"
        />
        <StatCard
          label="Avg Rating"
          value={
            kpis.data ? `${kpis.data.averageRating.toFixed(1)}/5` : SKEL_VALUE
          }
          icon={<Icon name="Star" />}
          iconTone="soft"
        />
      </div>

      {/* Two columns */}
      <div className="aav-split">
        {/* Left column */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 14,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 22,
                color: "var(--text-strong)",
                margin: 0,
              }}
            >
              Active Gigs
            </h2>
            <button
              type="button"
              onClick={() => navigate(routes.studentMyGigs)}
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
              View All
            </button>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              marginBottom: 28,
            }}
          >
            {activeGigs.isLoading &&
              [0, 1].map((i) => (
                <Card key={`skel-${i}`}>
                  <Skeleton width="60%" height={18} />
                  <div style={{ height: 8 }} />
                  <Skeleton width="40%" height={14} />
                  <div style={{ height: 18 }} />
                  <Skeleton width="100%" height={14} />
                </Card>
              ))}
            {(activeGigs.data ?? []).map((g) => (
              <Card
                key={g.id}
                interactive
                onClick={() => navigate(gigPath(g.id))}
                style={{ cursor: "pointer" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 14,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: 18,
                        color: "var(--text-strong)",
                      }}
                    >
                      {g.title}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontFamily: "var(--font-text)",
                        fontSize: 14,
                        color: "var(--text-muted)",
                        marginTop: 4,
                      }}
                    >
                      <Icon name="Building2" size={15} />
                      {g.company}
                    </div>
                  </div>
                  <Badge tone={g.status}>{g.statusLabel}</Badge>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid var(--border-subtle)",
                    paddingTop: 14,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-text)",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--text-body)",
                    }}
                  >
                    {g.milestone}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 22,
                      color: "var(--text-strong)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {formatNpr(g.amount)}
                  </span>
                </div>
              </Card>
            ))}
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 22,
              color: "var(--text-strong)",
              margin: "0 0 14px",
            }}
          >
            Recommended for You
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            <Card
              tone="dark"
              interactive
              onClick={() => navigate(routes.studentFindWork)}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 200,
                cursor: "pointer",
              }}
            >
              <div>
                <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                  {["REACT", "FIGMA"].map((t) => (
                    <span
                      key={t}
                      style={{
                        fontFamily: "var(--font-text)",
                        fontSize: 11,
                        fontWeight: 600,
                        background: "rgba(255,255,255,0.16)",
                        color: "#fff",
                        padding: "3px 8px",
                        borderRadius: "var(--radius-xs)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 22,
                    color: "#fff",
                    lineHeight: 1.15,
                  }}
                >
                  UX/UI Designer for FinTech Startup
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-text)",
                    fontSize: 14,
                    color: "var(--brand-200)",
                    marginTop: 8,
                  }}
                >
                  Remote · 20h/week
                </div>
              </div>
              <Button
                onDark
                variant="primary"
                full
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(routes.studentFindWork);
                }}
              >
                Apply Now
              </Button>
            </Card>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Card
                interactive
                onClick={() => navigate(routes.studentFindWork)}
                style={{ cursor: "pointer" }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 16,
                    color: "var(--text-strong)",
                    marginBottom: 8,
                  }}
                >
                  Python Scripting for Data Cleanup
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-text)",
                      fontWeight: 700,
                      fontSize: 15,
                      color: "var(--success-600)",
                    }}
                  >
                    NPR 4,000/hr
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-text)",
                      fontSize: 13,
                      color: "var(--text-subtle)",
                    }}
                  >
                    3 days ago
                  </span>
                </div>
              </Card>
              <Card
                interactive
                onClick={() => navigate(routes.studentFindWork)}
                style={{ cursor: "pointer" }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 16,
                    color: "var(--text-strong)",
                    marginBottom: 8,
                  }}
                >
                  Market Research: Gen Z Trends
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-text)",
                      fontWeight: 700,
                      fontSize: 15,
                      color: "var(--success-600)",
                    }}
                  >
                    NPR 20,000 Fixed
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-text)",
                      fontSize: 13,
                      color: "var(--text-subtle)",
                    }}
                  >
                    New
                  </span>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Right rail */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Card style={{ padding: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 14,
              }}
            >
              <Icon name="Calendar" size={18} style={{ color: "var(--brand-700)" }} />
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 18,
                  color: "var(--text-strong)",
                }}
              >
                Upcoming
              </span>
            </div>
            {(upcoming.data ?? []).map((u) => {
              const dm = splitDayMonth(u.occursAt);
              return (
                <div
                  key={u.id}
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "center",
                    border: "1px solid var(--border-default)",
                    borderRadius: "var(--radius-sm)",
                    padding: "12px 14px",
                    marginBottom: 10,
                  }}
                >
                  <div style={{ textAlign: "center", minWidth: 36 }}>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: 20,
                        color: "var(--text-strong)",
                        lineHeight: 1,
                      }}
                    >
                      {dm.day}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-text)",
                        fontSize: 11,
                        color: "var(--text-subtle)",
                      }}
                    >
                      {dm.month}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-text)",
                        fontWeight: 600,
                        fontSize: 14,
                        color: "var(--text-strong)",
                      }}
                    >
                      {u.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-text)",
                        fontSize: 13,
                        color: "var(--text-muted)",
                      }}
                    >
                      {u.subtitle}
                    </div>
                  </div>
                </div>
              );
            })}
          </Card>

          {course.data && (
            <Card tone="earth" style={{ padding: 20 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-text)",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.8)",
                    background: "rgba(255,255,255,0.16)",
                    padding: "4px 8px",
                    borderRadius: "var(--radius-xs)",
                  }}
                >
                  Course in Progress
                </span>
                <Icon
                  name="GraduationCap"
                  size={20}
                  style={{ color: "rgba(255,255,255,0.85)" }}
                />
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 20,
                  color: "#fff",
                  marginBottom: 12,
                }}
              >
                {course.data.title}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "var(--font-text)",
                  fontSize: 13,
                  color: "#fff",
                  marginBottom: 6,
                }}
              >
                <span>Progress</span>
                <span>{course.data.progress}%</span>
              </div>
              <ProgressBar value={course.data.progress} onDark height={8} />
              <Button
                onDark
                variant="primary"
                full
                style={{ marginTop: 16 }}
                onClick={() => navigate(routes.studentLearning)}
              >
                Resume Course
              </Button>
            </Card>
          )}

          <button
            type="button"
            onClick={() => navigate(routes.studentPeerNetwork)}
            style={{
              position: "relative",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              minHeight: 150,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: 18,
              background: "var(--brand-900)",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              font: "inherit",
              color: "inherit",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "url(/photos/hero-a.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(0deg, rgba(18,28,36,0.92) 0%, rgba(18,28,36,0.55) 55%, rgba(18,28,36,0.15) 100%)",
              }}
            />
            <div style={{ position: "relative" }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 18,
                  color: "#fff",
                }}
              >
                Join the Peer Network
              </div>
              <div
                style={{
                  fontFamily: "var(--font-text)",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                Connect with 500+ students on campus
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
