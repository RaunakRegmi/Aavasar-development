import { Component, type ErrorInfo, type ReactNode } from "react";

interface State {
  error: Error | null;
}

/**
 * Top-level error boundary. Catches render-time exceptions and shows
 * a calm fallback consistent with the brand voice ("clear, calm,
 * non-punitive even in failure"). Network errors are caught lower
 * down by the L5 interceptor — they don't reach this boundary.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary]", error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--surface-page)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div style={{ width: "100%", maxWidth: 480, textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 700,
              color: "var(--text-strong)",
              margin: "0 0 12px",
            }}
          >
            Something went off-script.
          </h1>
          <p
            style={{
              fontFamily: "var(--font-text)",
              fontSize: 16,
              color: "var(--text-muted)",
              margin: "0 0 24px",
            }}
          >
            We logged what happened and our team will look into it. Try again — if it
            keeps happening, please reach out to support.
          </p>
          <button
            type="button"
            onClick={this.reset}
            style={{
              fontFamily: "var(--font-text)",
              fontSize: 16,
              fontWeight: 600,
              padding: "10px 20px",
              borderRadius: "var(--radius-xs)",
              background: "var(--primary)",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
}
