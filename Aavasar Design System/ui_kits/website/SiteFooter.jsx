// Aavasar marketing — expanded footer. Registers <SiteFooter> on window.
function SiteFooter() {
  const cols = [
    { h: "Platform", items: ["Find Gigs", "Post a Job", "How We Work", "Success Stories", "Pricing"] },
    { h: "Company", items: ["About Us", "Our Mission", "Careers", "Press & Media", "Contact Us"] },
    { h: "Support", items: ["Help Center", "Safety Center", "Terms of Service", "Privacy Policy", "Cookie Settings"] },
  ];
  return (
    <footer style={{ background: "var(--surface-3)", borderTop: "1px solid var(--border-default)", padding: "64px 0 32px" }}>
      <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 var(--container-pad)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--brand-700)" }}>Aavasar</span>
            <p style={{ fontFamily: "var(--font-text)", fontSize: 16, lineHeight: 1.6, color: "var(--text-body)", margin: 0, maxWidth: 280 }}>
              The premier marketplace for student talent. Connecting tomorrow's leaders with today's opportunities through professional gigs and projects.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              {["share-2", "at-sign", "globe"].map((n) => (
                <span key={n} style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: "var(--surface-1)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--ink-700)", border: "1px solid var(--border-default)" }}>
                  <i data-lucide={n} style={{ width: 18, height: 18 }}></i>
                </span>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.h} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-strong)" }}>{c.h}</span>
              {c.items.map((i) => (
                <a key={i} href="#" style={{ fontFamily: "var(--font-text)", fontSize: 15, color: "var(--text-muted)", textDecoration: "none" }}>{i}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-default)", marginTop: 48, paddingTop: 32 }}>
          <span style={{ fontFamily: "var(--font-text)", fontSize: 14, color: "var(--text-muted)" }}>© 2024 Aavasar Inc. All rights reserved.</span>
          <div style={{ display: "flex", gap: 24 }}>
            <span style={{ fontFamily: "var(--font-text)", fontSize: 14, color: "var(--text-muted)" }}>English (US)</span>
            <span style={{ fontFamily: "var(--font-text)", fontSize: 14, color: "var(--text-muted)" }}>NPR (रु)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
window.SiteFooter = SiteFooter;
