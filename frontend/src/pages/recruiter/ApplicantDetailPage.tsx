import { useParams, useNavigate } from "react-router-dom";
import { Avatar, Button, Card, Tag, Skeleton, useToast } from "@shared/ui";
import { Icon } from "@shared/icons";
import { routes } from "@shared/config/routes";
import { useRecruiterDashboard } from "@features/dashboard";

export default function ApplicantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { applicants } = useRecruiterDashboard();
  const applicant = (applicants.data ?? []).find((a) => a.id === id);

  if (applicants.isLoading) {
    return (
      <div style={{ padding: "32px 40px", maxWidth: 720 }}>
        <Skeleton width={160} height={12} />
        <div style={{ height: 20 }} />
        <Skeleton width={200} height={24} />
        <div style={{ height: 40 }} />
        <Skeleton width="100%" height={120} />
      </div>
    );
  }

  if (!applicant) {
    return (
      <div style={{ padding: "32px 40px", maxWidth: 720 }}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Icon name="AlertCircle" size={20} style={{ color: "var(--danger-500)" }} />
            <div>
              <div style={{ fontFamily: "var(--font-text)", fontWeight: 600, color: "var(--text-strong)" }}>
                Applicant not found
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                This applicant may no longer be available.
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

  return (
    <div style={{ padding: "32px 40px", maxWidth: 720 }}>
      <button
        type="button"
        onClick={() => navigate(routes.recruiterDashboard)}
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
        Back to dashboard
      </button>

      <Card>
        <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
          <Avatar name={applicant.fullName} size={72} shape="squircle" />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 28, color: "var(--text-strong)", margin: "0 0 4px" }}>
              {applicant.fullName}
            </h1>
            <div style={{ fontFamily: "var(--font-text)", fontSize: 15, color: "var(--text-muted)", marginBottom: 12 }}>
              Applied for <strong style={{ color: "var(--text-strong)" }}>{applicant.appliedFor}</strong>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {applicant.skills.map((s) => <Tag key={s}>{s}</Tag>)}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, borderTop: "1px solid var(--border-subtle)", paddingTop: 20 }}>
          <Button variant="primary" onClick={() => toast.success("Action", { description: "Accept functionality coming soon." })}>
            Accept
          </Button>
          <Button variant="danger" onClick={() => toast.info("Rejected", { description: "Reject functionality coming soon." })}>
            Reject
          </Button>
          <Button variant="outline" onClick={() => toast.info("Coming soon", { description: "Messaging will be available in a future release." })}>
            Message
          </Button>
        </div>
      </Card>
    </div>
  );
}
