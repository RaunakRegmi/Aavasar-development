// Aavasar — Student onboarding wizard (4 steps). Registers <OnboardingFlow> on window.
(function () {
  const C = () => window.AavasarDesignSystem_e30e7a;
  const Ico = ({ n, s = 18, style }) => <i data-lucide={n} style={{ width: s, height: s, ...style }}></i>;
  const TOTAL = 4;

  // ---- Top bar + progress ----
  function TopBar({ step }) {
    const pct = (step / TOTAL) * 100;
    return (
      <header style={{ position: "sticky", top: 0, zIndex: 10, background: "var(--surface-0)", borderBottom: "1px solid var(--border-default)" }}>
        <div style={{ height: 64, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="../../assets/aavasar-mark.png" alt="" style={{ width: 30, height: 30 }} />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--brand-700)" }}>Aavasar</span>
          </div>
          <span style={{ fontFamily: "var(--font-text)", fontSize: 14, fontWeight: 600, color: "var(--text-muted)" }}>Step {step} of {TOTAL}</span>
        </div>
        <div style={{ height: 4, background: "var(--surface-2)" }}>
          <div style={{ height: "100%", width: pct + "%", background: step === TOTAL ? "var(--success-500)" : "var(--brand-700)", transition: "width var(--dur-slow) var(--ease-out)" }}></div>
        </div>
      </header>
    );
  }

  // ---- Reusable toggle chip ----
  function Chip({ label, on, onClick }) {
    return (
      <button onClick={onClick} style={{
        display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-text)", fontSize: 14, fontWeight: 600,
        padding: "9px 16px", borderRadius: "var(--radius-full)", cursor: "pointer",
        border: "1px solid " + (on ? "var(--brand-700)" : "var(--border-default)"),
        background: on ? "var(--brand-700)" : "var(--surface-0)", color: on ? "#fff" : "var(--text-body)",
        transition: "all var(--dur-fast) var(--ease-standard)",
      }}>{label}{on && <Ico n="check" s={15} />}</button>
    );
  }

  // ---- Step 1: Basic Information ----
  function StepBasic({ next }) {
    const { Input, Button, Card } = C();
    return (
      <div style={{ maxWidth: 640, margin: "48px auto" }}>
        <Card padding={40} style={{ boxShadow: "var(--shadow-md)" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 36, color: "var(--text-strong)", margin: "0 0 8px", letterSpacing: "-0.02em" }}>Basic Information</h1>
          <p style={{ fontFamily: "var(--font-text)", fontSize: 16, lineHeight: 1.5, color: "var(--text-muted)", margin: "0 0 28px" }}>Tell us about your academic background to help us match you with relevant micro-internships and gigs.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Input label="University / Institution" placeholder="e.g. Tribhuvan University" leading={<Ico n="graduation-cap" />} />
            <Input label="Degree & Major" placeholder="e.g. B.S. Computer Science" leading={<Ico n="book-open" />} />
            <Input label="Expected Graduation Year" placeholder="Select Year" defaultValue="2027" leading={<Ico n="calendar" />} trailing={<Ico n="chevron-down" s={18} />} />
          </div>
          <Button variant="primary" size="lg" full style={{ marginTop: 28 }} iconRight={<Ico n="arrow-right" s={18} />} onClick={next}>Continue</Button>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "var(--surface-1)", borderRadius: "var(--radius-sm)", padding: "14px 16px", marginTop: 24 }}>
            <Ico n="info" s={18} style={{ color: "var(--info-500)", flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontFamily: "var(--font-text)", fontSize: 13, lineHeight: 1.5, color: "var(--text-muted)" }}>Your academic details help us verify your student status and unlock exclusive internships. You can update this later in your profile settings.</span>
          </div>
        </Card>
      </div>
    );
  }

  // ---- Step 2: Skills & Interests ----
  function StepSkills({ next, back }) {
    const { Input, Button, Card } = C();
    const groups = {
      Design: ["UI Design", "UX Research", "Graphic Design", "Prototyping"],
      Development: ["React", "Tailwind CSS", "Node.js", "Python"],
      "Writing & Data": ["Content Writing", "Copywriting", "Data Analysis"],
    };
    const [picked, setPicked] = React.useState({ React: true });
    const toggle = (s) => setPicked((p) => ({ ...p, [s]: !p[s] }));
    return (
      <div style={{ maxWidth: 820, margin: "48px auto" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 38, color: "var(--text-strong)", margin: "0 0 8px", letterSpacing: "-0.02em" }}>What are you good at?</h1>
        <p style={{ fontFamily: "var(--font-text)", fontSize: 17, lineHeight: 1.5, color: "var(--text-muted)", margin: "0 0 28px", maxWidth: 620 }}>Select the skills and interests that best describe your talent. This helps us match you with the right gigs.</p>
        <Card padding={32} style={{ boxShadow: "var(--shadow-sm)" }}>
          <Input label="Search for a skill" placeholder="e.g., Python, Video Editing, SEO…" leading={<Ico n="search" />} />
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 22 }}>
            {Object.entries(groups).map(([g, skills]) => (
              <div key={g}>
                <div style={{ fontFamily: "var(--font-text)", fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-subtle)", marginBottom: 12 }}>{g}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {skills.map((s) => <Chip key={s} label={s} on={!!picked[s]} onClick={() => toggle(s)} />)}
                </div>
              </div>
            ))}
          </div>
        </Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24 }}>
          <Button variant="outline" onClick={back}>Back</Button>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontFamily: "var(--font-text)", fontSize: 14, color: "var(--text-subtle)" }}>You can always update these later</span>
            <Button variant="primary" onClick={next}>Continue</Button>
          </div>
        </div>
      </div>
    );
  }

  // ---- Step 3: Portfolio & Bio ----
  function StepPortfolio({ next, back }) {
    const { Input, Button, Card } = C();
    const [bio, setBio] = React.useState("");
    const links = [
      ["GitHub URL", "https://github.com/username", "code"],
      ["LinkedIn Profile", "https://linkedin.com/in/username", "linkedin"],
      ["Design Portfolio (Behance/Dribbble)", "https://behance.net/username", "palette"],
      ["Personal Website", "https://yourwebsite.com", "globe"],
    ];
    return (
      <div style={{ maxWidth: 880, margin: "40px auto" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 38, color: "var(--text-strong)", margin: "0 0 8px", letterSpacing: "-0.02em" }}>Build Your Professional Identity</h1>
        <p style={{ fontFamily: "var(--font-text)", fontSize: 17, lineHeight: 1.5, color: "var(--text-muted)", margin: "0 0 28px", maxWidth: 640 }}>Showcase your best work and tell potential employers who you are. This information will appear on your public profile and job applications.</p>

        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20, marginBottom: 20 }}>
          <Card padding={24}>
            <div style={{ fontFamily: "var(--font-text)", fontWeight: 600, fontSize: 14, color: "var(--text-strong)", marginBottom: 14 }}>Profile Picture</div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <div style={{ width: 120, height: 120, borderRadius: "var(--radius-md)", background: "var(--surface-2)", border: "2px dashed var(--border-strong)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-400)" }}><Ico n="camera" s={28} /></div>
              <Button variant="primary" size="sm">Upload Photo</Button>
              <span style={{ fontFamily: "var(--font-text)", fontSize: 12, color: "var(--text-subtle)" }}>JPG, PNG or GIF. Max 2MB.</span>
            </div>
          </Card>
          <Card padding={24}>
            <div style={{ fontFamily: "var(--font-text)", fontWeight: 600, fontSize: 14, color: "var(--text-strong)", marginBottom: 14 }}>Professional Bio</div>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Briefly describe your background, key skills, and what you're looking for in your next role…"
              style={{ width: "100%", minHeight: 150, resize: "vertical", fontFamily: "var(--font-text)", fontSize: 15, lineHeight: 1.6, color: "var(--text-strong)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", padding: "12px 14px", outline: "none", boxSizing: "border-box" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontFamily: "var(--font-text)", fontSize: 13, color: "var(--text-subtle)" }}>
              <span>Minimum 50 characters</span><span>{bio.length}/500</span>
            </div>
          </Card>
        </div>

        <Card padding={28} style={{ marginBottom: 20 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-strong)", margin: "0 0 18px" }}>Social &amp; Portfolio Links</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 24px" }}>
            {links.map(([label, ph, icon]) => <Input key={label} label={label} placeholder={ph} leading={<Ico n={icon} />} />)}
          </div>
        </Card>

        <Card padding={28} style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-strong)", margin: "0 0 4px" }}>Featured Project</h3>
              <p style={{ fontFamily: "var(--font-text)", fontSize: 14, color: "var(--text-muted)", margin: 0 }}>Add one project you're most proud of to stand out.</p>
            </div>
            <Button variant="secondary" size="sm" iconLeft={<Ico n="plus" s={16} />}>Add Project</Button>
          </div>
          <div style={{ border: "2px dashed var(--border-strong)", borderRadius: "var(--radius-md)", padding: "40px 24px", textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: "var(--radius-sm)", background: "var(--surface-2)", color: "var(--ink-400)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}><Ico n="folder" s={22} /></div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text-strong)", marginBottom: 4 }}>No projects added yet</div>
            <div style={{ fontFamily: "var(--font-text)", fontSize: 14, color: "var(--text-muted)" }}>Uploading a featured project increases your hiring chances by up to 40%.</div>
          </div>
        </Card>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="outline" onClick={back}>Back</Button>
          <Button variant="primary" onClick={next} iconRight={<Ico n="check" s={18} />}>Finish Profile</Button>
        </div>
      </div>
    );
  }

  // ---- Step 4: Profile Complete ----
  function StepComplete({ restart }) {
    const { Button, Card, Avatar, Tag } = C();
    const confetti = React.useMemo(() => Array.from({ length: 36 }).map((_, i) => {
      const colors = ["var(--brand-700)", "var(--success-500)", "var(--info-500)", "var(--star)", "var(--brand-300)"];
      return { left: Math.random() * 100, delay: Math.random() * 0.6, dur: 1.6 + Math.random() * 1.4, color: colors[i % colors.length], size: 6 + Math.random() * 6, rot: Math.random() * 360 };
    }), []);
    return (
      <div style={{ position: "relative", maxWidth: 560, margin: "56px auto", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, top: -40, pointerEvents: "none", overflow: "hidden", height: 400 }}>
          {confetti.map((c, i) => (
            <span key={i} style={{ position: "absolute", left: c.left + "%", top: -14, width: c.size, height: c.size, background: c.color, borderRadius: 1, transform: `rotate(${c.rot}deg)`, animation: `aav-fall ${c.dur}s var(--ease-standard) ${c.delay}s forwards` }}></span>
          ))}
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ width: 72, height: 72, borderRadius: "var(--radius-full)", background: "var(--success-100)", color: "var(--success-600)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}><Ico n="check" s={36} /></div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 38, color: "var(--text-strong)", margin: "0 0 10px", letterSpacing: "-0.02em" }}>You're all set!</h1>
          <p style={{ fontFamily: "var(--font-text)", fontSize: 17, lineHeight: 1.5, color: "var(--text-muted)", margin: "0 auto 28px", maxWidth: 420 }}>Your profile is now live and visible to recruiters. Welcome to the Aavasar ecosystem.</p>
          <Card padding={24} style={{ textAlign: "left", marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Avatar src="../../assets/photos/peer-network.jpg" name="Pratikshya Sharma" size={56} shape="squircle" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text-strong)", whiteSpace: "nowrap" }}>Pratikshya Sharma</span>
                  <Ico n="badge-check" s={16} style={{ color: "var(--info-500)", flexShrink: 0 }} />
                </div>
                <div style={{ fontFamily: "var(--font-text)", fontSize: 14, color: "var(--text-muted)", marginTop: 2 }}>B.S. Computer Science · Tribhuvan University</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}><Tag variant="brand">React</Tag><Tag variant="brand">Python</Tag><Tag>UX Research</Tag></div>
          </Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Button variant="primary" size="lg" full iconRight={<Ico n="arrow-right" s={18} />}>Find Your First Gig</Button>
            <Button variant="outline" size="lg" full>View Public Profile</Button>
          </div>
          <p style={{ fontFamily: "var(--font-text)", fontSize: 13, color: "var(--text-subtle)", marginTop: 20 }}>
            Need to change something? <a href="#" onClick={(e) => { e.preventDefault(); restart(); }} style={{ color: "var(--brand-700)", fontWeight: 600, textDecoration: "none" }}>Restart the tour</a>.
          </p>
        </div>
      </div>
    );
  }

  function OnboardingFlow() {
    const [step, setStep] = React.useState(1);
    React.useEffect(() => { lucide.createIcons(); });
    const go = (n) => { setStep(n); window.scrollTo({ top: 0 }); };
    return (
      <div style={{ minHeight: "100%", background: "var(--surface-page)" }}>
        <style>{`@keyframes aav-fall { to { transform: translateY(380px) rotate(540deg); opacity: 0; } }`}</style>
        <TopBar step={step} />
        <div style={{ padding: "0 24px 64px" }}>
          {step === 1 && <StepBasic next={() => go(2)} />}
          {step === 2 && <StepSkills next={() => go(3)} back={() => go(1)} />}
          {step === 3 && <StepPortfolio next={() => go(4)} back={() => go(2)} />}
          {step === 4 && <StepComplete restart={() => go(1)} />}
        </div>
      </div>
    );
  }
  window.OnboardingFlow = OnboardingFlow;
})();
