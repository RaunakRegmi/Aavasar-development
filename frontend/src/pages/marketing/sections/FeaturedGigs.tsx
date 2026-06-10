import { useNavigate } from "react-router-dom";
import { Badge, Button, Card, Tag } from "@shared/ui";
import { Icon } from "@shared/icons";
import { useFeaturedGigs } from "@features/gigs";
import { formatRupeeRate } from "@shared/lib/utils";
import { gigPath } from "@shared/config/routes";

interface FeaturedGigsProps {
  /** Called when an unauthenticated user clicks "Log in / Sign Up to Apply". */
  onApplyUnauth: () => void;
  /** "View all →" — goes to the public gigs listing. */
  onViewAll: () => void;
}

export function FeaturedGigs({ onApplyUnauth, onViewAll }: FeaturedGigsProps) {
  const navigate = useNavigate();
  const { data: gigs } = useFeaturedGigs();
  const premium = gigs?.[0];
  const calm = gigs?.[1];

  return (
    <section className="container-page" style={{ paddingBottom: 64 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 20,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 24,
              color: "var(--text-strong)",
              margin: "0 0 4px",
            }}
          >
            Featured Gigs
          </h2>
          <p
            style={{
              fontFamily: "var(--font-text)",
              fontSize: 14,
              color: "var(--text-muted)",
              margin: 0,
            }}
          >
            Log in to apply for these top-tier opportunities.
          </p>
        </div>
        <button
          type="button"
          onClick={onViewAll}
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
          View all →
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: 16,
        }}
      >
        {premium && (
          <Card
            padding={0}
            interactive
            onClick={() => navigate(gigPath(premium.id))}
            style={{ overflow: "hidden", display: "flex", cursor: "pointer" }}
          >
            <div
              style={{
                width: 220,
                flexShrink: 0,
                backgroundImage: "url(/photos/hero-b.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div style={{ padding: 24, flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 10,
                }}
              >
                <Badge tone="premium">Premium</Badge>
                <span
                  style={{
                    fontFamily: "var(--font-text)",
                    fontWeight: 700,
                    fontSize: 18,
                    color: "var(--success-600)",
                  }}
                >
                  {formatRupeeRate(premium.pay.amountMinor, "hr")}
                </span>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 20,
                  color: "var(--text-strong)",
                  margin: "0 0 8px",
                }}
              >
                {premium.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-text)",
                  fontSize: 15,
                  lineHeight: 1.5,
                  color: "var(--text-muted)",
                  margin: "0 0 16px",
                }}
              >
                {premium.description}
              </p>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {premium.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                <span style={{ flex: 1 }} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onApplyUnauth();
                  }}
                  iconLeft={<Icon name="Lock" size={15} />}
                >
                  Log in to Apply
                </Button>
              </div>
            </div>
          </Card>
        )}
        {calm && (
          <Card
            tone="dark"
            radius="xl"
            interactive
            onClick={() => navigate(gigPath(calm.id))}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            <div>
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(255,255,255,0.16)",
                  color: "var(--brand-200)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <Icon name="GraduationCap" size={22} />
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 22,
                  color: "var(--brand-200)",
                  margin: "0 0 12px",
                }}
              >
                {calm.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-text)",
                  fontSize: 15,
                  lineHeight: 1.5,
                  color: "var(--brand-200)",
                  opacity: 0.85,
                  margin: 0,
                }}
              >
                {calm.description}
              </p>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-text)",
                  fontWeight: 700,
                  fontSize: 28,
                  color: "var(--brand-200)",
                  margin: "16px 0 12px",
                }}
              >
                {formatRupeeRate(calm.pay.amountMinor, "hr")}
              </div>
              <Button
                onDark
                variant="primary"
                full
                onClick={(e) => {
                  e.stopPropagation();
                  onApplyUnauth();
                }}
              >
                Sign Up to Apply
              </Button>
            </div>
          </Card>
        )}
      </div>
    </section>
  );
}
