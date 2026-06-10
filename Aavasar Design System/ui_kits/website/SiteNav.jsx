// Aavasar marketing — top navigation bar. Registers <SiteNav> on window.
function SiteNav({ onCta }) {
  const { Button, IconButton } = window.AavasarDesignSystem_e30e7a;
  const links = ["Find Gigs", "How It Works", "About", "Contact"];
  const [active, setActive] = React.useState("Find Gigs");
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 20, background: "var(--surface-0)",
      borderBottom: "1px solid var(--border-default)",
    }}>
      <nav style={{
        maxWidth: "var(--container-max)", margin: "0 auto", height: "var(--nav-height)",
        padding: "0 var(--container-pad)", display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 24,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img src="../../assets/aavasar-mark.png" alt="" style={{ width: 32, height: 32 }} />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--brand-700)", letterSpacing: "-0.01em" }}>Aavasar</span>
          </a>
          <div style={{ display: "flex", gap: 24 }}>
            {links.map((l) => (
              <a key={l} href="#" onClick={(e) => { e.preventDefault(); setActive(l); }}
                style={{
                  fontFamily: "var(--font-text)", fontSize: 15, fontWeight: active === l ? 600 : 500,
                  color: active === l ? "var(--brand-700)" : "var(--text-muted)", textDecoration: "none",
                  padding: "6px 0", borderBottom: active === l ? "2px solid var(--brand-700)" : "2px solid transparent",
                }}>{l}</a>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Button variant="secondary" size="md" onClick={onCta}>Log In</Button>
          <Button variant="primary" size="md" onClick={onCta}>Sign Up</Button>
          <span style={{ width: 1, height: 24, background: "var(--border-strong)" }}></span>
          <IconButton ariaLabel="Help"><i data-lucide="help-circle" style={{ width: 20, height: 20 }}></i></IconButton>
        </div>
      </nav>
    </header>
  );
}
window.SiteNav = SiteNav;
