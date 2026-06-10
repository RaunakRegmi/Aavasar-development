/**
 * Reusable "under construction" page. Mounted at every route whose
 * real implementation hasn't shipped yet. Lets users navigate around
 * without dead-ending on a 404 or a silent no-op link.
 *
 * Each stubbed route in `routes.ts` is paired with one of these via
 * the router — see `router.tsx`. Pass `title` + optional `subtitle`
 * via route props (see `stub()` helper in router.tsx).
 */
import { useNavigate } from "react-router-dom";
import { Button, Card } from "@shared/ui";
import { Icon } from "@shared/icons";

export interface ComingSoonPageProps {
  title: string;
  subtitle?: string;
  /** Where the "Back" button takes the user. Defaults to history.back(). */
  fallbackPath?: string;
}

export default function ComingSoonPage({
  title,
  subtitle = "We're polishing this surface — it'll land in an upcoming release.",
  fallbackPath,
}: ComingSoonPageProps) {
  const navigate = useNavigate();
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <Card style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "var(--radius-md)",
            background: "var(--brand-50)",
            color: "var(--brand-700)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <Icon name="Hammer" size={26} />
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 28,
            color: "var(--text-strong)",
            margin: "0 0 8px",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontFamily: "var(--font-text)",
            fontSize: 15,
            lineHeight: 1.55,
            color: "var(--text-muted)",
            margin: "0 0 24px",
          }}
        >
          {subtitle}
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
          }}
        >
          <Button
            variant="outline"
            onClick={() => (fallbackPath ? navigate(fallbackPath) : navigate(-1))}
            iconLeft={<Icon name="ArrowLeft" size={16} />}
          >
            Back
          </Button>
        </div>
      </Card>
    </div>
  );
}
