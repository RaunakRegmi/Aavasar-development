import { Badge, Button, Card } from "@shared/ui";
import { Icon } from "@shared/icons";
import { useRewards, usePerks, useRedeemPerk } from "../hooks/useRewards";
import type { Perk, PointsTransaction } from "../contracts/rewards.contract";

export default function StudentPerksPage() {
  const rewards = useRewards();
  const catalog = usePerks();
  const redeem = useRedeemPerk();

  const balance = catalog.data?.balance ?? rewards.data?.balance ?? 0;

  return (
    <main className="container-page" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={titleStyle}>Perks &amp; Rewards</h1>
        <p style={subtitleStyle}>
          Earn points every time you complete a gig, then spend them on perks that help you stand
          out.
        </p>
      </header>

      {/* Balance hero */}
      <Card tone="dark" padding={28} style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "var(--radius-full)",
              background: "rgba(255,255,255,0.15)",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <Icon name="Sparkles" size={28} style={{ color: "#fff" }} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 36, lineHeight: 1, color: "#fff" }}>
              {balance.toLocaleString()}
            </div>
            <div style={{ fontFamily: "var(--font-text)", fontSize: 14, color: "rgba(255,255,255,0.85)" }}>
              points available
            </div>
          </div>
        </div>
      </Card>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
          gap: 24,
          alignItems: "start",
        }}
        className="aav-perks-grid"
      >
        {/* Perk catalogue */}
        <section>
          <h2 style={{ ...titleStyle, fontSize: 18, marginBottom: 14 }}>Spend your points</h2>
          {catalog.isLoading ? (
            <Card padding={24}><p style={mutedP}>Loading perks…</p></Card>
          ) : catalog.isError ? (
            <Card padding={24}><p style={errorP}>Couldn't load the perk catalogue.</p></Card>
          ) : (
            <div style={{ display: "grid", gap: 14 }}>
              {catalog.data!.perks.map((perk) => (
                <PerkCard
                  key={perk.key}
                  perk={perk}
                  busy={redeem.isPending}
                  onRedeem={() => redeem.mutate(perk.key)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Earn history */}
        <section>
          <h2 style={{ ...titleStyle, fontSize: 18, marginBottom: 14 }}>Points history</h2>
          <Card padding={20}>
            {rewards.isLoading ? (
              <p style={mutedP}>Loading…</p>
            ) : !rewards.data || rewards.data.transactions.length === 0 ? (
              <p style={mutedP}>
                No activity yet. Complete a gig to earn your first points!
              </p>
            ) : (
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 12 }}>
                {rewards.data.transactions.map((t) => (
                  <HistoryRow key={t.id} txn={t} />
                ))}
              </ul>
            )}
          </Card>
        </section>
      </div>
    </main>
  );
}

function PerkCard({
  perk,
  onRedeem,
  busy,
}: {
  perk: Perk;
  onRedeem: () => void;
  busy: boolean;
}) {
  return (
    <Card padding={20}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <strong style={{ color: "var(--text-strong)", fontSize: 16 }}>{perk.title}</strong>
            <Badge tone="premium" uppercase={false}>{perk.cost} pts</Badge>
          </div>
          <p style={{ ...mutedP, fontSize: 14, margin: 0 }}>{perk.description}</p>
        </div>
        <div style={{ alignSelf: "center" }}>
          <Button
            size="sm"
            variant={perk.affordable ? "primary" : "outline"}
            disabled={!perk.affordable || busy}
            onClick={onRedeem}
          >
            {perk.affordable ? "Redeem" : "Not enough"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

function HistoryRow({ txn }: { txn: PointsTransaction }) {
  const positive = txn.delta >= 0;
  return (
    <li style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ color: "var(--text-strong)", fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {txn.label}
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
          {new Date(txn.createdAt).toLocaleDateString()}
        </div>
      </div>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 15,
          color: positive ? "var(--success-600)" : "var(--danger-700-text)",
          flexShrink: 0,
        }}
      >
        {positive ? "+" : ""}
        {txn.delta}
      </span>
    </li>
  );
}

const titleStyle = {
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  fontSize: "clamp(22px, 4vw, 28px)",
  letterSpacing: "-0.02em",
  color: "var(--text-strong)",
  margin: "0 0 8px",
} as const;

const subtitleStyle = {
  fontFamily: "var(--font-text)",
  fontSize: 15,
  color: "var(--text-muted)",
  margin: 0,
} as const;

const mutedP = { fontFamily: "var(--font-text)", color: "var(--text-muted)", margin: 0 } as const;
const errorP = { fontFamily: "var(--font-text)", color: "var(--danger-700-text)", margin: 0 } as const;
