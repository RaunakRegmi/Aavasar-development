/**
 * Recruiter → Talent detail — a full student profile, opened from a
 * Find Talent card. Read-only; the "Message" CTA defers to the Messages
 * surface (not yet built). Data comes from GET /talent/:id.
 */
import { useParams, useNavigate } from "react-router-dom";
import { Avatar, Badge, Button, Card, Tag, Skeleton, useToast } from "@shared/ui";
import { Icon } from "@shared/icons";
import { useTalentById } from "@features/recruiter/hooks/useTalent";
import { useStartConversation } from "@features/messaging";
import { resolveImageUrl } from "@shared/lib/resolveImageUrl";
import { routes, recruiterConversationPath } from "@shared/config/routes";

export default function RecruiterTalentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const startConversation = useStartConversation();
  const { data: talent, isLoading, isError } = useTalentById(id);

  const banner = resolveImageUrl(talent?.bannerUrl ?? undefined);

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px" }}>
      <button
        type="button"
        onClick={() => navigate(routes.recruiterBrowseTalent)}
        style={{
          all: "unset",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontFamily: "var(--font-text)",
          fontSize: 14,
          fontWeight: 600,
          color: "var(--text-muted)",
          marginBottom: 20,
        }}
      >
        <Icon name="ChevronLeft" size={16} />
        Back to Find Talent
      </button>

      {isLoading ? (
        <Card>
          <div style={{ display: "flex", gap: 16 }}>
            <Skeleton width={88} height={88} radius={9999} />
            <div style={{ flex: 1 }}>
              <Skeleton width="40%" height={22} />
              <div style={{ height: 10 }} />
              <Skeleton width="60%" height={14} />
            </div>
          </div>
        </Card>
      ) : isError || !talent ? (
        <Card>
          <div style={{ textAlign: "center", padding: "40px 16px" }}>
            <Icon name="UserX" size={28} style={{ color: "var(--text-muted)" }} />
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 18,
                color: "var(--text-strong)",
                margin: "12px 0 4px",
              }}
            >
              Student not found
            </div>
            <div style={{ fontFamily: "var(--font-text)", fontSize: 14, color: "var(--text-muted)", marginBottom: 16 }}>
              This profile may no longer be available.
            </div>
            <Button variant="outline" onClick={() => navigate(routes.recruiterBrowseTalent)}>
              Back to Find Talent
            </Button>
          </div>
        </Card>
      ) : (
        <Card padding={0} style={{ overflow: "hidden" }}>
          {/* Banner */}
          <div
            style={{
              height: 120,
              background: banner
                ? `url(${banner}) center/cover no-repeat`
                : "linear-gradient(120deg, var(--brand-700), var(--brand-500))",
            }}
          />
          <div style={{ padding: "0 28px 28px" }}>
            {/* Avatar overlapping the banner */}
            <div style={{ marginTop: -36, marginBottom: 12 }}>
              <Avatar
                src={talent.avatarUrl ?? undefined}
                name={talent.fullName}
                size={88}
                style={{ border: "3px solid var(--surface-0)" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h1
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 26,
                      color: "var(--text-strong)",
                      margin: 0,
                    }}
                  >
                    {talent.fullName}
                  </h1>
                  {talent.verified && <Badge tone="success">Verified</Badge>}
                </div>
                {talent.headline && (
                  <p style={{ fontFamily: "var(--font-text)", fontSize: 15, color: "var(--text-muted)", margin: "4px 0 0" }}>
                    {talent.headline}
                  </p>
                )}
              </div>
              <Button
                variant="primary"
                iconLeft={<Icon name="Mail" size={16} />}
                disabled={startConversation.isPending}
                onClick={() =>
                  startConversation.mutate(talent.id, {
                    onSuccess: (conv) => navigate(recruiterConversationPath(conv.id)),
                    onError: (e) =>
                      toast.error("Could not start chat", {
                        description: e instanceof Error ? e.message : undefined,
                      }),
                  })
                }
              >
                Message
              </Button>
            </div>

            {talent.bio && (
              <div style={{ marginTop: 24 }}>
                <h3 style={sectionHeading}>About</h3>
                <p
                  style={{
                    fontFamily: "var(--font-text)",
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: "var(--text-muted)",
                    margin: 0,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {talent.bio}
                </p>
              </div>
            )}

            {talent.skills.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h3 style={sectionHeading}>Skills</h3>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {talent.skills.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

const sectionHeading = {
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  fontSize: 15,
  color: "var(--text-strong)",
  margin: "0 0 10px",
} as const;
