// Aavasar marketing — landing page sections. Registers <LandingMain> on window.
(function () {
  const C = () => window.AavasarDesignSystem_e30e7a;
  const wrap = { maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 var(--container-pad)" };
  const Ico = ({ n, s = 20, style }) => <i data-lucide={n} style={{ width: s, height: s, ...style }}></i>;

  function Hero({ onCta }) {
    const { Button, Tag } = C();
    return (
      <section style={{ ...wrap, paddingTop: 56, paddingBottom: 24 }}>
        <div style={{
          position: "relative", borderRadius: "var(--radius-xl)", overflow: "hidden",
          minHeight: 340, display: "flex", alignItems: "center", background: "var(--brand-900)",
        }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "url(../../assets/photos/hero-a.png)", backgroundSize: "cover", backgroundPosition: "center" }}></div>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(18,28,36,0.95) 0%, rgba(18,28,36,0.85) 48%, rgba(18,28,36,0.5) 78%, rgba(18,28,36,0.28) 100%)" }}></div>
          <div style={{ position: "relative", padding: "48px 56px", maxWidth: 620 }}>
            <span style={{ display: "inline-block", fontFamily: "var(--font-text)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--brand-200)", background: "rgba(255,255,255,0.12)", padding: "6px 12px", borderRadius: "var(--radius-full)", marginBottom: 20 }}>
              Empowering Student Careers
            </span>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 44, lineHeight: 1.1, letterSpacing: "-0.02em", color: "#fff", margin: "0 0 16px" }}>
              Find your next gig and earn on your schedule
            </h1>
            <p style={{ fontFamily: "var(--font-text)", fontSize: 17, lineHeight: 1.55, color: "rgba(255,255,255,0.85)", margin: "0 0 28px", maxWidth: 480 }}>
              Join a community of 10,000+ students getting paid for their professional skills while they study. No long-term commitments, just great opportunities.
            </p>
            <div style={{ display: "flex", gap: 14 }}>
              <Button onDark variant="primary" size="lg" onClick={onCta}>Explore All Gigs</Button>
              <Button onDark variant="outline" size="lg" onClick={onCta}>How It Works</Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function StatsStrip() {
    const items = [
      { v: "10,000+", l: "Enrolled Students" },
      { v: "500+", l: "Verified Businesses" },
      { v: "4.9/5", l: "Average Rating", star: true },
    ];
    return (
      <section style={{ ...wrap, paddingBottom: 56 }}>
        <div style={{ display: "flex", background: "var(--surface-2)", borderRadius: "var(--radius-lg)", padding: "28px 0" }}>
          {items.map((it, i) => (
            <div key={it.l} style={{ flex: 1, textAlign: "center", borderLeft: i ? "1px solid var(--border-default)" : "none" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 34, color: "var(--brand-700)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                {it.v}{it.star && <Ico n="star" s={22} style={{ color: "var(--star)", fill: "var(--star)" }} />}
              </div>
              <div style={{ fontFamily: "var(--font-text)", fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>{it.l}</div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  function HowItWorks() {
    const cols = [
      { icon: "graduation-cap", h: "For Students", steps: [
        ["Create Your Profile", "Highlight your skills, portfolio, and education to stand out to employers."],
        ["Find Relevant Gigs", "Browse thousands of student-specific tasks and apply with one click."],
        ["Get Paid Securely", "Complete your tasks and receive payments directly to your account. No hidden fees."],
      ]},
      { icon: "building-2", h: "For Businesses", steps: [
        ["Post a Task", "Define your project, set your budget, and post in minutes to reach top student talent."],
        ["Review Top Talent", "Filter through vetted applications and choose the best fit for your needs."],
        ["Scale Your Team", "Get quality work done efficiently while helping students build their portfolios."],
      ]},
    ];
    return (
      <section style={{ ...wrap, paddingBottom: 64 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 34, letterSpacing: "-0.02em", color: "var(--text-strong)", margin: "0 0 10px" }}>Seamless Experience for Everyone</h2>
          <p style={{ fontFamily: "var(--font-text)", fontSize: 16, color: "var(--text-muted)", margin: 0 }}>Whether you're looking to earn or looking to hire, Aavasar makes it simple, fast, and secure.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, maxWidth: 920, margin: "0 auto" }}>
          {cols.map((col) => (
            <div key={col.h}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <span style={{ width: 40, height: 40, borderRadius: "var(--radius-sm)", background: "var(--brand-700)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ico n={col.icon} /></span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--text-strong)" }}>{col.h}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {col.steps.map(([h, b], i) => (
                  <div key={h} style={{ display: "flex", gap: 16 }}>
                    <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: "var(--radius-full)", background: "var(--surface-2)", color: "var(--brand-700)", fontWeight: 700, fontSize: 13, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-text)" }}>{i + 1}</span>
                    <div>
                      <div style={{ fontFamily: "var(--font-text)", fontWeight: 700, fontSize: 16, color: "var(--text-strong)", marginBottom: 4 }}>{h}</div>
                      <div style={{ fontFamily: "var(--font-text)", fontSize: 14, lineHeight: 1.5, color: "var(--text-muted)" }}>{b}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  function FeaturedGigs({ onCta }) {
    const { Card, Badge, Tag, Button } = C();
    return (
      <section style={{ ...wrap, paddingBottom: 64 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--text-strong)", margin: "0 0 4px" }}>Featured Gigs</h2>
            <p style={{ fontFamily: "var(--font-text)", fontSize: 14, color: "var(--text-muted)", margin: 0 }}>Log in to apply for these top-tier opportunities.</p>
          </div>
          <a href="#" onClick={(e)=>{e.preventDefault();onCta&&onCta();}} style={{ fontFamily: "var(--font-text)", fontSize: 14, fontWeight: 600, color: "var(--brand-700)", textDecoration: "none" }}>View all →</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16 }}>
          <Card padding={0} style={{ overflow: "hidden", display: "flex" }}>
            <div style={{ width: 220, flexShrink: 0, backgroundImage: "url(../../assets/photos/hero-b.png)", backgroundSize: "cover", backgroundPosition: "center" }}></div>
            <div style={{ padding: 24, flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <Badge tone="premium" uppercase>Premium</Badge>
                <span style={{ fontFamily: "var(--font-text)", fontWeight: 700, fontSize: 18, color: "var(--success-600)" }}>रु45/hr</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-strong)", margin: "0 0 8px" }}>Lead UI Designer for EdTech MVP</h3>
              <p style={{ fontFamily: "var(--font-text)", fontSize: 15, lineHeight: 1.5, color: "var(--text-muted)", margin: "0 0 16px" }}>Help us shape the future of learning by designing a cohesive, accessible, and vibrant mobile interface for K-12 students.</p>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Tag>Remote</Tag><Tag>2 Weeks</Tag>
                <span style={{ flex: 1 }}></span>
                <Button variant="outline" size="sm" onClick={onCta} iconLeft={<Ico n="lock" s={15} />}>Log in to Apply</Button>
              </div>
            </div>
          </Card>
          <Card tone="dark" radius="xl" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <span style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", background: "rgba(255,255,255,0.16)", color: "var(--brand-200)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}><Ico n="graduation-cap" s={22} /></span>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--brand-200)", margin: "0 0 12px" }}>Advanced Calculus Tutor</h3>
              <p style={{ fontFamily: "var(--font-text)", fontSize: 15, lineHeight: 1.5, color: "var(--brand-200)", opacity: 0.85, margin: 0 }}>Tutoring for high-school senior preparing for AP exams. 3 hours per week at the City Library.</p>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-text)", fontWeight: 700, fontSize: 28, color: "var(--brand-200)", margin: "16px 0 12px" }}>रु35/hr</div>
              <Button onDark variant="primary" full onClick={onCta}>Sign Up to Apply</Button>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  function SuccessStories() {
    const { Card, Avatar } = C();
    const items = [
      { n: "Alex Rivera", r: "Design Student @ ArtInst", q: "Aavasar helped me land my first UI internship while still in university. The portfolio I built through small gigs was exactly what recruiters were looking for." },
      { n: "Sarah Jenkins", r: "CS Major @ TechU", q: "I paid for my final semester purely through Python tutoring gigs I found here. The platform is so easy to use and the payments are always on time." },
      { n: "Michael Cho", r: "Marketing Junior @ State", q: "Managing social media for local startups via Aavasar gave me real-world experience that no classroom could provide. It's been a game changer." },
    ];
    return (
      <section style={{ background: "var(--surface-1)", padding: "56px 0", borderTop: "1px solid var(--border-default)", borderBottom: "1px solid var(--border-default)" }}>
        <div style={{ ...wrap }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 28, color: "var(--text-strong)", margin: "0 0 8px" }}>Success Stories</h2>
            <p style={{ fontFamily: "var(--font-text)", fontSize: 15, color: "var(--text-muted)", margin: 0 }}>Hear from students who kickstarted their careers on Aavasar.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            {items.map((it) => (
              <Card key={it.n} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar name={it.n} size={44} />
                  <div>
                    <div style={{ fontFamily: "var(--font-text)", fontWeight: 700, fontSize: 15, color: "var(--text-strong)" }}>{it.n}</div>
                    <div style={{ fontFamily: "var(--font-text)", fontSize: 13, color: "var(--text-subtle)" }}>{it.r}</div>
                  </div>
                </div>
                <p style={{ fontFamily: "var(--font-text)", fontSize: 14, lineHeight: 1.6, fontStyle: "italic", color: "var(--text-body)", margin: 0 }}>"{it.q}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--success-600)", fontFamily: "var(--font-text)", fontSize: 13, fontWeight: 600 }}>
                  <Ico n="badge-check" s={16} /> Verified Student
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  function RecentGigs({ onCta }) {
    const { Card, Tag, Button } = C();
    const gigs = [
      { cat: "PHOTOGRAPHY", t: "Event Photographer", d: "Looking for a student photographer to cover a 4-hour campus event.", rate: "रु25/hr", tags: ["4 Hours", "On-site"], by: "Acme Events" },
      { cat: "DATA ENTRY", t: "Catalog Data Entry", d: "Updating product descriptions for a local retail e-commerce store.", rate: "रु18/hr", tags: ["3 Days", "Remote"], by: "Urban Goods" },
      { cat: "VIDEO EDITING", t: "Social Media Reels Editor", d: "Edit 5 vertical videos for TikTok and Instagram. Raw footage provided.", rate: "रु20/hr", tags: ["Project-based", "Remote"], by: "Creator Studio" },
    ];
    return (
      <section style={{ ...wrap, paddingTop: 64, paddingBottom: 48 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--text-strong)", margin: "0 0 20px" }}>Recently Added Gigs</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
          {gigs.map((g) => (
            <Card key={g.t} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: "var(--font-text)", fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", color: "var(--text-subtle)" }}>{g.cat}</span>
                <span style={{ fontFamily: "var(--font-text)", fontWeight: 700, fontSize: 16, color: "var(--success-600)" }}>{g.rate}</span>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--text-strong)" }}>{g.t}</div>
              <p style={{ fontFamily: "var(--font-text)", fontSize: 14, lineHeight: 1.5, color: "var(--text-muted)", margin: 0, flex: 1 }}>{g.d}</p>
              <div style={{ display: "flex", gap: 8 }}>{g.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-subtle)", paddingTop: 12 }}>
                <span style={{ fontFamily: "var(--font-text)", fontSize: 13, color: "var(--text-subtle)" }}>By {g.by}</span>
                <a href="#" onClick={(e)=>{e.preventDefault();onCta&&onCta();}} style={{ fontFamily: "var(--font-text)", fontSize: 14, fontWeight: 600, color: "var(--brand-700)", textDecoration: "none" }}>Apply →</a>
              </div>
            </Card>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Button variant="outline" onClick={onCta}>See 50+ More Opportunities</Button>
        </div>
      </section>
    );
  }

  function CtaBand({ onCta }) {
    const { Button } = C();
    return (
      <section style={{ ...wrap, paddingBottom: 72 }}>
        <div style={{ borderRadius: "var(--radius-xl)", background: "linear-gradient(135deg, var(--brand-700), var(--brand-900))", padding: "56px 48px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 34, color: "#fff", letterSpacing: "-0.02em", margin: "0 0 14px" }}>Your Next Opportunity Starts Here</h2>
          <p style={{ fontFamily: "var(--font-text)", fontSize: 16, lineHeight: 1.6, color: "var(--brand-200)", margin: "0 auto 28px", maxWidth: 540 }}>Join thousands of students and companies building the future of work. Sign up today and browse your first gig in seconds.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
            <Button onDark variant="primary" size="lg" onClick={onCta}>Sign Up Now</Button>
            <Button onDark variant="secondary" size="lg" onClick={onCta}>Hire Talent</Button>
          </div>
        </div>
      </section>
    );
  }

  function LandingMain({ onCta }) {
    return (
      <main>
        <Hero onCta={onCta} />
        <StatsStrip />
        <HowItWorks />
        <FeaturedGigs onCta={onCta} />
        <SuccessStories />
        <RecentGigs onCta={onCta} />
        <CtaBand onCta={onCta} />
      </main>
    );
  }
  window.LandingMain = LandingMain;
})();
