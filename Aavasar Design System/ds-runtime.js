// ds-runtime.js — PREVIEW SHIM (auto-derived from components/**/*.jsx).
// Contains JSX; load via <script type="text/babel" src="<rel>/ds-runtime.js"></script>
// after React + Babel. The official compiled library is _ds_bundle.js (used in the
// Design System tab / consuming projects); this shim renders the same components on the
// plain serve/preview route, where the virtual _ds_bundle.js is not served.
// Regenerate after editing any component .jsx.
const { useState, useEffect, useRef, useCallback } = React;

// ---- components/buttons/Button.jsx ----
/**
 * Aavasar Button — solid slate primary, ghost secondary, outline,
 * plus on-dark inversion. 4px radius, soft shadow, quick color states.
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  onDark = false,
  full = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { padding: "6px 14px", fontSize: 14, height: 36 },
    md: { padding: "8px 20px", fontSize: 16, height: 40 },
    lg: { padding: "12px 24px", fontSize: 16, height: 48 },
  };
  const s = sizes[size] || sizes.md;

  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontFamily: "var(--font-text)",
    fontWeight: 600,
    fontSize: s.fontSize,
    lineHeight: 1.5,
    padding: s.padding,
    minHeight: s.height,
    width: full ? "100%" : "auto",
    borderRadius: "var(--radius-xs)",
    border: "1px solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background var(--dur-fast) var(--ease-standard), border-color var(--dur-fast), color var(--dur-fast)",
    boxSizing: "border-box",
    whiteSpace: "nowrap",
    ...style,
  };

  const variants = {
    primary: {
      background: "var(--primary)",
      color: "#fff",
      boxShadow: "var(--shadow-xs)",
    },
    secondary: {
      background: "transparent",
      color: "var(--brand-700)",
    },
    outline: {
      background: "var(--surface-0)",
      color: "var(--brand-700)",
      borderColor: "var(--border-default)",
      boxShadow: "var(--shadow-xs)",
    },
    danger: {
      background: "var(--danger-500)",
      color: "#fff",
      boxShadow: "var(--shadow-xs)",
    },
  };

  const onDarkVariants = {
    primary: { background: "#fff", color: "var(--brand-700)" },
    secondary: { background: "rgba(255,255,255,0.12)", color: "#fff" },
    outline: { background: "transparent", color: "#fff", borderColor: "rgba(255,255,255,0.4)" },
    danger: { background: "var(--danger-500)", color: "#fff" },
  };

  let look = (onDark ? onDarkVariants : variants)[variant] || variants.primary;
  if (disabled) {
    look = onDark
      ? { background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)" }
      : { background: "var(--ink-300)", color: "#fff" };
  }

  const hoverBg = {
    primary: "var(--primary-hover)",
    secondary: "var(--brand-50)",
    outline: "var(--surface-1)",
    danger: "var(--danger-600)",
  };

  const handleEnter = (e) => {
    if (disabled || onDark) return;
    if (variant === "secondary" || variant === "outline") e.currentTarget.style.background = hoverBg[variant];
    else e.currentTarget.style.background = hoverBg[variant];
  };
  const handleLeave = (e) => {
    if (disabled) return;
    e.currentTarget.style.background = look.background;
  };

  return (
    <button
      style={{ ...base, ...look }}
      disabled={disabled}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}

// ---- components/buttons/IconButton.jsx ----
/**
 * IconButton — square, subtle, for nav/toolbar actions (bell, settings,
 * help, share). ~12px radius squircle; hover fills with a faint tint.
 */
