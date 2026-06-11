/**
 * Recruiter → Applicants (per-gig view).
 *
 * Pick one of your gigs, then review everyone who applied: filter by
 * status, read their cover note, accept/reject, open the full profile,
 * or message them. Built on the real applications API (the recruiter
 * dashboard's applicant widget uses unimplemented endpoints).
 */
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Badge, Button, Card, Chip, Skeleton, Tag, useToast } from "@shared/ui";
import type { BadgeTone } from "@shared/ui";
import { Icon } from "@shared/icons";
import { useMyGigs } from "@features/gigs";
import {
  useGigApplicants,
  useUpdateApplicationStatus,
  type ApplicationStatus,
} from "@features/applications";
import { useStartConversation } from "@features/messaging";
import { applicantPath, recruiterConversationPath } from "@shared/config/routes";
import { formatShort } from "@shared/lib/utils";
// NOTE: messaging wiring (useStartConversation, recruiterConversationPath)
// is delivered in Phase 4; this page imports them so the "Message" action
// is live as soon as the messaging feature lands.

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

export default function RecruiterApplicantsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const gigs = useMyGigs();
  const [gigId, setGigId] = useState<string>("");
  const [filter, setFilter] = useState<StatusFilter>("all");

  // Default to the first gig once gigs load.
  useEffect(() => {
    if (!gigId && gigs.data?.items.length) setGigId(gigs.data.items[0].id);
  }, [gigs.data, gigId]);

  const applicants = useGigApplicants(gigId || undefined);
  const updateStatus = useUpdateApplicationStatus();
  const startConversation = useStartConversation();

  const rows = useMemo(() => {
    const all = applicants.data?.items ?? [];
    return filter === "all" ? all : all.filter((a) => a.status === filter);
  }, [applicants.data, filter]);

  const setStatus = (id: string, status: ApplicationStatus) => {
    updateStatus.mutate(
      { id, status },
      {
        onSuccess: () => toast.success(`Applicant ${status}.`),
        onError: (e) =>
          toast.error("Could not update", {
            description: e instanceof Error ? e.message : undefined,
          }),
      },
    );
  };

  const message = (studentId: string) => {
    startConversation.mutate(studentId, {
      onSuccess: (conv) => navigate(recruiterConversationPath(conv.id)),
      onError: (e) =>
        toast.error("Could not start chat", {
          description: e instanceof Error ? e.message : undefined,
        }),
    });
  };

  const gigItems = gigs.data?.items ?? [];

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1000 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
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
          Applicants
        </h1>
        <p style={{ fontFamily: "var(--font-text)", fontSize: 16, color: "var(--text-muted)", margin: "4px 0 0" }}>
          Review and respond to students who applied to your gigs.
        </p>
      </div>

      {gigs.isLoading ? (
        <Skeleton width={280} height={40} />
      ) : gigItems.length === 0 ? (
        <Card>
          <div style={{ textAlign: "center", padding: "40px 16px" }}>
            <Icon name="Inbox" size={26} style={{ color: "var(--text-muted)" }} />
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 18,
                color: "var(--text-strong)",
                margin: "12px 0 4px",
              }}
            >
              No gigs yet
            </div>
            <div style={{ fontFamily: "var(--font-text)", fontSize: 14, color: "var(--text-muted)" }}>
              Post a gig to start receiving applicants.
            </div>
          </div>
        </Card>
      ) : (
        <>
          {/* Gig picker + status filters */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", marginBottom: 20 }}>
            <select
              value={gigId}
              onChange={(e) => setGigId(e.target.value)}
              style={{
                fontFamily: "var(--font-text)",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text-strong)",
                background: "var(--surface-0)",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-sm)",
                padding: "10px 14px",
                minWidth: 280,
                outline: "none",
                cursor: "pointer",
              }}
            >
              {gigItems.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {FILTERS.map((f) => (
                <Chip key={f.value} label={f.label} on={filter === f.value} onClick={() => setFilter(f.value)} />
              ))}
            </div>
          </div>

          {/* Applicants list */}
          {applicants.isLoading ? (
            <div style={{ display: "grid", gap: 12 }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <div style={{ display: "flex", gap: 14 }}>
                    <Skeleton width={48} height={48} radius={9999} />
                    <div style={{ flex: 1 }}>
                      <Skeleton width="40%" height={16} />
                      <div style={{ height: 8 }} />
                      <Skeleton width="60%" height={12} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : rows.length === 0 ? (
            <Card>
              <div style={{ textAlign: "center", padding: "40px 16px" }}>
                <Icon name="Users" size={26} style={{ color: "var(--text-muted)" }} />
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 18,
                    color: "var(--text-strong)",
                    margin: "12px 0 4px",
                  }}
                >
                  No applicants {filter !== "all" ? `(${filter})` : "yet"}
                </div>
                <div style={{ fontFamily: "var(--font-text)", fontSize: 14, color: "var(--text-muted)" }}>
                  Applicants for this gig will appear here.
                </div>
              </div>
            </Card>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {rows.map((a) => {
                const meta = STATUS_META[a.status];
                const busy = updateStatus.isPending;
                return (
                  <Card key={a.id}>
                    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <Avatar src={a.applicant.avatarUrl ?? undefined} name={a.applicant.fullName} size={48} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <button
                            type="button"
                            onClick={() => navigate(applicantPath(a.id))}
                            style={{
                              all: "unset",
                              cursor: "pointer",
                              fontFamily: "var(--font-display)",
                              fontWeight: 700,
                              fontSize: 16,
                              color: "var(--text-strong)",
                            }}
                          >
                            {a.applicant.fullName}
                          </button>
                          {a.applicant.verified && <Badge tone="success">Verified</Badge>}
                          <Badge tone={meta.tone}>{meta.label}</Badge>
                          <span style={{ marginLeft: "auto", fontFamily: "var(--font-text)", fontSize: 12, color: "var(--text-subtle)" }}>
                            {formatShort(a.createdAt)}
                          </span>
                        </div>
                        {a.applicant.headline && (
                          <div style={{ fontFamily: "var(--font-text)", fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
                            {a.applicant.headline}
                          </div>
                        )}
                        {a.applicant.skills.length > 0 && (
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                            {a.applicant.skills.slice(0, 6).map((s) => (
                              <Tag key={s}>{s}</Tag>
                            ))}
                          </div>
                        )}
                        {a.coverNote && (
                          <p
                            style={{
                              fontFamily: "var(--font-text)",
                              fontSize: 14,
                              lineHeight: 1.5,
                              color: "var(--text-muted)",
                              margin: "10px 0 0",
                              padding: "10px 12px",
                              background: "var(--surface-1)",
                              borderRadius: "var(--radius-sm)",
                            }}
                          >
                            {a.coverNote}
                          </p>
                        )}
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
                          {a.status !== "accepted" && (
                            <Button size="sm" variant="primary" disabled={busy} onClick={() => setStatus(a.id, "accepted")}>
                              Accept
                            </Button>
                          )}
                          {a.status !== "rejected" && (
                            <Button size="sm" variant="danger" disabled={busy} onClick={() => setStatus(a.id, "rejected")}>
                              Reject
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            iconLeft={<Icon name="Mail" size={14} />}
                            disabled={startConversation.isPending}
                            onClick={() => message(a.applicant.id)}
                          >
                            Message
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => navigate(applicantPath(a.id))}>
                            View profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
