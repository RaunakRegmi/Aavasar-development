# Aavasar — Design System

> **जता सीप, त्यता अवसर** — *"Where there's skill, there's opportunity."*

Aavasar (अवसर, "opportunity") is a **student-talent marketplace localized for Nepal**. It
connects students and early-career freelancers with paid gigs, projects and internships, and
gives businesses a verified pipeline of student talent to hire from. All money is shown in
**Nepali Rupees (NPR / रु)**.

This repository is the design system that powers every Aavasar surface: brand foundations
(color, type, spacing), reusable React UI primitives, and high-fidelity UI-kit recreations of
the real product screens.

---

## Products represented

Aavasar is **two products sharing one brand**:

1. **Marketing website** — public-facing acquisition site.
   Landing page, How It Works, About / Our Mission, Contact, pricing, expanded footer.
   Goal: convert students ("Find your next gig") and businesses ("Hire talent").

2. **Web app** — the authenticated product, split by audience:
   - **Student Hub** — dashboard (earnings, active gigs, recommended gigs, learning/courses),
     My Gigs, Messages, applications, profile, onboarding (Basic Info → Skills → Portfolio →
     Complete), subscription dashboard.
   - **Recruiter Admin** — dashboard (active gigs table, applicant pipeline, talent pulse),
     Browse Talent, Applicants, Post a Gig (Basic → Timing/Budget → Review/Publish),
     subscription / checkout.
   - **Trust & Verification** — identity verification (individual + business), admin review
     dashboard, rejection guidance, audit log, "Welcome to Premium" success states.
   - **Auth** — Sign Up (Student / Recruiter role toggle), Role Selection, social login.

> **Note on naming:** an early draft of the Sign-Up screen still carries the placeholder
> wordmark "GigFlow". The shipping brand is **Aavasar** everywhere — treat any "GigFlow"
> reference as stale and use Aavasar.

---

## Sources

- **Figma:** "Aavsar Web UI1.fig" — page `Final` (43 frames). Covers the full marketing site,
  student & recruiter apps, onboarding, verification, subscription and auth flows. Fonts in
  use: Inter, Plus Jakarta Sans. Mounted read-only for this build.
- **Logo:** `uploads/Aavasar Logo.png` → copied to `assets/aavasar-logo.png`.

If you have access to the Figma file, it is the source of truth; this system is a faithful,
token-driven recreation of it.

---

## CONTENT FUNDAMENTALS

How Aavasar writes.

**Voice — warm, encouraging, professional.** The product talks to ambitious students like a
supportive mentor, and to businesses like a capable partner. It is optimistic about careers
without being hype-y.

