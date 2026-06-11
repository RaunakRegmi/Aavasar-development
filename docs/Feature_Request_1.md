# Major Feature Requests Observed in the Current Codebase

This document lists the major feature areas implied by the current product structure and code paths. It is a documentation summary only, not a solution list.

## 1. Full public marketplace and marketing experience
- What this feature request represents: The app already has route definitions for public destinations such as pricing, how-it-works, success stories, help, and safety, but the pages are still placeholder surfaces.
- Code evidence:
  - [frontend/src/shared/config/routes.ts](../frontend/src/shared/config/routes.ts)
  - [frontend/src/app/router.tsx](../frontend/src/app/router.tsx)

## 2. Social authentication (Google, LinkedIn, GitHub)
- What this feature request represents: The backend already contains OAuth routes and provider support, and the frontend exposes social sign-in buttons, which indicates the product expects full third-party sign-in support.
- Code evidence:
  - [backend/src/modules/auth/auth.routes.ts](../backend/src/modules/auth/auth.routes.ts)
  - [frontend/src/pages/marketing/LoginPage.tsx](../frontend/src/pages/marketing/LoginPage.tsx)
  - [frontend/src/pages/marketing/SignUpPage.tsx](../frontend/src/pages/marketing/SignUpPage.tsx)

## 3. Full gig detail and application workflow
- What this feature request represents: The student marketplace currently lists gigs, but the detail and apply journey is still described as future work in the code comments.
- Code evidence:
  - [frontend/src/pages/student/StudentFindWorkPage.tsx](../frontend/src/pages/student/StudentFindWorkPage.tsx)
  - [frontend/src/app/router.tsx](../frontend/src/app/router.tsx)

## 4. Recruiter operations: post gigs, applicant tracking, and talent discovery
- What this feature request represents: The recruiter area already has route placeholders for posting gigs, applicant views, browsing talent, reports, and upgrade flows.
- Code evidence:
  - [frontend/src/app/router.tsx](../frontend/src/app/router.tsx)
  - [frontend/src/shared/config/routes.ts](../frontend/src/shared/config/routes.ts)

## 5. Real notifications and messaging surfaces
- What this feature request represents: The profile area currently includes a notifications panel that is intentionally mocked, which points to an expected future messaging and alerts experience.
- Code evidence:
  - [frontend/src/features/profile/components/NotificationCenter.tsx](../frontend/src/features/profile/components/NotificationCenter.tsx)
  - [frontend/src/app/router.tsx](../frontend/src/app/router.tsx)

## 6. Production-ready account recovery and session handling
- What this feature request represents: The auth system already supports password reset and OAuth sessions, but the user-facing delivery path for reset emails is still unfinished.
- Code evidence:
  - [backend/src/modules/auth/auth.service.ts](../backend/src/modules/auth/auth.service.ts)
  - [backend/src/modules/auth/auth.routes.ts](../backend/src/modules/auth/auth.routes.ts)
