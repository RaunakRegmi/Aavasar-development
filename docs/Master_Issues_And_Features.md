# Master Issues and Feature Requests

This document provides a consolidated overview of current issues and major feature requests derived from the existing documentation in the `docs/` folder. It is intended for tracking purposes and does not propose solutions.

---

## Issues

### 1. Session persistence and "Remember me" control not wired
- **Description:** The login screen has a "Remember me" checkbox, but the authentication flow does not use this choice for session lifetime or persistence.
- **Relevant Code:**
    - `frontend/src/pages/marketing/LoginPage.tsx` (Form collection)
    - `frontend/src/features/auth/application/logIn.usecase.ts` (Use case handling)
    - `backend/src/modules/auth/auth.service.ts` (Backend token issuance)

### 2. Social login buttons incomplete/disabled
- **Description:** Social login buttons (Google/LinkedIn) are visible but disabled. GitHub is supported in the backend but has no button in the frontend.
- **Relevant Code:**
    - `frontend/src/pages/marketing/LoginPage.tsx`
    - `frontend/src/pages/marketing/SignUpPage.tsx`
    - `backend/src/modules/auth/auth.routes.ts` (OAuth provider list)

### 3. Core product routes are placeholders
- **Description:** Many navigation routes point to placeholder screens rather than fully implemented product pages.
- **Relevant Code:**
    - `frontend/src/shared/config/routes.ts`
    - `frontend/src/app/router.tsx`

### 4. Gig detail and recruiter applicant detail flows missing
- **Description:** Detail pages for gigs and recruiter applicants are currently marked as future work.
- **Relevant Code:**
    - `frontend/src/pages/student/StudentFindWorkPage.tsx`
    - `frontend/src/app/router.tsx`

### 5. Notifications not backed by real data
- **Description:** The notifications surface is a hard-coded placeholder.
- **Relevant Code:**
    - `frontend/src/features/profile/components/NotificationCenter.tsx`

### 6. Password reset email delivery incomplete
- **Description:** Password reset tokens are generated, but email dispatch is not implemented.
- **Relevant Code:**
    - `backend/src/modules/auth/auth.service.ts`

### 7. Reliance on mock data in development
- **Description:** The frontend uses mock services by default, detaching the frontend from the live API during local development.
- **Relevant Code:**
    - `frontend/src/app/main.tsx`
    - `frontend/src/mocks/browser.ts`

---

## Major Feature Requests

### 1. Full public marketplace and marketing experience
- **Description:** Implementation of public pages (pricing, help, etc.) currently represented as placeholders.
- **Relevant Code:**
    - `frontend/src/shared/config/routes.ts`
    - `frontend/src/app/router.tsx`

### 2. Social authentication (Google, LinkedIn, GitHub)
- **Description:** Enabling third-party sign-in support across the authentication flows.
- **Relevant Code:**
    - `backend/src/modules/auth/auth.routes.ts`
    - `frontend/src/pages/marketing/LoginPage.tsx`
    - `frontend/src/pages/marketing/SignUpPage.tsx`

### 3. Full gig detail and application workflow
- **Description:** Implementing the full experience for viewing gig details and the application process.
- **Relevant Code:**
    - `frontend/src/pages/student/StudentFindWorkPage.tsx`
    - `frontend/src/app/router.tsx`

### 4. Recruiter operations (post gigs, applicant tracking, talent discovery)
- **Description:** Completing the recruiter dashboard features for gig management and talent acquisition.
- **Relevant Code:**
    - `frontend/src/app/router.tsx`
    - `frontend/src/shared/config/routes.ts`

### 5. Real notifications and messaging surfaces
- **Description:** Replacing the mocked notification panel with a live feed/alert system.
- **Relevant Code:**
    - `frontend/src/features/profile/components/NotificationCenter.tsx`
    - `frontend/src/app/router.tsx`

### 6. Production-ready account recovery and session handling
- **Description:** Implementing the end-to-end email delivery mechanism for password recovery.
- **Relevant Code:**
    - `backend/src/modules/auth/auth.service.ts`
    - `backend/src/modules/auth/auth.routes.ts`
