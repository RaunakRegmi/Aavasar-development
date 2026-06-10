import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useOnboardingState } from "@features/onboarding";
import { useCurrentUser } from "@features/auth";
import { routes } from "@shared/config/routes";
import { StepBasic } from "./steps/StepBasic";
import { StepSkills } from "./steps/StepSkills";
import { StepPortfolio } from "./steps/StepPortfolio";
import { StepComplete } from "./steps/StepComplete";

const TOTAL = 4;

function TopBar({ step }: { step: number }) {
  const pct = (step / TOTAL) * 100;
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "var(--surface-0)",
        borderBottom: "1px solid var(--border-default)",
      }}
    >
      <div
        style={{
          height: 64,
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/aavasar-mark.png" alt="" style={{ width: 30, height: 30 }} />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 22,
              color: "var(--brand-700)",
            }}
          >
            Aavasar
          </span>
        </div>
        <span
          style={{
            fontFamily: "var(--font-text)",
            fontSize: 14,
            fontWeight: 600,
            color: "var(--text-muted)",
          }}
        >
          Step {step} of {TOTAL}
        </span>
      </div>
      <div style={{ height: 4, background: "var(--surface-2)" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background:
              step === TOTAL ? "var(--success-500)" : "var(--brand-700)",
            transition: "width var(--dur-slow) var(--ease-out)",
          }}
        />
      </div>
    </header>
  );
}

export default function OnboardingPage() {
  const user = useCurrentUser();
  const { step, basic, skills, setStep, setBasic, toggleSkill, reset } =
    useOnboardingState();

  // Always scroll to top on step change.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step]);

  // Defence in depth — ProtectedRoute already redirects an onboarded
  // user away from this route, but we double-up here so the wizard
  // never even tries to render past this check. If a future refactor
  // accidentally bypasses the route guard, the loop still can't happen.
  if (user?.onboardingCompleted) {
    return (
      <Navigate
        to={user.role === "recruiter" ? routes.recruiterDashboard : routes.studentDashboard}
        replace
      />
    );
  }

  const go = (n: 1 | 2 | 3 | 4) => setStep(n);

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-page)" }}>
      <TopBar step={step} />
      <div style={{ padding: "0 24px 64px" }}>
        {step === 1 && (
          <StepBasic
            defaultValues={basic}
            onNext={() => {
              setBasic(basic);
              go(2);
            }}
          />
        )}
        {step === 2 && (
          <StepSkills
            selected={skills}
            onToggle={toggleSkill}
            onNext={() => go(3)}
            onBack={() => go(1)}
          />
        )}
        {step === 3 && (
          <StepPortfolio onNext={() => go(4)} onBack={() => go(2)} />
        )}
        {step === 4 && (
          <StepComplete
            onRestart={() => {
              reset();
              go(1);
            }}
          />
        )}
      </div>
    </div>
  );
}