**Person.** Marketing addresses the reader directly as **"you"** ("Find your next gig and earn
on your schedule", "Your Next Opportunity Starts Here"). The app greets users by **first name**
in display type ("Welcome back, Pratikshya!", "Welcome back, Sushma!"). Internal/microcopy is
plain and instructional ("Add your latest project to stand out.").

**Casing.** **Title Case** for buttons, nav, card titles and section headers
("Find Gigs", "Post a Gig", "Active Gigs", "Recommended for You"). **Sentence case** for
descriptions and helper text ("Must be at least 8 characters", "No long-term commitments,
just great opportunities."). **ALL-CAPS** (small, letter-spaced) reserved for eyebrows, table
column headers and status badges ("EMPOWERING STUDENT CAREERS", "GIG TITLE", "IN PROGRESS").

**Tone by surface.**
- *Marketing:* aspirational headlines + a concrete proof point. "Join a community of 10,000+
  students…", "Your Next Opportunity Starts Here."
- *App:* outcome-focused and reassuring. Emphasizes earnings, progress, and momentum
  ("Total Earnings", "Your profile is 85% complete", "Get Paid Securely").
- *Trust:* clear, calm, non-punitive even in failure ("Verification Status — Rejection
  Guidance" frames rejection as next steps, not blame).

**Copy patterns.**
- **Numbers as proof:** "10,000+ Enrolled Students · 500+ Verified Businesses · 4.9/5 Average
  Rating." Stats are big, paired with a short label below.
- **Money is always NPR:** "NPR 1,24,000", "रु45/hr", "NPR 20,000 Fixed". Use the South-Asian
  digit grouping (1,24,000 — lakh grouping) for large totals.
- **Action verbs on CTAs:** "Sign Up to Apply", "Explore All Gigs", "Apply Now", "Hire Talent",
  "Resume Course", "View Profile".
- **Two-audience framing** is everywhere: "For Students" vs "For Businesses", Student vs
  Recruiter toggle, "Earn" vs "Hire".

**Emoji:** none. The brand never uses emoji. Status and meaning are carried by color, icons and
badges, not by emoji or decorative unicode.

**Bilingual touches.** The wordmark pairs a Devanagari **अ** with the Latin "VASAR"; the tagline
is in Nepali. Body UI is in English (US) by default with an **English (US) · NPR (रु)** locale
switch in the footer. Keep Devanagari for brand/tagline moments, English for product UI.

---

## VISUAL FOUNDATIONS

**Overall feel.** Clean, trustworthy, editorial-corporate. Lots of breathing room, crisp 1px
borders, soft shadows, restrained color. It reads like a serious careers platform — closer to
LinkedIn/Stripe calm than to playful consumer apps.

**Color.** A single **slate-blue** brand color (`#304554`) does almost all the work — logo,
primary buttons, headings, dark feature panels. A lighter slate (`#475C6C`) and a pale blue
tint (`#BED4E7`, used as text on dark slate) extend it. Neutrals are **warm grays** on a warm
off-white page (`#FBF9FA`), not pure white/cool gray. Functional color is used sparingly and
semantically: **green** (`#10B981`) for earnings & "active", **blue** (`#3B82F6`) for
"reviewing/submitted", **red** (`#BA1A1A`) for errors/rejection, and a one-off **earth brown**
(`#553E23`) for the Learning/course card. Ratings use a gold star (`#F5B400`).

**Type.** Two families. **Plus Jakarta Sans** (bold) for display, headings, the logo and big
numbers — friendly-geometric, gives the brand its character. **Inter** for all body, labels and
UI. Headings are tight-tracked and bold; body is regular at 16/24. Big welcome headers run
~40–56px in Plus Jakarta Bold.

**Spacing & layout.** 4px base, 8px rhythm; generous 48–64px gaps between marketing sections.
Marketing content is capped at **1280px** centered with 24px gutters. The app uses a fixed
left **sidebar (~264px)** + sticky top nav (~72px) with a scrolling content column and a right
rail for secondary cards (Upcoming, course progress).

**Backgrounds.** Mostly flat — warm off-white (`#FBF9FA`) pages, white cards, a light-gray
footer (`#E3E2E3`). **No gradients on light surfaces.** Dark slate panels (hero image overlay,
"Your Next Opportunity Starts Here" CTA band, Talent Pulse) may use a *subtle* dark
slate→darker gradient for depth. Photography (people studying/working, warm natural light) is
used full-bleed inside rounded hero cards and the peer-network card, always with rounded corners.

**Cards.** White fill, **1px `#E5E7EB` border**, soft shadow (`shadow-sm`/`shadow-md`), radius
**12px** (data cards) to **24px** (feature/hero cards). Dark feature cards drop the border and
invert text to white / pale-blue. Stat cards are simple bordered rectangles with an eyebrow
label, a big number, and a small icon top-right.

**Corner radii.** Snappy on controls (**4px** buttons & inputs), rounder on containers (8 → 12
→ 16 → 24). Avatars and icon-buttons ~12px (squircle) or full-round for people.

**Borders.** The 1px hairline (`#E5E7EB`) is a signature — it separates nav, footer, table rows,
cards and dividers. Vertical dividers (`#C3C7CC`) separate nav action groups.

**Shadows.** Soft and low-contrast only: `0 1px 2px rgba(0,0,0,0.05)` on buttons,
`0 1px 3px rgba(0,0,0,0.1)` on cards. Never heavy/dramatic. Elevation comes from border + faint
shadow, not big blurs.

**Buttons.** Primary = solid slate `#304554`, white text, 4px radius, tiny shadow. Secondary =
ghost/transparent with slate text. On dark panels, the primary inverts to a **white button with
dark text**. Outline/secondary buttons on dark use a translucent fill.

**States.**
- *Hover:* darken solid fills one step (`#304554` → `#263948`); on ghost/links, slate text +
  faint slate-tint background.
- *Press:* darken another step (`#1F2E3A`) and/or a 1–2px settle; no large scale.
- *Focus:* 3px slate focus ring (`rgba(48,69,84,0.18)`).
- *Disabled:* `#C3C7CC` fill / muted text, no shadow.

**Transparency & blur.** Light overlay tints on dark cards (`rgba(255,255,255,0.2)` chip behind
an icon). Image hero text sits on a dark slate overlay over the photo. Blur is minimal — not a
glassmorphism brand.

**Motion.** Subtle and quick. Fades and short slides (`120–280ms`) on the standard ease
(`cubic-bezier(.2,0,0,1)`). Hover/press are near-instant color transitions. No bounces, no
infinite decorative loops. Progress bars animate width.

**Imagery vibe.** Warm, natural-light photography of students and young professionals
collaborating — libraries, offices, laptops. Diverse, candid, optimistic. Always cropped into
rounded containers; never square-cornered full-bleed.

---

## ICONOGRAPHY

Aavasar uses **clean line icons** at a consistent ~1.75–2px stroke, single-color (inherits text
color), no fills. In the source file these are Material-Symbols / Lucide-style outline glyphs
(briefcase, message square, graduation cap, rocket, calendar, file, check-circle, bell, gear,
share, at-sign, globe, location pin, mail). Stat cards pair one such icon (top-right, in brand
slate or a tinted square) with a number.

**This system ships icons via [Lucide](https://lucide.dev) (CDN).** Lucide's outline set is the
closest faithful match to the source's stroke weight and rounded-join style. Load it from CDN
and color via `currentColor`:

```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
<i data-lucide="briefcase"></i>   <!-- then lucide.createIcons() -->
```

> **Substitution flag:** the original file's exact glyphs were not exported as a font/sprite, so
> Lucide is used as the documented stand-in. If you have Aavasar's real icon assets, drop them in
> `assets/icons/` and update components to reference them.

Common glyph → meaning map: `briefcase` = gigs/work · `message-square` = messages ·
`graduation-cap` = learning/student · `rocket` = active gigs · `calendar` = upcoming/interviews ·
`file-text` = applications · `check-circle` = verified/hired · `star` = rating · `bell` =
notifications · `settings` = settings · `map-pin` = location · `mail` = email · `globe` /
`at-sign` / `share-2` = social.

**Emoji / unicode icons:** never. Meaning is carried by Lucide glyphs + color + badges only.
The one currency glyph **रु** (Devanagari) is typeset as text, not an icon.

---

---

## Repository index

**Global entry**
- `styles.css` — the single file consumers link. `@import`s everything below.

**Tokens** (`tokens/`)
- `fonts.css` — Inter + Plus Jakarta Sans (Google Fonts).
- `colors.css` — brand slate scale, warm-gray neutrals, surfaces, functional/semantic aliases.
- `typography.css` — font families, weights, type scale, reusable `.t-*` classes.
- `spacing.css` — spacing, radius, shadow, layout, motion tokens.

**Foundations** (`guidelines/`) — Design System tab specimen cards
- Colors: `color-brand`, `color-neutrals`, `color-surfaces`, `color-functional`
- Type: `type-display`, `type-body`, `type-scale`
- Spacing: `spacing-scale`, `radius`, `shadow`
- Brand: `brand-logo`

**Components** (`components/`) — reusable React primitives (namespace `AavasarDesignSystem_*`)
- `buttons/` — `Button`, `IconButton`
- `forms/` — `Input`, `SegmentedControl`, `Checkbox`
- `feedback/` — `Badge`, `Tag`, `ProgressBar`
- `data/` — `Card`, `StatCard`, `Avatar`

Each component directory has `<Name>.jsx` + `<Name>.d.ts` + a `*.card.html` thumbnail, and the
buttons group carries a `<Name>.prompt.md` usage note.

**UI kits** (`ui_kits/`)
- `website/` — interactive marketing landing page + Sign-Up flow (`index.html`).
- `app/` — interactive Student Hub + Recruiter Admin dashboards, switchable (`index.html`).
- `onboarding/` — interactive 4-step student onboarding wizard (`index.html`).

**Assets** (`assets/`)
- `aavasar-logo.png` (full lockup), `aavasar-mark.png` (circular mark).
- `photos/` — `hero-a.png`, `hero-b.png`, `peer-network.jpg` (from the source file).
- Icons: [Lucide](https://lucide.dev) via CDN (documented substitution — see ICONOGRAPHY).

**Other**
- `SKILL.md` — makes this system usable as a downloadable Agent Skill.

### Using a component (in a `@dsCard` HTML or any consumer page)
```html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
<script type="text/babel">
  const { Button, Card, StatCard, Badge } = window.AavasarDesignSystem_e30e7a;
  /* …render… */
</script>
```

> **Preview shim — `ds-runtime.js`.** The compiled `_ds_bundle.js` is a virtual artifact
> served by the Design System tab / consuming projects, but **not** on the plain serve/preview
> route. So the cards and UI kits in THIS project load `ds-runtime.js` instead — a real,
> served file auto-derived from `components/**/*.jsx` that exposes the same
> `window.AavasarDesignSystem_e30e7a` namespace (load it via
> `<script type="text/babel" src="…/ds-runtime.js">`). Regenerate it after editing any
> component. In a true consuming project, use `_ds_bundle.js` as shown above.


