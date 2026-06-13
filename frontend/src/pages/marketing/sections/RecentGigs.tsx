import { useNavigate } from "react-router-dom";
import { Button, Card, Tag } from "@shared/ui";
import { useGigList } from "@features/gigs";
import { formatNprFixed, formatRupeeRate } from "@shared/lib/utils";
import { gigPath } from "@shared/config/routes";

interface RecentGigsProps {
  onApplyUnauth: () => void;
  onSeeMore: () => void;
}

export function RecentGigs({ onApplyUnauth, onSeeMore }: RecentGigsProps) {
  const navigate = useNavigate();
  const { data } = useGigList({});
  const gigs = data?.items ?? [];

  return (
    <section
      className="container-page"
      style={{ paddingTop: 64, paddingBottom: 48 }}
    >
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 24,
          color: "var(--text-strong)",
          margin: "0 0 20px",
        }}
      >
        Recently Added Gigs
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 20,
        }}
      >
        {gigs.slice(0, 3).map((g) => {
          const rate =
            g.payKind === "fixed"
              ? formatNprFixed(g.pay)
              : formatRupeeRate(g.pay.amountMinor, "hr");
          return (
            <Card
              key={g.id}
              interactive
              onClick={() => navigate(gigPath(g.id))}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-text)",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    color: "var(--text-subtle)",
                  }}
                >
                  {g.category}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-text)",
                    fontWeight: 700,
                    fontSize: 16,
                    color: "var(--success-600)",
                  }}
                >
                  {rate}
                </span>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 17,
                  color: "var(--text-strong)",
                }}
              >
                {g.title}
              </div>
              <p
                style={{
                  fontFamily: "var(--font-text)",
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: "var(--text-muted)",
                  margin: 0,
                  flex: 1,
                }}
              >
                {g.description}
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                {g.tags.map((t) => <Tag key={t}>{t}</Tag>)}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid var(--border-subtle)",
                  paddingTop: 12,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-text)",
                    fontSize: 13,
                    color: "var(--text-subtle)",
                  }}
                >
                  By {g.poster.name}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onApplyUnauth();
                  }}
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
                  Apply →
                </button>
              </div>
            </Card>
          );
        })}
      </div>
      <div style={{ textAlign: "center", marginTop: 32 }}>
        <Button variant="outline" onClick={onSeeMore}>
          See 50+ More Opportunities
        </Button>
      </div>
    </section>
  );
}
