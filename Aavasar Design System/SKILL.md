---
name: aavasar-design
description: Use this skill to generate well-branded interfaces and assets for Aavasar, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick orientation for Aavasar
- **What it is:** a student-talent marketplace localized for Nepal (currency NPR / रु). Two products share one brand: a marketing website and an authenticated web app (Student Hub + Recruiter Admin, plus onboarding/verification/subscription/auth).
- **Brand color:** one slate-blue (`#304554`) does most of the work; warm-gray neutrals on a warm off-white page (`#FBF9FA`); functional green/blue/red/earth used sparingly.
- **Type:** Plus Jakarta Sans (display/headings/logo/numbers) + Inter (body/UI).
- **Feel:** clean, trustworthy, editorial-corporate — 1px hairline borders, soft low-contrast shadows, snappy 4px controls, rounder containers, no gradients on light surfaces, no emoji.
- **Tagline:** जता सीप, त्यता अवसर — "Where there's skill, there's opportunity."

## Files
- `readme.md` — full design guide: product context, CONTENT FUNDAMENTALS, VISUAL FOUNDATIONS, ICONOGRAPHY, and a repository index.
- `styles.css` + `tokens/` — link `styles.css` to get all CSS custom properties and fonts.
- `guidelines/` — foundation specimen cards (color, type, spacing, brand).
- `components/` — reusable React primitives. In the Design System tab / consuming projects, load `_ds_bundle.js` and read from `window.AavasarDesignSystem_*`. For standalone HTML preview in this project, load the auto-derived `ds-runtime.js` shim instead (same namespace).
- `ui_kits/website` + `ui_kits/app` — full interactive screen recreations to copy patterns from.
- `assets/` — logo, mark, photography. Icons via Lucide CDN.

For visual artifacts: link `styles.css`, copy needed assets out of `assets/`, use Lucide for icons, and follow the foundations above. Prefer composing the existing components and UI-kit patterns over inventing new ones.
