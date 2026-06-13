/**
 * Student → My Gigs — every gig the student applied to, with its status.
 * Backed by the existing useMyApplications hook (GET /gigs/applied).
 */
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Card, SegmentedControl, Skeleton } from "@shared/ui";
import type { BadgeTone } from "@shared/ui";
import { Icon } from "@shared/icons";
import { useMyApplications, type ApplicationStatus } from "@features/applications";
import { formatNprFixed, formatRupeeRate, formatShort } from "@shared/lib/utils";
import { routes, studentGigPath } from "@shared/config/routes";

type StatusFilter = "all" | ApplicationStatus;

const STATUS_META: Record<ApplicationStatus, { tone: BadgeTone; label: string }> = {
  pending: { tone: "neutral", label: "Pending" },
  reviewing: { tone: "reviewing", label: "Reviewing" },
  accepted: { tone: "success", label: "Accepted" },
  rejected: { tone: "rejected", label: "Rejected" },
};

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "reviewing", label: "Reviewing" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

export default function StudentMyGigsPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useMyApplications();
  const [filter, setFilter] = useState<StatusFilter>("all");

  const apps = data ?? [];
  const rows = useMemo(
    () => (filter === "all" ? apps : apps.filter((a) => a.status === filter)),
    [apps, filter],
  );

  return (
    <div className="aav-page" style={{ maxWidth: 1000 }}>
      <div style={{ marginBottom: 24 }}>
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
          My Gigs
        </h1>
        <p style={{ fontFamily: "var(--font-text)", fontSize: 16, color: "var(--text-muted)", margin: "4px 0 0" }}>
          Track the gigs you&apos;ve applied to and their status.
        </p>
      </div>

      {!isLoading && apps.length > 0 && (
        <div style={{ maxWidth: 520, marginBottom: 20 }}>
          <SegmentedControl<StatusFilter> value={filter} onChange={setFilter} options={FILTERS} />
        </div>
      )}

      {isError ? (
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Icon name="AlertCircle" size={20} style={{ color: "var(--danger-500)" }} />
            <div style={{ flex: 1, fontFamily: "var(--font-text)", fontWeight: 600, color: "var(--text-strong)" }}>
              Couldn&apos;t load your gigs
            </div>
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </Card>
      ) : isLoading ? (
        <div style={{ display: "grid", gap: 12 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <Skeleton width="40%" height={18} />
              <div style={{ height: 10 }} />
              <Skeleton width="25%" height={14} />
            </Card>
          ))}
        </div>
      ) : apps.length === 0 ? (
        <Card>
          <div style={{ textAlign: "center", padding: "40px 16px" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "var(--radius-md)",
                background: "var(--surface-2)",
                color: "var(--ink-500)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Icon name="Briefcase" size={26} />
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-strong)", marginBottom: 6 }}>
              No applications yet
            </div>
            <div style={{ fontFamily: "var(--font-text)", fontSize: 14, color: "var(--text-muted)", marginBottom: 20 }}>
              Browse open gigs and apply — they&apos;ll show up here.
            </div>
            <Button variant="primary" iconLeft={<Icon name="Search" size={16} />} onClick={() => navigate(routes.studentFindWork)}>
              Find Work
            </Button>
          </div>
        </Card>
      ) : rows.length === 0 ? (
        <Card>
          <div style={{ textAlign: "center", padding: "32px 16px", fontFamily: "var(--font-text)", color: "var(--text-muted)" }}>
            No {filter} applications.
          </div>
        </Card>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {rows.map((a) => {
            const meta = STATUS_META[a.status];
            const rate =
              a.gig.payKind === "fixed" ? formatNprFixed(a.gig.pay) : formatRupeeRate(a.gig.pay.amountMinor, "hr");
            return (
              <Card key={a.id} interactive onClick={() => navigate(studentGigPath(a.gig.id))} style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--text-strong)" }}>
                        {a.gig.title}
                      </span>
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 14, fontFamily: "var(--font-text)", fontSize: 13, color: "var(--text-subtle)" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                        <Icon name="Building" size={14} />
                        {a.gig.company?.name ?? "Individual recruiter"}
                      </span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                        <Icon name="MapPin" size={14} />
                        {a.gig.location === "remote" ? "Remote" : a.gig.location === "onsite" ? "On-site" : "Hybrid"}
                      </span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                        <Icon name="Calendar" size={14} />
                        Applied {formatShort(a.createdAt)}
                      </span>
                    </div>
                  </div>
                  <span style={{ fontFamily: "var(--font-text)", fontWeight: 700, fontSize: 15, color: "var(--success-600)", whiteSpace: "nowrap" }}>
                    {rate}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
