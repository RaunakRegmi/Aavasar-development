# Interactivity Audit — Every Button, Link & CTA

Goal: leave no dead clicks. Every interactive element is now either
(a) wired to a real route, (b) wired to a stub route with a calm
"Coming Soon" panel, or (c) routed through a toast for actions that
depend on an unbuilt backend.

Verification: `npx tsc -b` is clean, `npx vite build` succeeds, and
`grep -rn 'href="#"' src/` returns **zero** matches.

---

## 1. Routing baseline

`src/shared/config/routes.ts` now declares **45 routes** covering
marketing, auth, onboarding, student app, recruiter app, plus 21
flagged `TODO STUB` destinations that mount the reusable
`ComingSoonPage` until their real implementation ships. Two helpers
were added — `gigPath(id)` and `applicantPath(id)` — for dynamic
detail paths.

`src/app/router.tsx` mounts every declared route. The `stub()` helper
wraps `<ComingSoonPage>` with a contextual `title` + `subtitle`, so
nav never dead-ends.

---

## 2. Fixed elements — every interactive element by location

### `SiteNav.tsx` (marketing top nav, used on every public page)

| Source element | Status before | Wired to |
| --- | --- | --- |
| Logo / "Aavasar" wordmark | `<Link to={routes.home}>` | unchanged — already correct |
| Nav "Find Gigs" | linked to `routes.home` (loop) | `routes.gigs` |
| Nav "How It Works" | already linked | `routes.howItWorks` |
| Nav "About" | already linked | `routes.about` |
| Nav "Contact" | already linked | `routes.contact` |
| Button "Log In" | `navigate(routes.logIn)` | unchanged |
| Button "Sign Up" | `navigate(routes.signUp)` | unchanged |
| IconButton "Help" | **no onClick** | `navigate(routes.help)` |
| Removed stale `useState("Find Gigs")` setter | — | dropped (NavLink handles active state) |

### `SiteFooter.tsx`

All 15 footer links were `href="#"`. Rewritten to use `<Link to={...}>`
and pull from a typed `RoutePath` table:

| Column | Item | Wired to |
| --- | --- | --- |
| Platform | Find Gigs | `routes.gigs` |
| Platform | Post a Job | `routes.recruiterPostGig` |
| Platform | How We Work | `routes.howItWorks` |
| Platform | Success Stories | `routes.successStories` |
| Platform | Pricing | `routes.pricing` |
| Company | About Us | `routes.about` |
| Company | Our Mission | `routes.about` |
| Company | Careers | `routes.careers` |
| Company | Press & Media | `routes.press` |
| Company | Contact Us | `routes.contact` |
| Support | Help Center | `routes.help` |
| Support | Safety Center | `routes.safety` |
| Support | Terms of Service | `routes.terms` |
| Support | Privacy Policy | `routes.privacy` |
| Support | Cookie Settings | `routes.cookies` |
| Social — Twitter | now `href="https://twitter.com/aavasar"` + `target="_blank" rel="noopener noreferrer"` |
| Social — Email | now `href="mailto:hello@aavasar.np"` |
| Social — Website | now `href="https://aavasar.np"` (external) |

### `LandingPage.tsx` + sections