function IconButton({
  children,
  size = 36,
  variant = "ghost",
  onDark = false,
  ariaLabel = "",
  style = {},
  ...rest
}) {
  const looks = {
    ghost: { background: "transparent", color: "var(--ink-700)", border: "1px solid transparent" },
    bordered: { background: "var(--surface-0)", color: "var(--ink-700)", border: "1px solid var(--border-default)" },
  };
  const look = onDark
    ? { background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid transparent" }
    : looks[variant] || looks.ghost;

  return (
    <button
      aria-label={ariaLabel}
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "var(--radius-md)",
        cursor: "pointer",
        transition: "background var(--dur-fast) var(--ease-standard)",
        ...look,
        ...style,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = onDark ? "rgba(255,255,255,0.2)" : "var(--surface-2)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = look.background; }}
      {...rest}
    >
      {children}
    </button>
  );
}

// ---- components/forms/Input.jsx ----
/**
 * Text input with label + helper. White fill, 1px border, 4–8px radius,
 * slate focus ring. Supports password reveal and trailing element.
 */
function Input({
  label,
  helper,
  error,
  type = "text",
  placeholder = "",
  value,
  defaultValue,
  onChange,
  leading = null,
  trailing = null,
  passwordToggle = false,
  id,
  style = {},
  ...rest
}) {
  const [show, setShow] = useState(false);
  const [focus, setFocus] = useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  const effectiveType = passwordToggle ? (show ? "text" : "password") : type;
  const borderColor = error ? "var(--danger-500)" : focus ? "var(--border-focus)" : "var(--border-default)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", ...style }}>
      {label && (
        <label htmlFor={inputId} style={{ fontFamily: "var(--font-text)", fontSize: 14, fontWeight: 600, color: "var(--text-strong)" }}>
          {label}
        </label>
      )}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {leading && (
          <div style={{ position: "absolute", left: 12, display: "flex", alignItems: "center", color: "var(--ink-500)", pointerEvents: "none" }}>{leading}</div>
        )}
        <input
          id={inputId}
          type={effectiveType}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            width: "100%",
            fontFamily: "var(--font-text)",
            fontSize: 16,
            color: "var(--text-strong)",
            background: "var(--surface-0)",
            border: `1px solid ${borderColor}`,
            borderRadius: "var(--radius-sm)",
            padding: "11px 14px",
            paddingLeft: leading ? 42 : 14,
            paddingRight: (passwordToggle || trailing) ? 44 : 14,
            outline: "none",
            boxShadow: focus ? "var(--shadow-focus)" : "none",
            transition: "border-color var(--dur-fast), box-shadow var(--dur-fast)",
            boxSizing: "border-box",
          }}
          {...rest}
        />
        {passwordToggle && (
          <button
            type="button"
            aria-label={show ? "Hide password" : "Show password"}
            onClick={() => setShow((v) => !v)}
            style={{ position: "absolute", right: 8, background: "none", border: "none", cursor: "pointer", color: "var(--ink-500)", display: "flex", padding: 6 }}
          >
            <i data-lucide={show ? "eye-off" : "eye"} style={{ width: 18, height: 18 }}></i>
          </button>
        )}
        {!passwordToggle && trailing && (
          <div style={{ position: "absolute", right: 10, display: "flex", alignItems: "center" }}>{trailing}</div>
        )}
      </div>
      {(helper || error) && (
        <span style={{ fontFamily: "var(--font-text)", fontSize: 13, color: error ? "var(--danger-500)" : "var(--text-subtle)" }}>
          {error || helper}
        </span>
      )}
    </div>
  );
}

// ---- components/forms/SegmentedControl.jsx ----
/**
 * SegmentedControl — the Student / Recruiter style toggle. Active segment
 * is a white card with a soft shadow; inactive segments are flat on a
 * surface-1 track.
 */
