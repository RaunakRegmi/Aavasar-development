# Aavasar — Onboarding UI Kit

Interactive recreation of the 4-step student onboarding wizard, composed from the design-system
primitives (`Input` with leading icons, `Button`, `Card`, `Avatar`, `Tag`) plus a local toggle
`Chip` for skill selection.

## Run
Open `index.html`. Walk the full flow with the Continue / Back buttons:

1. **Basic Information** — university, degree, graduation year (icon inputs) + info note.
2. **What are you good at?** — skill search + selectable chips grouped by category (selected =
   filled slate + check).
3. **Build Your Professional Identity** — profile-picture upload, bio textarea with character
   counter, social/portfolio links, and a featured-project empty state.
4. **You're all set!** — success screen with confetti, a live profile preview card, and the
   "Find Your First Gig" / "View Public Profile" CTAs. "Restart the tour" loops back to step 1.

The top bar shows step progress; the bar turns green on completion.

## Files
- `index.html` — mounts `<OnboardingFlow>`.
- `OnboardingFlow.jsx` — wizard shell (`TopBar`), the four step components, toggle `Chip`, and
  the confetti success state.

## Notes
- Content recreated from the source Figma onboarding frames; localized examples use Nepali
  context (e.g. Tribhuvan University).
- The `leading` icon prop on `Input` was added to the DS to match these forms.
