# Current Issues Observed in the Codebase

This document captures the main issues visible from the current implementation, based on the code paths in the repository. It does not propose fixes.

## 1. Session persistence and the "Remember me" control are not wired end to end
- What the issue is: The login screen exposes a `Remember me` checkbox, but the current auth flow does not actually use that choice to shape session lifetime or persistence. The user can see the control, but the session behavior still feels like a fresh login every time.
- Code evidence:
  - [frontend/src/pages/marketing/LoginPage.tsx](../frontend/src/pages/marketing/LoginPage.tsx) — the form collects `remember`, but the submit path never uses it.
  - [frontend/src/features/auth/application/logIn.usecase.ts](../frontend/src/features/auth/application/logIn.usecase.ts) — the login use case stores the returned session, but does not apply any special remember-me behavior.
  - [backend/src/modules/auth/auth.service.ts](../backend/src/modules/auth/auth.service.ts) — the backend login/refresh flow always issues normal session tokens and does not inspect `remember` at all.
- Why this matters: The UI promises a persistent-session option, but the real code path does not implement it.

## 2. Social login buttons are shown, but the actual OAuth experience is not wired in the UI
- What the issue is: Google and LinkedIn sign-in buttons are present in the login and sign-up pages, but they are intentionally disabled with "Coming soon" messages. The backend already registers GitHub as an OAuth provider, but the UI does not expose a GitHub button anywhere in the current login/signup experience.
- Code evidence:
  - [frontend/src/pages/marketing/LoginPage.tsx](../frontend/src/pages/marketing/LoginPage.tsx)
  - [frontend/src/pages/marketing/SignUpPage.tsx](../frontend/src/pages/marketing/SignUpPage.tsx)
  - [backend/src/modules/auth/auth.routes.ts](../backend/src/modules/auth/auth.routes.ts) — the provider list includes `google`, `linkedin`, and `github`.
- Why this matters: The authentication surface is incomplete and inconsistent between the backend and the frontend.

## 3. Many core product routes are still placeholder screens
- What the issue is: The application exposes many destination routes, but a large part of the public and dashboard experience still renders placeholder screens instead of real product pages.
- Code evidence:
  - [frontend/src/shared/config/routes.ts](../frontend/src/shared/config/routes.ts)
  - [frontend/src/app/router.tsx](../frontend/src/app/router.tsx)
- Why this matters: The navigation structure exists, but key user flows are still incomplete.

## 4. Gig detail and recruiter applicant detail flows are not implemented yet
- What the issue is: The student marketplace and recruiter pipeline both reference detail pages that are still marked as future work.
- Code evidence:
  - [frontend/src/pages/student/StudentFindWorkPage.tsx](../frontend/src/pages/student/StudentFindWorkPage.tsx)
  - [frontend/src/app/router.tsx](../frontend/src/app/router.tsx)
- Why this matters: The listing pages can surface opportunities, but the actual detail experience is missing.

## 5. Notifications are not backed by real data
- What the issue is: The notifications surface is a hard-coded placeholder view with fake rows and a no-op action.
- Code evidence:
  - [frontend/src/features/profile/components/NotificationCenter.tsx](../frontend/src/features/profile/components/NotificationCenter.tsx)
- Why this matters: The UI implies a real alert feed, but there is no actual notification data path behind it.

## 6. Password reset email delivery is still incomplete in the backend
- What the issue is: The reset-password flow creates a reset token and logs it, but the actual email dispatch is explicitly left as future work.
- Code evidence:
  - [backend/src/modules/auth/auth.service.ts](../backend/src/modules/auth/auth.service.ts)
- Why this matters: The reset flow exists in logic, but the end-user delivery mechanism is not yet implemented.

## 7. The platform currently relies on mock data in local development
- What the issue is: The frontend bootstraps mock services by default, which means the app is not yet fully exercising the real backend by default in development.
- Code evidence:
  - [frontend/src/app/main.tsx](../frontend/src/app/main.tsx)
  - [frontend/src/mocks/browser.ts](../frontend/src/mocks/browser.ts)
- Why this matters: The front-end experience is partially detached from the real live API path during development.
