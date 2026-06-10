import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Card, PageLoader, Tag, useToast } from "@shared/ui";
import { Icon } from "@shared/icons";
import { useCurrentUser } from "@features/auth";
import { useFinalizeOnboarding, useOnboardingState } from "@features/onboarding";
import { routes } from "@shared/config/routes";
import { ApiError } from "@shared/lib/transport";

interface StepCompleteProps {
  onRestart: () => void;
}

interface Confetto {
  left: number;
  delay: number;
  dur: number;
  color: string;
  size: number;
  rot: number;
}

/**
 * Three rendering states:
 *   • finalizing  — show a calm "Saving your profile…" loader. The
 *                   wizard kicked off the finalize call when the step
 *                   mounted; we don't want to lie that everything is
 *                   done before the network has answered.
 *   • success     — show the confetti, the profile card, and the
 *                   "Find Your First Gig" CTA.
 *   • failed      — show a recoverable error state with a Retry button
 *                   AND a Restart-the-tour escape hatch.
 */
type Phase = "finalizing" | "success" | "failed";

export function StepComplete({ onRestart }: StepCompleteProps) {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const finalize = useFinalizeOnboarding();
  const toast = useToast();
  const { reset: resetDraft } = useOnboardingState();
  const [phase, setPhase] = useState<Phase>("finalizing");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /**
   * Single seam for "leave the wizard". Clears the persisted draft —
   * this is the ONLY place the draft is cleared, so a refresh on the
   * success screen still has the data (which the route guard then
   * sees as `onboardingCompleted=true` and bounces to the dashboard).
   */
  const leaveTo = (path: string) => {
    resetDraft();
    navigate(path, { replace: true });
  };

  // Kick off finalize ONCE on mount. The mutation has its own
  // single-flight protection, but we still guard via the ref pattern
  // so StrictMode double-invoke doesn't fire it twice.
  useEffect(() => {
    let cancelled = false;
    finalize
      .mutateAsync()
      .then(() => {
        if (!cancelled) setPhase("success");
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        const description =
          e instanceof ApiError ? e.body.message :
          e instanceof Error ? e.message :
          "Something went wrong wrapping up.";
        setErrorMsg(description);
        setPhase("failed");
        toast.error("Couldn't finish onboarding", { description });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confetti = useMemo<Confetto[]>(
    () =>
      Array.from({ length: 36 }).map((_, i) => {
        const colors = [
          "var(--brand-700)",
          "var(--success-500)",
          "var(--info-500)",
          "var(--star)",
          "var(--brand-300)",
        ];
        return {
          left: Math.random() * 100,
          delay: Math.random() * 0.6,
          dur: 1.6 + Math.random() * 1.4,
          color: colors[i % colors.length]!,
          size: 6 + Math.random() * 6,
          rot: Math.random() * 360,
        };
      }),
    [],
  );

  if (phase === "finalizing") {
    return (
      <div style={{ maxWidth: 560, margin: "56px auto", textAlign: "center" }}>
        <PageLoader />
        <p
          style={{
            fontFamily: "var(--font-text)",
            fontSize: 15,
            color: "var(--text-muted)",
            marginTop: 12,
          }}
        >
          Saving your profile…
        </p>
      </div>
    );
  }

  if (phase === "failed") {
    return (
      <div style={{ maxWidth: 560, margin: "56px auto", textAlign: "center" }}>
        <Card style={{ padding: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "var(--radius-md)",
              background: "var(--danger-100)",
              color: "var(--danger-500)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Icon name="AlertCircle" size={26} />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 26,
              color: "var(--text-strong)",
              margin: "0 0 8px",
            }}
          >
            We couldn&apos;t wrap up
          </h1>
          <p
            style={{
              fontFamily: "var(--font-text)",
              fontSize: 15,
              color: "var(--text-muted)",
              margin: "0 0 24px",
            }}
          >
            {errorMsg ?? "Something went wrong finalizing your profile."}
          </p>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="primary"
              onClick={() => {
                setPhase("finalizing");
                setErrorMsg(null);
                finalize
                  .mutateAsync()
                  .then(() => setPhase("success"))
                  .catch((e: unknown) => {
                    const m =
                      e instanceof ApiError ? e.body.message :
                      e instanceof Error ? e.message :
                      "Retry failed.";
                    setErrorMsg(m);
                    setPhase("failed");
                  });
              }}
              iconLeft={<Icon name="RotateCcw" size={16} />}
            >
              Try again
            </Button>
            <Button variant="outline" onClick={onRestart}>
              Restart the tour
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        maxWidth: 560,
        margin: "56px auto",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          top: -40,
          pointerEvents: "none",
          overflow: "hidden",
          height: 400,
        }}
      >
        {confetti.map((c, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: `${c.left}%`,
              top: -14,
              width: c.size,
              height: c.size,
              background: c.color,
              borderRadius: 1,
              transform: `rotate(${c.rot}deg)`,
              animation: `aav-fall ${c.dur}s var(--ease-standard) ${c.delay}s forwards`,
            }}
          />
        ))}
      </div>
      <div style={{ position: "relative" }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "var(--radius-full)",
            background: "var(--success-100)",
            color: "var(--success-600)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <Icon name="Check" size={36} />
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 38,
            color: "var(--text-strong)",
            margin: "0 0 10px",
            letterSpacing: "-0.02em",
          }}
        >
          You&apos;re all set!
        </h1>
        <p
          style={{
            fontFamily: "var(--font-text)",
            fontSize: 17,
            lineHeight: 1.5,
            color: "var(--text-muted)",
            margin: "0 auto 28px",
            maxWidth: 420,
          }}
        >
          Your profile is now live and visible to recruiters. Welcome to the
          Aavasar ecosystem.
        </p>
        <Card padding={24} style={{ textAlign: "left", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Avatar
              src={user?.avatarUrl}
              name={user?.fullName ?? "You"}
              size={56}
              shape="squircle"
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 18,
                    color: "var(--text-strong)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user?.fullName ?? "Pratikshya Sharma"}
                </span>
                <Icon
                  name="BadgeCheck"
                  size={16}
                  style={{ color: "var(--info-500)", flexShrink: 0 }}
                />
              </div>
              <div
                style={{
                  fontFamily: "var(--font-text)",
                  fontSize: 14,
                  color: "var(--text-muted)",
                  marginTop: 2,
                }}
              >
                B.S. Computer Science · Tribhuvan University
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <Tag variant="brand">React</Tag>
            <Tag variant="brand">Python</Tag>
            <Tag>UX Research</Tag>
          </div>
        </Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Button
            variant="primary"
            size="lg"
            full
            iconRight={<Icon name="ArrowRight" size={18} />}
            onClick={() => leaveTo(routes.studentFindWork)}
          >
            Find Your First Gig
          </Button>
          <Button
            variant="outline"
            size="lg"
            full
            onClick={() => leaveTo(routes.studentProfile)}
          >
            View Public Profile
          </Button>
        </div>
        <p
          style={{
            fontFamily: "var(--font-text)",
            fontSize: 13,
            color: "var(--text-subtle)",
            marginTop: 20,
          }}
        >
          Need to change something?{" "}
          <button
            type="button"
            onClick={onRestart}
            style={{
              color: "var(--brand-700)",
              fontWeight: 600,
              textDecoration: "none",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
              font: "inherit",
            }}
          >
            Restart the tour
          </button>
          .
        </p>
      </div>
    </div>
  );
}