function SegmentedControl({ options = [], value, onChange, style = {} }) {
  return (
    <div
      role="tablist"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${options.length}, 1fr)`,
        gap: 4,
        padding: 4,
        background: "var(--surface-1)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-sm)",
        ...style,
      }}
    >
      {options.map((opt) => {
        const val = typeof opt === "string" ? opt : opt.value;
        const label = typeof opt === "string" ? opt : opt.label;
        const icon = typeof opt === "string" ? null : opt.icon;
        const active = val === value;
        return (
          <button
            key={val}
            role="tab"
            aria-selected={active}
            onClick={() => onChange && onChange(val)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontFamily: "var(--font-text)",
              fontSize: 15,
              fontWeight: 600,
              padding: "10px 12px",
              borderRadius: "var(--radius-xs)",
              border: "none",
              cursor: "pointer",
              color: active ? "var(--brand-700)" : "var(--text-muted)",
              background: active ? "var(--surface-0)" : "transparent",
              boxShadow: active ? "var(--shadow-sm)" : "none",
              transition: "background var(--dur-base) var(--ease-standard), color var(--dur-fast)",
            }}
          >
            {icon}
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ---- components/forms/Checkbox.jsx ----
/**
 * Checkbox — square 4px-radius box, slate fill when checked. Pairs with
 * inline label text (e.g. "I agree to the Terms of Service").
 */
function Checkbox({ checked = false, onChange, label, id, style = {} }) {
  const cbId = id || (typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-").slice(0, 24) : undefined);
  return (
    <label htmlFor={cbId} style={{ display: "inline-flex", alignItems: "flex-start", gap: 10, cursor: "pointer", ...style }}>
      <span
        style={{
          flexShrink: 0,
          width: 20,
          height: 20,
          marginTop: 1,
          borderRadius: "var(--radius-xs)",
          border: `1.5px solid ${checked ? "var(--brand-700)" : "var(--border-strong)"}`,
          background: checked ? "var(--brand-700)" : "var(--surface-0)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background var(--dur-fast), border-color var(--dur-fast)",
        }}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6.2L4.8 8.5L9.5 3.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <input id={cbId} type="checkbox" checked={checked} onChange={onChange} style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
      {label && (
        <span style={{ fontFamily: "var(--font-text)", fontSize: 14, lineHeight: 1.5, color: "var(--text-body)" }}>{label}</span>
      )}
    </label>
  );
}

// ---- components/feedback/Badge.jsx ----
const TONES = {
  active:    { bg: "var(--success-100)", fg: "var(--success-700-text)" },
  success:   { bg: "var(--success-100)", fg: "var(--success-700-text)" },
  submitted: { bg: "var(--info-100)",    fg: "var(--info-700-text)" },
  reviewing: { bg: "var(--info-100)",    fg: "var(--info-700-text)" },
  info:      { bg: "var(--info-100)",    fg: "var(--info-700-text)" },
  draft:     { bg: "var(--surface-2)",   fg: "var(--ink-600)" },
  neutral:   { bg: "var(--surface-2)",   fg: "var(--ink-600)" },
  danger:    { bg: "var(--danger-100)",  fg: "var(--danger-700-text)" },
  rejected:  { bg: "var(--danger-100)",  fg: "var(--danger-700-text)" },
  warning:   { bg: "var(--warning-100)", fg: "var(--warning-500)" },
  premium:   { bg: "var(--brand-700)",   fg: "#fff" },
};

/**
 * Status badge — pill, small uppercase label. Used for gig/application
 * status (Active, Submitted, Reviewing, Draft, Rejected) and PREMIUM tags.
 */
function Badge({ children, tone = "neutral", uppercase = true, style = {} }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily: "var(--font-text)",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: uppercase ? "0.04em" : 0,
        textTransform: uppercase ? "uppercase" : "none",
        padding: "4px 10px",
        borderRadius: "var(--radius-full)",
        background: t.bg,
        color: t.fg,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ---- components/feedback/Tag.jsx ----
/**
 * Tag / skill chip — square-ish, neutral or slate-tinted. Used for skills
 * (FIGMA, PYTHON, REACT) and gig meta (Remote, 2 Weeks, On-site).
 */
function Tag({ children, variant = "neutral", style = {} }) {
  const looks = {
    neutral: { bg: "var(--surface-2)", fg: "var(--ink-700)", border: "transparent" },
    outline: { bg: "transparent", fg: "var(--ink-700)", border: "var(--border-default)" },
    brand:   { bg: "var(--brand-50)", fg: "var(--brand-700)", border: "transparent" },
    onDark:  { bg: "rgba(255,255,255,0.14)", fg: "#fff", border: "transparent" },
  };
  const l = looks[variant] || looks.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily: "var(--font-text)",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.02em",
        padding: "5px 10px",
        borderRadius: "var(--radius-xs)",
        background: l.bg,
        color: l.fg,
        border: `1px solid ${l.border}`,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ---- components/feedback/ProgressBar.jsx ----
/**
 * ProgressBar — thin rounded track with a slate (or custom) fill. Used for
 * profile completion, course progress, and applicant-volume bars.
 */
function ProgressBar({ value = 0, max = 100, color = "var(--brand-700)", track = "var(--surface-2)", height = 8, onDark = false, style = {} }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      style={{
        width: "100%",
        height,
        background: onDark ? "rgba(255,255,255,0.2)" : track,
        borderRadius: "var(--radius-full)",
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: onDark ? "#fff" : color,
          borderRadius: "var(--radius-full)",
          transition: "width var(--dur-slow) var(--ease-out)",
        }}
      />
    </div>
  );
}

// ---- components/data/Card.jsx ----
/**
 * Card — the base container. White fill, 1px border, soft shadow, 12px
 * radius by default. `tone="dark"` flips to a slate feature card (white
 * text, no border). `interactive` adds a hover lift.
 */
function Card({
  children,
  tone = "default",
  radius = "md",
  padding = 24,
  interactive = false,
  style = {},
  ...rest
}) {
  const radii = { sm: "var(--radius-sm)", md: "var(--radius-md)", lg: "var(--radius-lg)", xl: "var(--radius-xl)" };
  const tones = {
    default: { background: "var(--surface-0)", border: "1px solid var(--border-default)", color: "var(--text-body)", boxShadow: "var(--shadow-sm)" },
    flat:    { background: "var(--surface-0)", border: "1px solid var(--border-default)", color: "var(--text-body)", boxShadow: "none" },
    well:    { background: "var(--surface-2)", border: "1px solid var(--border-subtle)", color: "var(--text-body)", boxShadow: "none" },
    dark:    { background: "var(--brand-700)", border: "1px solid transparent", color: "#fff", boxShadow: "var(--shadow-md)" },
    earth:   { background: "var(--accent-earth)", border: "1px solid transparent", color: "#fff", boxShadow: "var(--shadow-md)" },
  };
  const t = tones[tone] || tones.default;
  const base = {
    borderRadius: radii[radius] || radii.md,
    padding,
    boxSizing: "border-box",
    transition: "box-shadow var(--dur-base) var(--ease-standard), transform var(--dur-base) var(--ease-standard)",
    ...t,
    ...style,
  };
  return (
    <div
      style={base}
      onMouseEnter={interactive ? (e) => { e.currentTarget.style.boxShadow = "var(--shadow-lg)"; e.currentTarget.style.transform = "translateY(-2px)"; } : undefined}
      onMouseLeave={interactive ? (e) => { e.currentTarget.style.boxShadow = t.boxShadow; e.currentTarget.style.transform = "none"; } : undefined}
      {...rest}
    >
      {children}
    </div>
  );
}

// ---- components/data/StatCard.jsx ----
/**
 * StatCard — the KPI tile used across dashboards. Eyebrow label, big
 * display number, and a top-right icon (optionally in a tinted square).
 * Optional delta line (e.g. "+2 this week").
 */
function StatCard({ label, value, icon = null, iconTone = "slate", delta = null, deltaTone = "success", style = {} }) {
  const iconTones = {
    slate:   { bg: "var(--brand-700)", fg: "#fff" },
    soft:    { bg: "var(--brand-50)",  fg: "var(--brand-700)" },
    success: { bg: "var(--success-100)", fg: "var(--success-600)" },
    info:    { bg: "var(--info-100)", fg: "var(--info-600)" },
    earth:   { bg: "var(--accent-earth-100)", fg: "var(--accent-earth)" },
    none:    null,
  };
  const it = iconTones[iconTone];
  const deltaColor = deltaTone === "success" ? "var(--success-600)" : deltaTone === "danger" ? "var(--danger-500)" : "var(--text-subtle)";
  return (
    <div
      style={{
        background: "var(--surface-0)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-md)",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        boxShadow: "var(--shadow-xs)",
        boxSizing: "border-box",
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <span style={{ fontFamily: "var(--font-text)", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-subtle)" }}>
          {label}
        </span>
        {icon && (
          it
            ? <span style={{ width: 36, height: 36, borderRadius: "var(--radius-sm)", background: it.bg, color: it.fg, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</span>
            : <span style={{ color: "var(--ink-500)", display: "inline-flex", flexShrink: 0 }}>{icon}</span>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 32, lineHeight: 1.1, color: "var(--text-strong)", fontVariantNumeric: "tabular-nums" }}>
          {value}
        </span>
        {delta && (
          <span style={{ fontFamily: "var(--font-text)", fontSize: 13, fontWeight: 600, color: deltaColor, whiteSpace: "nowrap" }}>{delta}</span>
        )}
      </div>
    </div>
  );
}

// ---- components/data/Avatar.jsx ----
/**
 * Avatar — circle or squircle. Renders a photo (src) or initials on a
 * slate tint. Sizes via `size` px.
 */
function Avatar({ src = null, name = "", size = 40, shape = "circle", style = {} }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
  const radius = shape === "circle" ? "9999px" : "var(--radius-md)";
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: "var(--brand-50)",
        color: "var(--brand-700)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-text)",
        fontWeight: 600,
        fontSize: Math.round(size * 0.4),
        overflow: "hidden",
        flexShrink: 0,
        border: "1px solid var(--border-subtle)",
        ...style,
      }}
    >
      {src ? (
        <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        initials || "?"
      )}
    </span>
  );
}

window.AavasarDesignSystem_e30e7a = Object.assign(window.AavasarDesignSystem_e30e7a || {}, { Button, IconButton, Input, SegmentedControl, Checkbox, Badge, Tag, ProgressBar, Card, StatCard, Avatar });
