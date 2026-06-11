import { Card, Avatar, Badge, Tag, Button } from "@shared/ui";
import { Icon } from "@shared/icons";
import type { Talent } from "../contracts/talent.contract";

interface TalentCardProps {
  talent: Talent;
  onViewProfile?: (id: string) => void;
  onMessage?: (id: string) => void;
}

export function TalentCard({ talent, onViewProfile, onMessage }: TalentCardProps) {
  return (
    <Card
      interactive
      onClick={() => onViewProfile?.(talent.id)}
      style={{ display: "flex", flexDirection: "column", gap: 16, cursor: "pointer", height: "100%" }}
    >
      <div style={{ display: "flex", gap: 14 }}>
        <Avatar src={talent.avatarUrl ?? undefined} name={talent.fullName} size={48} />
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 16,
                color: "var(--text-strong)",
              }}
            >
              {talent.fullName}
            </span>
            {talent.verified && <Badge tone="success">Verified</Badge>}
          </div>
          <div
            style={{
              fontFamily: "var(--font-text)",
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text-muted)",
              marginTop: 2,
            }}
          >
            {talent.headline || "Aavasar Student"}
          </div>
        </div>
      </div>

      {talent.bio && (
        <p
          style={{
            fontFamily: "var(--font-text)",
            fontSize: 14,
            lineHeight: 1.5,
            color: "var(--text-muted)",
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {talent.bio}
        </p>
      )}

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flex: 1, alignContent: "flex-start" }}>
        {talent.skills.slice(0, 5).map((skill) => (
          <Tag key={skill}>{skill}</Tag>
        ))}
        {talent.skills.length > 5 && (
          <span
            style={{
              alignSelf: "center",
              fontFamily: "var(--font-text)",
              fontSize: 12,
              color: "var(--text-subtle)",
            }}
          >
            +{talent.skills.length - 5} more
          </span>
        )}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <Button
          variant="primary"
          full
          onClick={(e) => {
            e.stopPropagation();
            onViewProfile?.(talent.id);
          }}
        >
          View Profile
        </Button>
        <Button
          variant="outline"
          iconLeft={<Icon name="Mail" size={15} />}
          onClick={(e) => {
            e.stopPropagation();
            onMessage?.(talent.id);
          }}
        >
          Message
        </Button>
      </div>
    </Card>
  );
}
