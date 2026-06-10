// Aavasar — Recruiter Admin dashboard. Registers <RecruiterDashboard> on window.
(function () {
  const C = () => window.AavasarDesignSystem_e30e7a;
  const Ico = ({ n, s = 20, style }) => <i data-lucide={n} style={{ width: s, height: s, ...style }}></i>;

  function TopNav() {
    const { Button, IconButton, Avatar } = C();
    const [active, setActive] = React.useState("Dashboard");
    const links = ["Dashboard", "Browse Talent", "Resources"];
    return (
      <header style={{ position: "sticky", top: 0, zIndex: 20, background: "var(--surface-0)", borderBottom: "1px solid var(--border-default)" }}>
        <nav style={{ height: "var(--nav-height)", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src="../../assets/aavasar-mark.png" alt="" style={{ width: 30, height: 30 }} />
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--brand-700)" }}>Aavasar</span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {links.map((l) => {
                const on = active === l;
                return <button key={l} onClick={() => setActive(l)} style={{ fontFamily: "var(--font-text)", fontSize: 15, fontWeight: on ? 600 : 500, color: on ? "var(--brand-700)" : "var(--text-muted)", background: "none", border: "1px solid " + (on ? "var(--border-default)" : "transparent"), borderRadius: "var(--radius-sm)", padding: "7px 12px", cursor: "pointer" }}>{l}</button>;
              })}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <IconButton ariaLabel="Notifications"><Ico n="bell" s={20} /></IconButton>
            <IconButton ariaLabel="Help"><Ico n="help-circle" s={20} /></IconButton>
            <Button variant="primary">Post a Gig</Button>
            <Avatar src="../../assets/photos/peer-network.jpg" name="Sushma" size={40} />
          </div>
        </nav>
      </header>
    );
  }

  function SideNav() {
    const { Button } = C();
    const [active, setActive] = React.useState("Overview");
    const items = [["Overview", "layout-grid"], ["My Gigs", "briefcase"], ["Applicants", "users"], ["Messages", "mail"], ["Settings", "settings"]];
    return (
      <aside style={{ width: 240, flexShrink: 0, padding: 24, display: "flex", flexDirection: "column", gap: 20, borderRight: "1px solid var(--border-default)", minHeight: "100%" }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-strong)" }}>Recruiter Admin</div>
          <div style={{ fontFamily: "var(--font-text)", fontSize: 13, color: "var(--text-subtle)" }}>Manage your talent pipeline</div>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {items.map(([label, icon]) => {
            const on = active === label;
            return <button key={label} onClick={() => setActive(label)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-text)", fontSize: 15, fontWeight: on ? 600 : 500, background: on ? "var(--brand-700)" : "transparent", color: on ? "#fff" : "var(--text-muted)" }}><Ico n={icon} s={18} />{label}</button>;
          })}
        </nav>
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
          <button style={{ fontFamily: "var(--font-text)", fontSize: 15, fontWeight: 600, color: "var(--success-600)", background: "var(--success-100)", border: "none", borderRadius: "var(--radius-sm)", padding: "10px 12px", cursor: "pointer" }}>Upgrade Plan</button>
          <button style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer", background: "transparent", color: "var(--text-muted)", fontFamily: "var(--font-text)", fontSize: 15 }}><Ico n="log-out" s={18} />Logout</button>
        </div>
      </aside>
    );
  }

  function RecruiterDashboard() {
    const { Card, StatCard, Badge, Button, Avatar, Tag, ProgressBar } = C();
    React.useEffect(() => { lucide.createIcons(); });
    const gigs = [
      { t: "UI/UX Design Intern", sub: "Product Team · Remote", date: "Oct 12, 2023", apps: 24, pct: 80, status: ["active", "Active"] },
      { t: "Junior Web Developer", sub: "Engineering · Hybrid", date: "Oct 15, 2023", apps: 12, pct: 45, status: ["reviewing", "Reviewing"] },
      { t: "Social Media Coordinator", sub: "Marketing · Remote", date: "Oct 18, 2023", apps: 31, pct: 95, status: ["active", "Active"] },
      { t: "Content Writer (Freelance)", sub: "Editorial · Remote", date: "Oct 20, 2023", apps: 9, pct: 30, status: ["draft", "Draft"] },
    ];
    return (
      <div style={{ background: "var(--surface-page)", minHeight: "100%" }}>
        <TopNav />
        <div style={{ display: "flex" }}>
          <SideNav />
          <main style={{ flex: 1, padding: "32px 40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
              <div>
                <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 38, color: "var(--text-strong)", margin: 0, letterSpacing: "-0.02em" }}>Welcome back, Sushma!</h1>
                <p style={{ fontFamily: "var(--font-text)", fontSize: 16, color: "var(--text-muted)", margin: "4px 0 0" }}>Today is Tuesday, October 24th, 2023</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex" }}>
                  {["Aayush", "Binod", "Isha"].map((n, i) => <span key={n} style={{ marginLeft: i ? -10 : 0 }}><Avatar name={n} size={36} style={{ border: "2px solid var(--surface-page)" }} /></span>)}
                  <span style={{ marginLeft: -10, width: 36, height: 36, borderRadius: "9999px", background: "var(--surface-2)", border: "2px solid var(--surface-page)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-text)", fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>+12</span>
                </div>
                <span style={{ fontFamily: "var(--font-text)", fontSize: 14, color: "var(--text-muted)" }}>Recent applicants for UX Researcher</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
              <StatCard label="Active Gigs" value="14" delta="+2 this week" icon={<Ico n="briefcase" />} iconTone="slate" />
              <StatCard label="New Applicants" value="42" delta="+18%" icon={<Ico n="user-plus" />} iconTone="info" />
              <StatCard label="Pending Interviews" value="8" delta="Next: 2 PM" deltaTone="neutral" icon={<Ico n="calendar" />} iconTone="earth" />
              <StatCard label="Total Hired" value="128" delta="Total" deltaTone="neutral" icon={<Ico n="check-circle" />} iconTone="success" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: 28 }}>
              <Card padding={0}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid var(--border-subtle)" }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-strong)", margin: 0 }}>Active Gigs</h2>
                  <a href="#" onClick={(e)=>e.preventDefault()} style={{ fontFamily: "var(--font-text)", fontSize: 14, fontWeight: 600, color: "var(--brand-700)", textDecoration: "none" }}>View All →</a>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>{["Gig Title", "Date Posted", "Applicants", "Status"].map((h) => <th key={h} style={{ textAlign: "left", padding: "12px 24px", fontFamily: "var(--font-text)", fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {gigs.map((g) => (
                      <tr key={g.t}>
                        <td style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-subtle)" }}>
                          <div style={{ fontFamily: "var(--font-text)", fontWeight: 600, fontSize: 15, color: "var(--text-strong)" }}>{g.t}</div>
                          <div style={{ fontFamily: "var(--font-text)", fontSize: 13, color: "var(--text-subtle)" }}>{g.sub}</div>
                        </td>
                        <td style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-subtle)", fontFamily: "var(--font-text)", fontSize: 14, color: "var(--text-muted)" }}>{g.date}</td>
                        <td style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-subtle)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-strong)" }}>{g.apps}</span>
                            <div style={{ width: 70 }}><ProgressBar value={g.pct} height={6} /></div>
                          </div>
                        </td>
                        <td style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-subtle)" }}><Badge tone={g.status[0]}>{g.status[1]}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
              <Card style={{ padding: 0 }}>
                <div style={{ padding: "20px 22px 12px" }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-strong)", margin: 0 }}>New Applicants</h2>
                  <p style={{ fontFamily: "var(--font-text)", fontSize: 13, color: "var(--text-subtle)", margin: "2px 0 0" }}>Review top student talent</p>
                </div>
                <div style={{ padding: "0 22px" }}>
                  <div style={{ border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: 16 }}>
                    <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                      <Avatar name="Aayush Shrestha" size={48} shape="squircle" />
                      <div>
                        <div style={{ fontFamily: "var(--font-text)", fontWeight: 700, fontSize: 15, color: "var(--text-strong)" }}>Aayush Shrestha</div>
                        <div style={{ fontFamily: "var(--font-text)", fontSize: 13, color: "var(--text-muted)" }}>Applied for UI/UX Design Intern</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, marginBottom: 14 }}><Tag>FIGMA</Tag><Tag>PROTOTYPING</Tag><Tag>PYTHON</Tag></div>
                    <Button variant="primary" full>View Profile</Button>
                  </div>
                  {[["Binod Thapa", "Web Developer Applicant"], ["Isha Giri", "Social Media Coordinator"], ["Rohan Adhikari", "Content Writer Applicant"]].map(([n, r]) => (
                    <div key={n} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px dashed var(--border-default)" }}>
                      <Avatar name={n} size={40} />
                      <div><div style={{ fontFamily: "var(--font-text)", fontWeight: 600, fontSize: 14, color: "var(--text-strong)" }}>{n}</div><div style={{ fontFamily: "var(--font-text)", fontSize: 13, color: "var(--text-subtle)" }}>{r}</div></div>
                    </div>
                  ))}
                  <div style={{ textAlign: "center", padding: "14px 0 18px" }}>
                    <a href="#" onClick={(e)=>e.preventDefault()} style={{ fontFamily: "var(--font-text)", fontSize: 14, fontWeight: 600, color: "var(--brand-700)", textDecoration: "none" }}>View 18 more applicants</a>
                  </div>
                </div>
              </Card>
            </div>
            <div style={{ marginTop: 28, borderRadius: "var(--radius-lg)", background: "linear-gradient(135deg, var(--brand-700), var(--brand-900))", padding: "32px 36px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 32 }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "#fff", margin: "0 0 8px" }}>Talent Pulse: October Report</h3>
                <p style={{ fontFamily: "var(--font-text)", fontSize: 15, lineHeight: 1.6, color: "var(--brand-200)", margin: 0, maxWidth: 620 }}>Student interest in your active gigs has increased by 24% compared to last month. Use our new 'Instant Interview' feature to connect with top performers faster. Hiring costs estimated at NPR 45,000 per placement.</p>
              </div>
              <Button onDark variant="primary" size="lg" style={{ flexShrink: 0 }}>Explore Reports</Button>
            </div>
          </main>
        </div>
      </div>
    );
  }
  window.RecruiterDashboard = RecruiterDashboard;
})();
