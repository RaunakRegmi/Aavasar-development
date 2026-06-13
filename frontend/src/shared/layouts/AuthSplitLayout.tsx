import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { Avatar } from "@shared/ui";
import { Icon } from "@shared/icons";
import { routes } from "@shared/config/routes";
import { useIsMobile } from "@shared/hooks/useMediaQuery";

/**
 * Auth split layout — the slate gradient + testimonial on the left,
 * form on the right. Shared by Login / SignUp / ForgotPassword /
 * ResetPassword so the brand stays consistent and only the form
 * differs between routes.
 */
export interface AuthSplitLayoutProps {
  children: ReactNode;
  /** When true (default) renders the dismiss "X" that returns to /. */
  dismissable?: boolean;
}

export function AuthSplitLayout({
  children,
  dismissable = true,
}: AuthSplitLayoutProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        background: "var(--surface-page)",
      }}
    >
      {/* Left — brand + testimonial (desktop/tablet only) */}
      {!isMobile && (
      <div
        style={{
          background:
            "linear-gradient(160deg, var(--brand-600), var(--brand-800))",
          padding: "56px 64px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src="/aavasar-mark.png"
            alt=""
            style={{
              width: 44,
              height: 44,
              background: "#fff",
              borderRadius: "50%",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 34,
              color: "#fff",
            }}
          >
            Aavasar
          </span>
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: "var(--radius-lg)",
            padding: 28,
            maxWidth: 360,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 4,
              marginBottom: 14,
              color: "var(--star)",
            }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <Icon key={i} name="Star" size={16} fill="var(--star)" />
            ))}
          </div>
          <p
            style={{
              fontFamily: "var(--font-text)",
              fontSize: 18,
              lineHeight: 1.6,
              fontStyle: "italic",
              color: "#fff",
              margin: "0 0 20px",
            }}
          >
            &ldquo;Aavasar helped me land my first UX internship while still in
            my second year. The platform is incredibly intuitive and professional.&rdquo;
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar name="Aastha Khadka" size={44} />
            <div>
              <div
                style={{
                  fontFamily: "var(--font-text)",
                  fontWeight: 700,
                  fontSize: 15,
                  color: "#fff",
                }}
              >
                Aastha Khadka
              </div>
              <div
                style={{
                  fontFamily: "var(--font-text)",
                  fontSize: 13,
                  color: "var(--brand-200)",
                }}
              >
                Product Design Student
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Right — form */}
      <div
        style={{
          padding: isMobile ? "28px 20px" : "56px 72px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflowY: "auto",
          position: "relative",
        }}
      >
        {dismissable && (
          <button
            type="button"
            onClick={() => navigate(routes.home)}
            aria-label="Close"
            style={{
              position: "absolute",
              top: 24,
              right: 28,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--ink-500)",
            }}
          >
            <Icon name="X" size={24} />
          </button>
        )}
        <div
          style={{
            maxWidth: 420,
            width: "100%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
