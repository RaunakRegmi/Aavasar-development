// Aavasar — Student Hub dashboard. Registers <StudentDashboard> on window.
(function () {
  const C = () => window.AavasarDesignSystem_e30e7a;
  const Ico = ({ n, s = 20, style }) => <i data-lucide={n} style={{ width: s, height: s, ...style }}></i>;

  function Sidebar({ active, setActive }) {
    const { Button } = C();
    const items = [
      ["Find Work", "search"], ["My Gigs", "briefcase"], ["Messages", "message-square"], ["Learning", "graduation-cap"],
    ];
    return (
      <aside style={{ width: "var(--sidebar-width)", flexShrink: 0, background: "var(--surface-0)", borderRight: "1px solid var(--border-default)", display: "flex", flexDirection: "column", padding: 24, gap: 24, minHeight: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="../../assets/aavasar-mark.png" alt="" style={{ width: 32, height: 32 }} />
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--brand-700)", lineHeight: 1 }}>Aavasar</div>
            <div style={{ fontFamily: "var(--font-text)", fontSize: 12, color: "var(--text-subtle)" }}>Student Hub</div>
          </div>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {items.map(([label, icon]) => {
            const on = active === label;
            return (
              <button key={label} onClick={() => setActive(label)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: "var(--radius-sm)",
                border: "none", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-text)", fontSize: 15, fontWeight: on ? 600 : 500,
                background: on ? "var(--surface-2)" : "transparent", color: on ? "var(--brand-700)" : "var(--text-muted)",
              }}><Ico n={icon} s={18} />{label}</button>
            );
          })}
        </nav>
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
          <Button variant="primary" full>Post Profile</Button>
          <button style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer", background: "transparent", color: "var(--text-muted)", fontFamily: "var(--font-text)", fontSize: 15, marginTop: 8 }}><Ico n="help-circle" s={18} />Support</button>
          <button style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer", background: "transparent", color: "var(--text-muted)", fontFamily: "var(--font-text)", fontSize: 15 }}><Ico n="log-out" s={18} />Sign Out</button>
        </div>
      </aside>
    );
  }

  function StudentDashboard() {
    const { Button, Card, StatCard, Badge, ProgressBar, Avatar } = C();
    const [active, setActive] = React.useState("Find Work");
    React.useEffect(() => { lucide.createIcons(); });
    return (
      <div style={{ display: "flex", minHeight: "100%", background: "var(--surface-page)" }}>
        <Sidebar active={active} setActive={setActive} />
        <main style={{ flex: 1, padding: "32px 40px", maxWidth: 1180 }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <Avatar src="../../assets/photos/peer-network.jpg" name="Pratikshya" size={64} shape="squircle" />
              <div>
                <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 38, color: "var(--text-strong)", margin: 0, letterSpacing: "-0.02em" }}>Welcome back, Pratikshya!</h1>
                <p style={{ fontFamily: "var(--font-text)", fontSize: 16, color: "var(--text-muted)", margin: "4px 0 0" }}>Your profile is 85% complete. Add your latest project to stand out.</p>
              </div>
            </div>
            <Button variant="outline" iconLeft={<Ico n="settings" s={16} />}>Edit Profile</Button>
          </div>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
            <StatCard label="Total Earnings" value="NPR 1,24,000" icon={<Ico n="banknote" />} iconTone="success" />
            <StatCard label="Active Gigs" value="3" icon={<Ico n="rocket" />} iconTone="info" />
            <StatCard label="Applications" value="12" icon={<Ico n="file-text" />} iconTone="soft" />
            <StatCard label="Avg Rating" value="4.9/5" icon={<Ico n="star" />} iconTone="soft" />
          </div>
          {/* Two columns */}
          <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 28 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--text-strong)", margin: 0 }}>Active Gigs</h2>
                <a href="#" onClick={(e)=>e.preventDefault()} style={{ fontFamily: "var(--font-text)", fontSize: 14, fontWeight: 600, color: "var(--brand-700)", textDecoration: "none" }}>View All</a>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 28 }}>
                {[
                  { t: "Frontend UI Bug Fixes", c: "Acme Tech Solutions", status: ["active", "In Progress"], line: "Next Milestone: Unit Testing (Oct 29)", amt: "NPR 45,000" },
                  { t: "Brand Identity Design", c: "Nova Creative", status: ["submitted", "Submitted"], line: "Status: Under Review", amt: "NPR 30,000" },
                ].map((g) => (
                  <Card key={g.t}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                      <div>
                        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text-strong)" }}>{g.t}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-text)", fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}><Ico n="building-2" s={15} />{g.c}</div>
                      </div>
                      <Badge tone={g.status[0]}>{g.status[1]}</Badge>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-subtle)", paddingTop: 14 }}>
                      <span style={{ fontFamily: "var(--font-text)", fontSize: 14, fontWeight: 600, color: "var(--text-body)" }}>{g.line}</span>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--text-strong)", fontVariantNumeric: "tabular-nums" }}>{g.amt}</span>
                    </div>
                  </Card>
                ))}
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--text-strong)", margin: "0 0 14px" }}>Recommended for You</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Card tone="dark" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 200 }}>
                  <div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                      <span style={{ fontFamily: "var(--font-text)", fontSize: 11, fontWeight: 600, background: "rgba(255,255,255,0.16)", color: "#fff", padding: "3px 8px", borderRadius: "var(--radius-xs)" }}>REACT</span>
                      <span style={{ fontFamily: "var(--font-text)", fontSize: 11, fontWeight: 600, background: "rgba(255,255,255,0.16)", color: "#fff", padding: "3px 8px", borderRadius: "var(--radius-xs)" }}>FIGMA</span>
                    </div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "#fff", lineHeight: 1.15 }}>UX/UI Designer for FinTech Startup</div>
                    <div style={{ fontFamily: "var(--font-text)", fontSize: 14, color: "var(--brand-200)", marginTop: 8 }}>Remote · 20h/week</div>
                  </div>
                  <Button onDark variant="primary" full>Apply Now</Button>
                </Card>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <Card>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-strong)", marginBottom: 8 }}>Python Scripting for Data Cleanup</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--font-text)", fontWeight: 700, fontSize: 15, color: "var(--success-600)" }}>NPR 4,000/hr</span>
                      <span style={{ fontFamily: "var(--font-text)", fontSize: 13, color: "var(--text-subtle)" }}>3 days ago</span>
                    </div>
                  </Card>
                  <Card>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-strong)", marginBottom: 8 }}>Market Research: Gen Z Trends</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--font-text)", fontWeight: 700, fontSize: 15, color: "var(--success-600)" }}>NPR 20,000 Fixed</span>
                      <span style={{ fontFamily: "var(--font-text)", fontSize: 13, color: "var(--text-subtle)" }}>New</span>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
            {/* Right rail */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <Card style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <Ico n="calendar" s={18} style={{ color: "var(--brand-700)" }} />
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text-strong)" }}>Upcoming</span>
                </div>
                {[
                  { d: "28", m: "OCT", t: "Interview: Acme Events", s: "10:30 AM · Video Call" },
                  { d: "30", m: "OCT", t: "Deadline: Logo Drafts", s: "5:00 PM · Submission Port" },
                ].map((u) => (
                  <div key={u.t} style={{ display: "flex", gap: 14, alignItems: "center", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", padding: "12px 14px", marginBottom: 10 }}>
                    <div style={{ textAlign: "center", minWidth: 36 }}>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-strong)", lineHeight: 1 }}>{u.d}</div>
                      <div style={{ fontFamily: "var(--font-text)", fontSize: 11, color: "var(--text-subtle)" }}>{u.m}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: "var(--font-text)", fontWeight: 600, fontSize: 14, color: "var(--text-strong)" }}>{u.t}</div>
                      <div style={{ fontFamily: "var(--font-text)", fontSize: 13, color: "var(--text-muted)" }}>{u.s}</div>
                    </div>
                  </div>
                ))}
              </Card>
              <Card tone="earth" style={{ padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontFamily: "var(--font-text)", fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.16)", padding: "4px 8px", borderRadius: "var(--radius-xs)" }}>Course in Progress</span>
                  <Ico n="graduation-cap" s={20} style={{ color: "rgba(255,255,255,0.85)" }} />
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "#fff", marginBottom: 12 }}>Meta Front-End Developer</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-text)", fontSize: 13, color: "#fff", marginBottom: 6 }}><span>Progress</span><span>68%</span></div>
                <ProgressBar value={68} onDark height={8} />
                <Button onDark variant="primary" full style={{ marginTop: 16 }}>Resume Course</Button>
              </Card>
              <div style={{ position: "relative", borderRadius: "var(--radius-md)", overflow: "hidden", minHeight: 150, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 18, background: "var(--brand-900)" }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: "url(../../assets/photos/hero-a.png)", backgroundSize: "cover", backgroundPosition: "center" }}></div>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(18,28,36,0.92) 0%, rgba(18,28,36,0.55) 55%, rgba(18,28,36,0.15) 100%)" }}></div>
                <div style={{ position: "relative" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "#fff" }}>Join the Peer Network</div>
                  <div style={{ fontFamily: "var(--font-text)", fontSize: 13, color: "rgba(255,255,255,0.85)" }}>Connect with 500+ students on campus</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  window.StudentDashboard = StudentDashboard;
})();
