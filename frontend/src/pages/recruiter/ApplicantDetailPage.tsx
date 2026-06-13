/**
 * Recruiter → Applicant detail. Reads the real application (student
 * profile + cover note + gig) via GET /gigs/applications/:id, and wires
 * Accept / Reject (PATCH status) and Message (start a conversation).
 */
import { useParams, useNavigate } from "react-router-dom";
import { Avatar, Badge, Button, Card, Tag, Skeleton, useToast } from "@shared/ui";
import type { BadgeTone } from "@shared/ui";
import { Icon } from "@shared/icons";
import { routes, recruiterConversationPath } from "@shared/config/routes";
import {
  useApplicant,
  useUpdateApplicationStatus,
  type ApplicationStatus,
} from "@features/applications";
import { useStartConversation } from "@features/messaging";
import { resolveImageUrl } from "@shared/lib/resolveImageUrl";

const STATUS_META: Record<ApplicationStatus, { tone: BadgeTone; label: string }> = {
  pending: { tone: "neutral", label: "Pending" },
  reviewing: { tone: "reviewing", label: "Reviewing" },
  accepted: { tone: "success", label: "Accepted" },
  rejected: { tone: "rejected", label: "Rejected" },
};

export default function ApplicantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { data, isLoading, isError } = useApplicant(id);
  const updateStatus = useUpdateApplicationStatus();
  const startConversation = useStartConversation();

  if (isLoading) {
    return (
      <div className="aav-page" style={{ maxWidth: 720 }}>
        <Skeleton width={160} height={12} />
        <div style={{ height: 20 }} />
        <Skeleton width={200} height={24} />
        <div style={{ height: 40 }} />
        <Skeleton width="100%" height={120} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="aav-page" style={{ maxWidth: 720 }}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Icon name="AlertCircle" size={20} style={{ color: "var(--danger-500)" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-text)", fontWeight: 600, color: "var(--text-strong)" }}>
                Applicant not found
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                This application may no longer be available.
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate(routes.recruiterApplicants)}>
              View Applicants
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const { applicant, gig } = data;
  const meta = STATUS_META[data.status];
  const banner = resolveImageUrl(applicant.bannerUrl ?? undefined);

  const setStatus = (status: ApplicationStatus) => {
    updateStatus.mutate(
      { id: data.id, status },
      {
        onSuccess: () => toast.success(`Applicant ${status}.`),
        onError: (e) => toast.error("Could not update", { description: e instanceof Error ? e.message : undefined }),
      },
    );
  };

  const message = () => {
    startConversation.mutate(applicant.id, {
      onSuccess: (conv) => navigate(recruiterConversationPath(conv.id)),
      onError: (e) => toast.error("Could not start chat", { description: e instanceof Error ? e.message : undefined }),
    });
  };

  return (
    <div className="aav-page" style={{ maxWidth: 720 }}>
      <button
        type="button"
        onClick={() => navigate(routes.recruiterApplicants)}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-text)",
          fontSize: 14,
          fontWeight: 600,
          color: "var(--brand-700)",
          padding: 0,
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Icon name="ArrowLeft" size={16} />
        Back to applicants
      </button>

      <Card padding={0} style={{ overflow: "hidden" }}>
        <div
          style={{
            height: 96,
            background: banner
              ? `url(${banner}) center/cover no-repeat`
              : "linear-gradient(120deg, var(--brand-700), var(--brand-500))",
          }}
        />
        <div style={{ padding: "0 28px 28px" }}>
          <div style={{ display: "flex", gap: 20, marginTop: -28 }}>
            <Avatar
              src={applicant.avatarUrl ?? undefined}
              name={applicant.fullName}
              size={72}
              shape="squircle"
              style={{ border: "3px solid var(--surface-0)" }}
            />
            <div style={{ flex: 1, paddingTop: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26, color: "var(--text-strong)", margin: 0 }}>
                  {applicant.fullName}
                </h1>
                {applicant.verified && <Badge tone="success">Verified</Badge>}
                <Badge tone={meta.tone}>{meta.label}</Badge>
              </div>
              <div style={{ fontFamily: "var(--font-text)", fontSize: 15, color: "var(--text-muted)", marginTop: 4 }}>
                {applicant.headline || "Aavasar Student"} · Applied for{" "}
                <strong style={{ color: "var(--text-strong)" }}>{gig.title}</strong>
              </div>
            </div>
          </div>

          {applicant.bio && (
            <div style={{ marginTop: 20 }}>
              <h3 style={sectionHeading}>About</h3>
              <p style={{ fontFamily: "var(--font-text)", fontSize: 15, lineHeight: 1.7, color: "var(--text-muted)", margin: 0, whiteSpace: "pre-wrap" }}>
                {applicant.bio}
              </p>
            </div>
          )}

          {applicant.skills.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <h3 style={sectionHeading}>Skills</h3>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {applicant.skills.map((s) => <Tag key={s}>{s}</Tag>)}
              </div>
            </div>
          )}

          {data.coverNote && (
            <div style={{ marginTop: 20 }}>
              <h3 style={sectionHeading}>Cover note</h3>
              <p
                style={{
                  fontFamily: "var(--font-text)",
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: "var(--text-muted)",
                  margin: 0,
                  padding: "12px 14px",
                  background: "var(--surface-1)",
                  borderRadius: "var(--radius-sm)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {data.coverNote}
              </p>
            </div>
          )}

          <div style={{ display: "flex", gap: 12, borderTop: "1px solid var(--border-subtle)", paddingTop: 20, marginTop: 24 }}>
            {data.status !== "accepted" && (
              <Button variant="primary" disabled={updateStatus.isPending} onClick={() => setStatus("accepted")}>
                Accept
              </Button>
            )}
            {data.status !== "rejected" && (
              <Button variant="danger" disabled={updateStatus.isPending} onClick={() => setStatus("rejected")}>
                Reject
              </Button>
            )}
            <Button
              variant="outline"
              iconLeft={<Icon name="Mail" size={15} />}
              disabled={startConversation.isPending}
              onClick={message}
            >
              Message
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

const sectionHeading = {
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  fontSize: 14,
  color: "var(--text-strong)",
  margin: "0 0 10px",
} as const;