| Source | Before | After |
| --- | --- | --- |
| Hero "Explore All Gigs" | navigated to `/sign-up` | `routes.gigs` |
| Hero "How It Works" | navigated to `/sign-up` | `routes.howItWorks` |
| `<FeaturedGigs>` "View all →" | `href="#"` + onCta | `<button onClick={onViewAll}>` → `routes.gigs` |
| `<FeaturedGigs>` premium card | non-clickable | whole card now `onClick={() => navigate(gigPath(id))}` |
| `<FeaturedGigs>` "Log in to Apply" | onCta | `onApplyUnauth()` → `routes.signUp` (stopPropagation so it doesn't double-navigate to detail) |
| `<FeaturedGigs>` dark card | non-clickable | clickable → `gigPath(calm.id)` |
| `<FeaturedGigs>` "Sign Up to Apply" | onCta | `onApplyUnauth()` |
| `<RecentGigs>` card row | non-clickable | clickable → `gigPath(g.id)` |
| `<RecentGigs>` "Apply →" link | `href="#"` | `<button onClick={onApplyUnauth}>` |
| `<RecentGigs>` "See 50+ More Opportunities" | onCta → `/sign-up` | `routes.gigs` |
| `<CtaBand>` "Sign Up Now" | onSignUp | `routes.signUp` |
| `<CtaBand>` "Hire Talent" | onSignUp (wrong audience) | `routes.recruiterPostGig` |

### `SignUpPage.tsx`

| Element | Before | After |
| --- | --- | --- |
| Close X (top right) | already navigated | unchanged |
| SegmentedControl Student/Recruiter | already toggled | unchanged |
| All form inputs | RHF inline rules | now Zod-resolved (prior pass) |
| "Already have an account? Log in" | already linked | unchanged |
| **"Google" button** | **no onClick** | `toast.info("Coming soon")` + `TODO[oauth]:` marker |
| **"LinkedIn" button** | **no onClick** | `toast.info("Coming soon")` + `TODO[oauth]:` marker |

### `LoginPage.tsx`

| Element | Before | After |
| --- | --- | --- |
| All form fields + submit | Zod-resolved | unchanged |
| "Forgot password?" `<Link>` | already linked | unchanged |
| "Remember me" Checkbox | now via `<Controller>` | unchanged |
| "Create an account" `<Link>` | already linked | unchanged |
| **"Google" button** | **no onClick** | `toast.info("Coming soon")` |
| **"LinkedIn" button** | **no onClick** | `toast.info("Coming soon")` |

### `ForgotPasswordPage.tsx` + `ResetPasswordPage.tsx`

Both pages were already fully wired (RHF + Zod + use case + toast).
"Back to sign in" links go to `routes.logIn`. No changes.

### `OnboardingPage.tsx` & step components

| Element | Before | After |
| --- | --- | --- |
| `StepBasic` Continue button | wired (submits + onNext) | unchanged |
| `StepSkills` Back / Continue | wired | unchanged |
| **`StepPortfolio` Profile-photo placeholder** | **decorative div** | clickable button — opens hidden `<input type="file" accept="image/*">`. Validates size/type and surfaces toast feedback. Marked `TODO[portfolio-upload]:` for the eventual `/onboarding/avatar` endpoint. |
| **`StepPortfolio` "Upload Photo" button** | **no onClick** | triggers same file input |
| **`StepPortfolio` "Add Project" button** | **no onClick** | `toast.info("Project picker coming soon")` + TODO marker |
| `StepPortfolio` Back / Finish Profile | wired | unchanged |
| **`StepComplete` "View Public Profile"** | **no onClick** | `navigate(routes.studentProfile)` |
| `StepComplete` "Find Your First Gig" | already navigated | unchanged |
| **`StepComplete` "Restart the tour" link** | `<a href="#">` with preventDefault | refactored to `<button>` with `onRestart` |

### `StudentDashboardPage.tsx`

| Element | Before | After |
| --- | --- | --- |
| **"Edit Profile" header button** | no onClick | `navigate(routes.studentProfileEdit)` |
| **"View All" link (Active Gigs)** | `href="#"` + preventDefault | `<button>` → `routes.studentMyGigs` |
| **Active gig cards** | non-clickable | `onClick={() => navigate(gigPath(g.id))}` |
| **Recommended dark card** | non-clickable | clickable → `routes.studentFindWork` |
| **Recommended "Apply Now"** | no onClick | `routes.studentFindWork` (stopPropagation) |
| **"Python Scripting" card** | non-clickable | clickable → `routes.studentFindWork` |
| **"Market Research" card** | non-clickable | clickable → `routes.studentFindWork` |
| **"Resume Course" button** | no onClick | `navigate(routes.studentLearning)` |
| **"Join the Peer Network" panel** | decorative `<div>` | `<button>` → `routes.studentPeerNetwork` (preserves visuals, adds semantics + cursor) |

### `RecruiterDashboardPage.tsx`

| Element | Before | After |
| --- | --- | --- |
| **"View All →" link (Active Gigs)** | `href="#"` + preventDefault | `<button>` → `routes.recruiterMyGigs` |
| **Pipeline `<tr>` rows** | non-clickable | each row `onClick={() => navigate(gigPath(g.id))}` |
| **Top applicant card** | non-clickable | clickable → `applicantPath(top.id)` |
| **"View Profile" button** | no onClick | `applicantPath(top.id)` (stopPropagation) |
| **Sub-applicant rows** | non-clickable | each row → `applicantPath(a.id)` |
| **"View 18 more applicants" link** | `href="#"` + preventDefault | `<button>` → `routes.recruiterApplicants` |
| **"Explore Reports" button** | no onClick | `routes.recruiterReports` |

### `StudentLayout.tsx` (sidebar)

| Element | Before | After |
| --- | --- | --- |
| Logo block | non-interactive (cosmetic) | unchanged |
| Dashboard NavLink | wired | unchanged |
| Find Work / My Gigs / Messages / Learning | already pointed at routes (now mounted to stub) | unchanged |
| **"Post Profile" button** | no onClick | `navigate(routes.studentProfileEdit)` |
| **"Support" button** | no onClick | `navigate(routes.studentSupport)` |
| Sign Out | `onSettled` cleanup + navigate | unchanged |
| Removed dead `useState`/`setOpen` placeholder | — | dropped |

### `RecruiterLayout.tsx` (top nav + sidebar)

| Element | Before | After |
| --- | --- | --- |
| Logo lockup | non-interactive | unchanged |
| TopNav "Dashboard" / "Browse Talent" | wired | unchanged |
| **TopNav "Resources"** | pointed at `routes.recruiterDashboard` (wrong) | `routes.recruiterResources` |
| **IconButton "Notifications"** | no onClick | `navigate(routes.recruiterNotifications)` |
| **IconButton "Help"** | no onClick | `navigate(routes.help)` |
| "Post a Gig" button | wired | unchanged |
| **Avatar in topnav** | non-interactive | wrapped in `<button>` → `routes.recruiterSettings` |
| Sidebar Overview / Applicants / Messages / Settings | wired | unchanged |
| **Sidebar "My Gigs"** | pointed at `routes.recruiterDashboard` (wrong) | `routes.recruiterMyGigs` |
| **"Upgrade Plan" button** | no onClick | `navigate(routes.recruiterUpgrade)` |
| "Logout" | `onSettled` cleanup + navigate | unchanged |

---

## 3. New routes added

All declared in `src/shared/config/routes.ts` and mounted to
`<ComingSoonPage>` in `router.tsx`. They are **live, navigable routes**
— not dead links.

**Marketing / public stubs**
`/gigs`, `/gigs/:id`, `/pricing`, `/for-businesses`, `/for-students`,
`/success-stories`, `/help`, `/safety`, `/terms`, `/privacy`,
`/cookies`, `/careers`, `/press`

**Student app stubs**
`/student/profile`, `/student/profile/edit`,
`/student/notifications`, `/student/peer-network`,
`/student/support`

**Recruiter app stubs**
`/recruiter/my-gigs`, `/recruiter/resources`,
`/recruiter/notifications`, `/recruiter/reports`,
`/recruiter/upgrade`, `/recruiter/applicants/:id`

The existing student/recruiter feature routes (`find-work`,
`my-gigs`, `messages`, `learning`, `browse-talent`, `applicants`,
`post-gig`, `messages`, `settings`) were already declared — they
now mount `<ComingSoonPage>` instead of 404-ing.

---

## 4. Actions that could not be wired

These are intentionally surfaced as toast notifications (not silent
no-ops) and tagged in code with `TODO[<area>]:` comments so they
show up in a grep:

| Element | Reason | TODO marker |
| --- | --- | --- |
| Google sign-in button (SignUp + Login) | OAuth backend not built | `TODO[oauth]:` |
| LinkedIn sign-in button (SignUp + Login) | OAuth backend not built | `TODO[oauth]:` |
| Onboarding profile-photo upload | `/onboarding/avatar` endpoint not built (local file pick works + validates; only the upload network call is stubbed) | `TODO[portfolio-upload]:` |
| Onboarding "Add Project" button | Featured-project picker UX not designed yet | (toast only) |

These are the **only** elements that produce a "Coming soon" toast.
Every other interactive element navigates to a real or stubbed route.

---

## 5. Pages that don't yet exist (mounted as stubs)

Each of these is intentionally mounted at `<ComingSoonPage>` with a
contextual `title` + `subtitle`. The Back button uses
`navigate(-1)` so users never get stuck. The actual page
implementations are future work:

- Marketing: gigs listing, gig detail, pricing, for-businesses, for-students, success stories, help, safety, terms, privacy, cookies, careers, press
- Student app: profile, profile edit, notifications, peer network, support
- Recruiter app: my-gigs, resources, notifications, reports, upgrade, applicant detail

---

## 6. Verification commands

```bash
# Zero dead-link patterns remaining in src/
grep -rn 'href="#"' src/                # → no matches
grep -rn 'javascript:void' src/         # → no matches
grep -rn 'e\.preventDefault' src/       # → no matches

# Build is clean
npx tsc -b                              # → no errors
npx vite build                          # → ✓ built in ~1.5s

# All TODOs are intentional and labeled
grep -rn 'TODO\[' src/                  # → 3 categories, all explained above
```

---

## 7. Decisions worth noting

- **`<a href="#" + preventDefault>` was replaced with `<button>`,** not
  with `<Link to>`. The original elements were intended as in-place
  triggers, not navigation. `<button>` is the correct semantic and
  carries no implicit `:visited` style or middle-click navigation
  surprises.
- **`<Card interactive onClick>` for whole-card clicks** is preferred
  over wrapping the card in an `<a>`, because the card already
  contains nested interactive elements (buttons, badges, tags). The
  `stopPropagation` on inner buttons prevents a click on "Apply"
  from also navigating to the card's detail page.
- **Avatar in the recruiter top nav** was upgraded from a decorative
  `<Avatar>` to a `<button>` wrapper so the keyboard and screen-reader
  users can reach the settings page from the visible affordance.
- **Social icons in the footer** are real outbound links (Twitter,
  mailto, website) — but use `target="_blank" rel="noopener noreferrer"`
  for outbound URLs. The brand brief explicitly bans emoji so we
  carry tone via Lucide glyphs.
