# Aavasar — Marketing Website UI Kit

High-fidelity recreation of the public Aavasar marketing site, composed from the design-system
primitives (`Button`, `Card`, `Badge`, `Tag`, `Avatar`, `Input`, `SegmentedControl`, `Checkbox`).

## Run
Open `index.html`. It loads the DS components (via `../../ds-runtime.js`, the preview shim) plus the section
files below, and renders an interactive page. Any CTA ("Sign Up", "Log In", "Apply",
"Explore All Gigs") opens the **Sign-Up split screen**; close it to return.

## Files
- `index.html` — app shell + Sign-Up modal state.
- `SiteNav.jsx` — sticky top navigation (`<SiteNav>`).
- `LandingMain.jsx` — all landing sections (`<LandingMain>`): Hero, StatsStrip, HowItWorks,
  FeaturedGigs, SuccessStories, RecentGigs, CtaBand.
- `SiteFooter.jsx` — expanded 4-column footer (`<SiteFooter>`).
- `SignUpScreen.jsx` — Student/Recruiter Sign-Up split screen (`<SignUpScreen>`).

## Notes
- Content (gig titles, rates in NPR, testimonials) is recreated from the source Figma frames.
- Photography uses `assets/photos/hero-a.png` / `hero-b.png` from the source file.
- Coverage over completeness: the kit demonstrates the core section vocabulary, not every
  marketing variant in the file.
