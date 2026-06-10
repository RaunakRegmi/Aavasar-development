export function PageLoader() {
  return (
    <div
      role="status"
      aria-label="Loading"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        background: "var(--surface-page)",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          border: "3px solid var(--border-default)",
          borderTopColor: "var(--brand-700)",
          borderRadius: "9999px",
          animation: "aav-spin 0.9s linear infinite",
        }}
      />
      <style>{`@keyframes aav-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
