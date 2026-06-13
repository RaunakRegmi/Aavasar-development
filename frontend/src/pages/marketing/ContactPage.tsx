import { useState, type FormEvent } from "react";
import { Button, Card, Input } from "@shared/ui";
import { Icon, type IconName } from "@shared/icons";

const SUPPORT_EMAIL = "hello@aavasar.np";

export default function ContactPage() {
  return (
    <main className="container-page" style={{ paddingTop: 64, paddingBottom: 72 }}>
      <header style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 48px" }}>
        <h1 style={h1Style}>Get in touch</h1>
        <p style={leadStyle}>
          Questions, partnerships, press, or just want to say hello — we read every message.
          We typically reply within one working day.
        </p>
      </header>

      <div className="aav-split">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <ChannelCard
            icon="Mail"
            title="Email"
            description="The fastest way to reach the team."
            actionLabel={SUPPORT_EMAIL}
            href={`mailto:${SUPPORT_EMAIL}`}
          />
          <ChannelCard
            icon="MapPin"
            title="Based in"
            description="Kathmandu, Nepal — serving students across the country."
          />
          <ChannelCard
            icon="MessageSquare"
            title="Partnerships"
            description="Hiring 20+ students, university tie-ups, or events? Email us with the subject Partnership and we'll route you to the right person."
          />
        </div>

        <Card padding={28}>
          <h2 style={h2Style}>Send us a message</h2>
          <p style={{ ...leadStyle, fontSize: 14, margin: "4px 0 20px", textAlign: "left" }}>
            Prefer a form? Drop your details below and we'll get back to you by email.
          </p>
          <ContactForm />
        </Card>
      </div>
    </main>
  );
}

interface ChannelCardProps {
  icon: IconName;
  title: string;
  description: string;
  actionLabel?: string;
  href?: string;
}

function ChannelCard({ icon, title, description, actionLabel, href }: ChannelCardProps) {
  return (
    <Card padding={24}>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <span
          style={{
            width: 40,
            height: 40,
            borderRadius: "var(--radius-md)",
            background: "var(--brand-50)",
            color: "var(--brand-700)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon name={icon} size={20} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 16,
              color: "var(--text-strong)",
              margin: "0 0 4px",
            }}
          >
            {title}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-text)",
              fontSize: 14,
              lineHeight: 1.55,
              color: "var(--text-muted)",
              margin: 0,
            }}
          >
            {description}
          </p>
          {actionLabel && href ? (
            <a
              href={href}
              style={{
                display: "inline-block",
                marginTop: 10,
                fontFamily: "var(--font-text)",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--brand-700)",
                textDecoration: "none",
              }}
            >
              {actionLabel}
            </a>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // No backend yet — open the user's mail client with everything prefilled.
    // Replace with a real POST /contact endpoint when one ships.
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      subject || "Aavasar enquiry",
    )}&body=${encodeURIComponent(body)}`;
    window.location.assign(href);
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Input
        label="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Aarya Sharma"
        required
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
      />
      <Input
        label="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="How can we help?"
      />
      <label
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          fontFamily: "var(--font-text)",
          fontSize: 13,
          fontWeight: 600,
          color: "var(--text-strong)",
        }}
      >
        Message
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          placeholder="Tell us a bit about what you're looking for…"
          style={{
            fontFamily: "var(--font-text)",
            fontSize: 14,
            lineHeight: 1.5,
            padding: "10px 12px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-default)",
            background: "var(--surface-0)",
            color: "var(--text-strong)",
            outline: "none",
            resize: "vertical",
            minHeight: 110,
          }}
        />
      </label>
      <Button type="submit" variant="primary" size="lg">
        Send message
      </Button>
      {sent ? (
        <p
          style={{
            fontFamily: "var(--font-text)",
            fontSize: 13,
            color: "var(--text-muted)",
            margin: 0,
          }}
        >
          Your mail client just opened with everything filled in — hit send there and we'll
          take it from here.
        </p>
      ) : null}
    </form>
  );
}

const h1Style = {
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  fontSize: "clamp(28px, 5vw, 42px)",
  letterSpacing: "-0.02em",
  color: "var(--text-strong)",
  margin: "0 0 12px",
} as const;

const h2Style = {
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  fontSize: 20,
  letterSpacing: "-0.01em",
  color: "var(--text-strong)",
  margin: 0,
} as const;

const leadStyle = {
  fontFamily: "var(--font-text)",
  fontSize: 16,
  lineHeight: 1.6,
  color: "var(--text-muted)",
  margin: 0,
} as const;
