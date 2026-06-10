// Aavasar — Sign Up split screen (testimonial left, form right). Registers <SignUpScreen>.
function SignUpScreen({ onClose }) {
  const { Button, Input, SegmentedControl, Checkbox, Avatar } = window.AavasarDesignSystem_e30e7a;
  const [role, setRole] = React.useState("student");
  const [agree, setAgree] = React.useState(false);
  const Ico = ({ n, s = 18, style }) => <i data-lucide={n} style={{ width: s, height: s, ...style }}></i>;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "grid", gridTemplateColumns: "1fr 1fr", background: "var(--surface-page)" }}>
      {/* Left — brand + testimonial */}
      <div style={{ background: "linear-gradient(160deg, var(--brand-600), var(--brand-800))", padding: "56px 64px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="../../assets/aavasar-mark.png" alt="" style={{ width: 44, height: 44, background: "#fff", borderRadius: "50%" }} />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 34, color: "#fff" }}>Aavasar</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "var(--radius-lg)", padding: 28, maxWidth: 360 }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 14, color: "var(--star)" }}>
            {[0,1,2,3,4].map(i => <Ico key={i} n="star" s={16} style={{ fill: "var(--star)" }} />)}
          </div>
          <p style={{ fontFamily: "var(--font-text)", fontSize: 18, lineHeight: 1.6, fontStyle: "italic", color: "#fff", margin: "0 0 20px" }}>
            "Aavasar helped me land my first UX internship while still in my second year. The platform is incredibly intuitive and professional."
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar name="Sarah Chen" size={44} />
            <div>
              <div style={{ fontFamily: "var(--font-text)", fontWeight: 700, fontSize: 15, color: "#fff" }}>Sarah Chen</div>
              <div style={{ fontFamily: "var(--font-text)", fontSize: 13, color: "var(--brand-200)" }}>Product Design Student</div>
            </div>
          </div>
        </div>
      </div>
      {/* Right — form */}
      <div style={{ padding: "56px 72px", display: "flex", flexDirection: "column", justifyContent: "center", overflowY: "auto", position: "relative" }}>
        <button onClick={onClose} aria-label="Close" style={{ position: "absolute", top: 24, right: 28, background: "none", border: "none", cursor: "pointer", color: "var(--ink-500)" }}><Ico n="x" s={24} /></button>
        <div style={{ maxWidth: 420, width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 34, color: "var(--text-strong)", margin: "0 0 6px" }}>Create your account</h1>
            <p style={{ fontFamily: "var(--font-text)", fontSize: 16, color: "var(--text-muted)", margin: 0 }}>Join the community and start your journey today.</p>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-text)", fontSize: 14, fontWeight: 600, color: "var(--text-strong)", marginBottom: 8 }}>I want to join as a:</div>
            <SegmentedControl value={role} onChange={setRole} options={[
              { value: "student", label: "Student", icon: <Ico n="graduation-cap" /> },
              { value: "recruiter", label: "Recruiter", icon: <Ico n="briefcase" /> },
            ]} />
          </div>
          <Input label="Full Name" placeholder="John Doe" />
          <Input label={role === "student" ? "Campus Email" : "Work Email"} type="email" placeholder={role === "student" ? "you@university.edu" : "you@company.com"} />
          <Input label="Password" passwordToggle helper="Must be at least 8 characters" />
          <Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)} label="I agree to the Terms of Service and Privacy Policy." />
          <Button variant="primary" size="lg" full disabled={!agree} onClick={onClose}>Create Account</Button>
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-subtle)" }}>
            <span style={{ flex: 1, height: 1, background: "var(--border-default)" }}></span>
            <span style={{ fontFamily: "var(--font-text)", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em" }}>OR CONTINUE WITH</span>
            <span style={{ flex: 1, height: 1, background: "var(--border-default)" }}></span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Button variant="outline" onClick={onClose}>Google</Button>
            <Button variant="outline" onClick={onClose}>LinkedIn</Button>
          </div>
          <div style={{ textAlign: "center", fontFamily: "var(--font-text)", fontSize: 14, color: "var(--text-muted)" }}>
            Already have an account? <a href="#" onClick={(e)=>{e.preventDefault();onClose&&onClose();}} style={{ color: "var(--brand-700)", fontWeight: 600, textDecoration: "none" }}>Log in</a>
          </div>
        </div>
      </div>
    </div>
  );
}
window.SignUpScreen = SignUpScreen;
