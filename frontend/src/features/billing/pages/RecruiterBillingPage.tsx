import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Badge, Button, Card, ProgressBar, useToast } from "@shared/ui";
import { routes } from "@shared/config/routes";
import { useBilling, useStartCheckout, useBillingPortal, billingKeys } from "../hooks/useBilling";
import { ADD_ONS } from "../plans";
import type { BillingMe } from "../contracts/billing.contract";

const SALES_EMAIL = "sales@aavasar.np";

export default function RecruiterBillingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const qc = useQueryClient();
  const billing = useBilling();
  const checkout = useStartCheckout();
  const portal = useBillingPortal();

  // Handle the Stripe return URLs (/billing/success, /billing/cancel).
  const isSuccess = location.pathname === routes.recruiterBillingSuccess;
  const isCancel = location.pathname === routes.recruiterBillingCancel;
  useEffect(() => {
    if (isSuccess) {
      toast.success("Payment received", {
        description: "Your plan is being updated — this can take a few seconds.",
      });
      qc.invalidateQueries({ queryKey: billingKeys.me });
      navigate(routes.recruiterBilling, { replace: true });
    } else if (isCancel) {
      toast.info("Checkout cancelled", { description: "No changes were made to your plan." });
      navigate(routes.recruiterBilling, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isCancel]);

  return (
    <main className="container-page" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <header style={{ marginBottom: 28 }}>
        <h1 style={titleStyle}>Billing &amp; Plan</h1>
        <p style={subtitleStyle}>
          Manage your subscription, monitor usage, and add capacity as your hiring grows.
        </p>
      </header>

      {billing.isLoading ? (
        <Card padding={28}>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>Loading your plan…</p>
        </Card>
      ) : billing.isError || !billing.data ? (
        <Card padding={28}>
          <p style={{ color: "var(--danger-700-text)", margin: 0 }}>
            Couldn't load your billing details. Please refresh and try again.
          </p>
        </Card>
      ) : (
        <CurrentPlan
          data={billing.data}
          onUpgrade={() => checkout.mutate("professional")}
          onPortal={() => portal.mutate()}
          onAddon={(t) => checkout.mutate(t)}
          onContactSales={() =>
            window.location.assign(`mailto:${SALES_EMAIL}?subject=Enterprise%20plan%20enquiry`)
          }
          busy={checkout.isPending || portal.isPending}
        />
      )}

      <div style={{ marginTop: 24, textAlign: "center" }}>
        <Button variant="secondary" onClick={() => navigate(routes.pricing)}>
          Compare all plans →
        </Button>
      </div>
    </main>
  );
}

function CurrentPlan({
  data,
  onUpgrade,
  onPortal,
  onAddon,
  onContactSales,
  busy,
}: {
  data: BillingMe;
  onUpgrade: () => void;
  onPortal: () => void;
  onAddon: (t: "addon_gigslots" | "addon_featured") => void;
  onContactSales: () => void;
  busy: boolean;
}) {
  const isBasic = data.tier === "basic";
  const isPro = data.tier === "professional";
  const isEnterprise = data.tier === "enterprise";

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {/* Current plan summary */}
      <Card padding={28}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <h2 style={{ ...titleStyle, fontSize: 22, margin: 0 }}>{data.planName}</h2>
              <Badge tone={isBasic ? "neutral" : "premium"}>
                {data.status ?? (isBasic ? "Free" : "Active")}
              </Badge>
            </div>
            {data.currentPeriodEnd && (
              <p style={{ ...subtitleStyle, margin: 0, fontSize: 14 }}>
                Renews on {new Date(data.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
            {data.extraGigSlots > 0 && (
              <p style={{ ...subtitleStyle, margin: "4px 0 0", fontSize: 14 }}>
                +{data.extraGigSlots} extra gig slot{data.extraGigSlots === 1 ? "" : "s"} active
              </p>
            )}
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {isBasic && (
              <Button variant="primary" onClick={onUpgrade} disabled={busy}>
                Upgrade to Professional
              </Button>
            )}
            {!isBasic && !isEnterprise && (
              <Button variant="outline" onClick={onPortal} disabled={busy}>
                Manage billing
              </Button>
            )}
            {!isEnterprise && (
              <Button variant="secondary" onClick={onContactSales}>
                Talk to sales
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Usage meters */}
      <Card padding={28}>
        <h3 style={{ ...titleStyle, fontSize: 17, margin: "0 0 18px" }}>This month's usage</h3>
        <div style={{ display: "grid", gap: 20 }}>
          <UsageMeter
            label="Active gigs"
            used={data.usage.activeGigs}
            limit={data.usage.activeGigsLimit}
          />
          <UsageMeter
            label="Applications received"
            used={data.usage.applicationsThisMonth}
            limit={data.usage.applicationsLimit}
          />
        </div>
        {isPro && (
          <p style={{ ...subtitleStyle, fontSize: 13, margin: "16px 0 0" }}>
            Your plan includes AI screening and {data.limits.featuredSlots ?? 0} featured listing
            slots.
          </p>
        )}
      </Card>

      {/* Add-ons */}
      <Card padding={28}>
        <h3 style={{ ...titleStyle, fontSize: 17, margin: "0 0 4px" }}>Add-ons</h3>
        <p style={{ ...subtitleStyle, fontSize: 14, margin: "0 0 18px" }}>
          Top up capacity without changing your plan.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 14,
          }}
        >
          {ADD_ONS.map((addon) => (
            <div
              key={addon.target}
              style={{
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-lg)",
                padding: 18,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                <strong style={{ color: "var(--text-strong)", fontSize: 15 }}>{addon.name}</strong>
                <span style={{ color: "var(--brand-700)", fontWeight: 700, fontSize: 15 }}>
                  {addon.price}
                </span>
              </div>
              <p style={{ ...subtitleStyle, fontSize: 13, margin: 0, flex: 1 }}>
                {addon.description}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAddon(addon.target)}
                disabled={busy}
              >
                Add
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function UsageMeter({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number | null;
}) {
  const unlimited = limit === null;
  const pct = unlimited || limit === 0 ? 0 : Math.min(100, (used / limit) * 100);
  const nearLimit = !unlimited && limit > 0 && used / limit >= 0.8;
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
          fontSize: 14,
          fontFamily: "var(--font-text)",
        }}
      >
        <span style={{ color: "var(--text-strong)", fontWeight: 600 }}>{label}</span>
        <span style={{ color: "var(--text-muted)" }}>
          {used} {unlimited ? "/ Unlimited" : `/ ${limit}`}
        </span>
      </div>
      <ProgressBar
        value={pct}
        color={nearLimit ? "var(--warning-500)" : "var(--brand-700)"}
      />
    </div>
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
