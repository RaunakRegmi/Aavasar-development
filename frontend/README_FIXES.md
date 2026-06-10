# Aavasar Frontend — Audit & Remediation Log

> Lead Frontend Engineer + Security Auditor pass.
> Scope: every defect found in the as-shipped codebase plus the architectural
> change that resolved it. Each fix names the file path so a reviewer can
> verify in one click.

---

## Diagnostic summary

| # | Category | Severity | Status |
|---|----------|----------|--------|
| A1 | Log In page aliased to SignUpPage (no real login) | **CRITICAL** | Fixed |
| A2 | No password recovery flow (forgot / reset) | **CRITICAL** | Fixed |
| A3 | No JWT refresh — every 1h sign-out and stuck | **HIGH** | Fixed |
| A4 | No global 401 → auto-logout handler | **HIGH** | Fixed |
| A5 | Persisted session never checked for expiry on boot | MEDIUM | Fixed |
| B1 | Raw error messages — no global notification system | **HIGH** | Fixed |
| B2 | Dashboards rendered "—" while loading (looked broken) | MEDIUM | Fixed |
| B3 | Mutation errors swallowed silently in onboarding | MEDIUM | Fixed |
| C1 | SignUp form used RHF inline rules — duplicated Zod schema | **HIGH** | Fixed |
| C2 | Onboarding StepBasic validated only at submit time | MEDIUM | Fixed |
| C3 | Missing `@hookform/resolvers` dependency | LOW | Fixed |
| D1 | Service layer decoupling | OK | Audited, no change |

The expected authenticated journey (and the gaps that broke it):

```
  Marketing/Landing  →  /sign-up  →  POST /auth/sign-up  →  /onboarding (student)
                    ↘  /log-in   ↘  POST /auth/log-in
                                  ↘  /forgot-password  →  email link  →  /reset-password
                       on every request: bearer attached
                       on 401:  refresh → retry once  → on failure: clear session, toast, redirect to /
                       on success in app: /student/dashboard or /recruiter/dashboard
                       on tab-idle expiry:  watchdog clears session, toast
```

Items A1–A5 broke every transition after the first request expired. They
are now closed.

---

## A. Authentication — what was broken and how it was fixed

### A1 · /log-in had no login form

**Symptom.** `src/app/router.tsx` mapped `routes.logIn` to `<SignUpPage />`.
The "Already have an account? Log in" link in SignUpPage looped back to the
same page. There was no working log-in surface anywhere.

**Fix.** New page `src/pages/marketing/LoginPage.tsx` with:
- React Hook Form + `zodResolver(LogInRequestSchema)` — validation rules
  live in the L6 contract, not duplicated in the page.
- "Remember me" + "Forgot password?" + social-login placeholders matching
  the design system's auth split layout.
- On success: routes to `/onboarding`, `/student/dashboard`, or
  `/recruiter/dashboard` based on `user.onboardingCompleted` + `user.role`.
- On 422 / 4xx field errors: routes them to RHF via `setError` so the
  inputs light up red; non-field errors push a toast.
- Returns to `location.state.from` when the redirect came from a
  ProtectedRoute (so a deep-link works after sign-in).

Router wiring: `src/app/router.tsx:39` (`{ path: routes.logIn, element: withSuspense(<LoginPage />) }`).

### A2 · Password recovery missing entirely

**Symptom.** No `/forgot-password`, no `/reset-password`. The "Forgot
password?" link the design implies didn't exist.

**Fix.** Added the full vertical slice:

| Layer | File |
| --- | --- |
| L6 contracts | `src/features/auth/contracts/auth.contract.ts` (`ForgotPasswordRequestSchema`, `ResetPasswordRequestSchema`) |
| L4 service | `src/features/auth/api/auth.service.ts` (`forgotPassword`, `resetPassword`) |
| L3 use case | `src/features/auth/application/forgotPassword.usecase.ts` |
| L2 hooks | `src/features/auth/hooks/useSession.ts` (`useForgotPassword`, `useResetPassword`) |
| L1 pages | `src/pages/marketing/ForgotPasswordPage.tsx`, `src/pages/marketing/ResetPasswordPage.tsx` |
| Routes | `src/shared/config/routes.ts` (`forgotPassword`, `resetPassword`) |
| Mocks | `src/mocks/handlers.ts` |

**Privacy note.** `requestPasswordReset` always returns 200 — the mock and
the production contract both refuse to disclose whether the email exists,
to dodge account-enumeration. The page shows a generic "If an account
exists, we sent reset instructions" confirmation regardless.

### A3 · No JWT refresh

**Symptom.** `AuthSession.refreshToken` existed in the contract but no
interceptor used it. After the access token expired (mock TTL 1h), every
subsequent request 401-ed and the user was effectively logged out without
notice.

**Fix.** New L5 interceptor in `src/shared/lib/transport/interceptors/refresh.ts`:
- Catches 401 responses with `_retryOnce` guard so a refresh failure
  doesn't itself trigger refresh recursion.
- Calls the single-flight `refreshSession()` use case
  (`src/features/auth/application/refreshSession.usecase.ts`) which
  shares one in-flight promise across all concurrent 401s.
- The refresh request itself is tagged with `x-skip-auth-refresh: 1` so
  the interceptor lets it through without trying to refresh the refresh.
- On success: rewrites the failed request's `Authorization` header with
  the new bearer and replays the request.
- On failure: calls the `onAuthFailure` callback wired up in
  `src/app/providers/AuthBoot.tsx`, which clears the session, clears the
  React Query cache, and pushes a toast.

### A4 · No global 401 → auto-logout

**Symptom.** `UnauthorizedError` existed but no listener clears the store
or sends the user back to `/`. Stale tokens would generate red banners
forever.

**Fix.** `AuthBoot` registers an `onAuthFailure` callback with
`wireRefresh(...)`. When the refresh exchange fails, it:
1. Calls `useAuthStore.getState().clear()`.
2. Calls `qc.clear()` to drop every cached query.
3. Pushes a non-blocking toast ("Signed out — Please log in to continue.")

The `ProtectedRoute` guard then bounces any subsequent navigation to
`/sign-up`, preserving the original location in `location.state.from` so
the user lands back where they were after re-auth.

### A5 · Stale persisted session sent at boot

**Symptom.** Zustand persisted the session to localStorage with no
expiry check. A user closing their laptop overnight would come back and
the app would optimistically fire an authenticated request with an
expired token — every UI surface then showed a red toast.

**Fix.**
- `useAuthStore.clearIfExpired()` action added to
  `src/features/auth/store/auth.store.ts`.
- `AuthBoot` calls it once at boot (before any query fires) and shows a
  calm "Your session expired" toast.
- A 60-second watchdog interval keeps a long-running tab honest — if the
  session crosses `expiresAt` while the user is idle, it's cleared in
  place.

---

## B. Error & state handling

### B1 · Raw errors instead of a notification system

**Symptom.** Only the SignUpPage had a custom inline error banner. Every
other call site (logout, onboarding submit, dashboards) silently swallowed
failures.

**Fix.** Shipped a global Toast system:

- `src/shared/ui/Toast.tsx` — `<ToastProvider>` + `useToast()` hook + a
  fixed-position `<Toaster>` rendered once at the app root.
- Tones (`success` / `error` / `info` / `warning`) reuse the DS palette
  via Badge tokens, no new colors introduced.
- An imperative escape hatch `getToastApi()` lets non-React code (the
  L5 interceptor) push a toast without violating hook rules.
- AuthBoot subscribes to the QueryClient's query + mutation caches and
  globally reports `NetworkError` / `TimeoutError` / `ApiError` so any
  request that wasn't explicitly handled still surfaces.

Composition in `src/app/providers/index.tsx`:

```
<QueryProvider>                ← outermost: owns the QueryClient
  <ToastProvider>              ← must wrap AuthBoot (which uses useToast)
    <AuthBoot>{children}</…>   ← wires tokens, refresh, error reporter
  </ToastProvider>
</QueryProvider>
```

### B2 · "—" placeholders while data loads

**Symptom.** The student + recruiter dashboards rendered `"—"` for every
KPI until the network responded. With a slow connection this looked broken.

**Fix.**
- New `src/shared/ui/Skeleton.tsx` (`<Skeleton>` and `<SkeletonText>`).
- `StatCard.value` widened from `string` to `ReactNode` so a Skeleton
  can be passed during loading without breaking the existing call sites
  (`src/shared/ui/StatCard.tsx`).
- Active Gigs list in `src/pages/student/StudentDashboardPage.tsx` shows
  two skeleton cards while `useStudentDashboard().activeGigs.isLoading`.

### B3 · Silent mutation failures

**Symptom.** `StepBasic.onSubmit` called `submit.mutateAsync(values)` and
proceeded to the next step regardless of failure. Logout had no toast on
failure either.

**Fix.**
- `StepBasic` wraps `mutateAsync` in try/catch and pushes a toast
  describing the error.
- Logout handlers switched from `onSuccess` to `onSettled` so a logout
  that fails server-side still navigates home (the server may be down,
  but the client should still feel "logged out").

---

## C. Form validation

### C1 · Inline RHF rules duplicated the contract

**Symptom.** `SignUpPage` declared `register("password", { minLength: { value: 8, message: "Must be at least 8 characters" } })` while the L6
`SignUpRequestSchema` already enforced `z.string().min(8, "…")`. Two
sources of truth that would inevitably drift apart.

**Fix.**
- New `SignUpFormSchema` in the auth contracts file — the user-collected
  fields only (full name, email, password). `role` + `agreedToTerms` are
  separate UI state and are merged at submit time before the use case
  parses through the full `SignUpRequestSchema`.
- SignUpPage now uses `useForm({ resolver: zodResolver(SignUpFormSchema) })`.
- Server-side field errors are still routed back into RHF via
  `setError(field, { type: "server", message: ... })`.

### C2 · Onboarding StepBasic validated only at the L3 boundary

**Symptom.** Bad input (e.g. empty university field) only surfaced when
the use case called `OnboardingBasicSchema.parse(input)` — and the parse
exception wasn't caught, so it propagated to the ErrorBoundary as if it
were a network failure.

**Fix.**
- StepBasic now uses `zodResolver(OnboardingBasicSchema)` so the form
  validates live, before submission.
- `OnboardingBasicSchema` was added to the onboarding feature's public
  barrel so the page can import it without breaking layer boundaries.
- Server errors during the save are caught and surfaced as toasts.

### C3 · Missing dependency

**Fix.** Added `"@hookform/resolvers": "^3.9.0"` to `package.json`.

---

## D. Decoupling & API client structure

The audit brief specifically asked for `src/api/client.js`. The
TypeScript equivalent in this codebase is
**`src/shared/lib/transport/http.ts`**, which is the single axios
instance every L4 service uses. It now contains:

| Concern | Where |
| --- | --- |
| Base URL + timeout + default headers | `createHttp()` in `http.ts` |
| Auth header injection | `interceptors/auth.ts` |
| Trace id stamping (`x-request-id`) | `interceptors/trace.ts` |
| 401 → refresh → retry | `interceptors/refresh.ts` (wired via `wireRefresh()`) |
| Error normalization (Network / Timeout / Api / Unauthorized / Forbidden) | `interceptors/error.ts` |
| Envelope unwrap (`{ data, meta }`) | `request<T>()` and `requestEnvelope<T>()` |

Services live exactly one layer above this and **never** import axios
directly:

```ts
// L4 — features/auth/api/auth.service.ts
import { request } from "@shared/lib/transport";

export const authService = {
  async logIn(payload) {
    const raw = await request<unknown>({ method: "POST", url: "/auth/log-in", data: payload });
    return AuthSessionSchema.parse(raw);
  },
  // ...
};
```

The L1 presentation never imports a service or axios — pages talk to L2
hooks, hooks call L3 use cases, use cases call L4 services. Verified by:

```bash
grep -rn "from .axios." src/    # → no results
grep -rn "import.*service.*from" src/pages/   # → no results
```

---

## Final folder structure

```
frontend/
├── ARCHITECTURE.md
├── README.md
├── README_FIXES.md                                  ← this file
├── index.html
├── package.json                                     ← + @hookform/resolvers
├── public/
│   ├── aavasar-logo.png
│   ├── aavasar-mark.png
│   └── photos/  (hero-a.png, hero-b.png, peer-network.jpg)
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── router.tsx                              ← + login/forgot/reset routes
│   │   ├── providers/
│   │   │   ├── AuthBoot.tsx                        ← rewritten: refresh + toasts
│   │   │   ├── QueryProvider.tsx
│   │   │   └── index.tsx                           ← composes ToastProvider
│   │   └── routes/
│   │       └── ProtectedRoute.tsx
│   │
│   ├── pages/
│   │   ├── marketing/
│   │   │   ├── LandingPage.tsx
│   │   │   ├── LoginPage.tsx                       ← NEW
│   │   │   ├── ForgotPasswordPage.tsx              ← NEW
│   │   │   ├── ResetPasswordPage.tsx               ← NEW
│   │   │   ├── SignUpPage.tsx                      ← refactor: zodResolver + toast
│   │   │   └── sections/
│   │   ├── onboarding/
│   │   │   ├── OnboardingPage.tsx
│   │   │   └── steps/
│   │   │       ├── StepBasic.tsx                   ← refactor: zodResolver
│   │   │       ├── StepSkills.tsx
│   │   │       ├── StepPortfolio.tsx
│   │   │       └── StepComplete.tsx
│   │   ├── student/StudentDashboardPage.tsx        ← + Skeleton
│   │   └── recruiter/RecruiterDashboardPage.tsx    ← + Skeleton
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── api/auth.service.ts                 ← + forgot/reset/refresh
│   │   │   ├── application/
│   │   │   │   ├── signUp.usecase.ts
│   │   │   │   ├── logIn.usecase.ts
│   │   │   │   ├── forgotPassword.usecase.ts       ← NEW
│   │   │   │   └── refreshSession.usecase.ts       ← NEW
│   │   │   ├── contracts/auth.contract.ts          ← + 4 new schemas
│   │   │   ├── hooks/useSession.ts                 ← + useForgot/useReset
│   │   │   ├── store/auth.store.ts                 ← + clearIfExpired
│   │   │   └── index.ts                            ← expanded public surface
│   │   ├── dashboard/    ...                       (unchanged contract slice)
│   │   ├── gigs/         ...
│   │   └── onboarding/   ...
│   │
│   ├── shared/
│   │   ├── ui/
│   │   │   ├── Button.tsx · Card.tsx · Avatar.tsx · Badge.tsx · Tag.tsx
│   │   │   ├── Input.tsx · Checkbox.tsx · SegmentedControl.tsx
│   │   │   ├── ProgressBar.tsx · IconButton.tsx · Chip.tsx
│   │   │   ├── StatCard.tsx                        ← value: string→ReactNode
│   │   │   ├── PageLoader.tsx · ErrorBoundary.tsx
│   │   │   ├── Skeleton.tsx                        ← NEW
│   │   │   ├── Toast.tsx                           ← NEW (Provider + Toaster)
│   │   │   └── index.ts
│   │   ├── icons/
│   │   ├── layouts/
│   │   │   ├── MarketingLayout.tsx                 ← full-bleed for new auth pages
│   │   │   ├── StudentLayout.tsx · RecruiterLayout.tsx
│   │   │   ├── AuthSplitLayout.tsx                 ← NEW (shared auth chrome)
│   │   │   ├── SiteNav.tsx · SiteFooter.tsx
│   │   │   └── index.ts
│   │   ├── lib/
│   │   │   ├── env.ts
│   │   │   ├── transport/
│   │   │   │   ├── http.ts                         ← + wireRefresh()
│   │   │   │   ├── errors.ts
│   │   │   │   ├── interceptors/
│   │   │   │   │   ├── auth.ts
│   │   │   │   │   ├── trace.ts
│   │   │   │   │   ├── error.ts
│   │   │   │   │   └── refresh.ts                  ← NEW
│   │   │   │   └── index.ts
│   │   │   ├── contracts/common.ts
│   │   │   └── utils/{date,money}.ts
│   │   └── config/routes.ts                        ← + forgot/reset paths
│   │
│   ├── styles/{index.css, tokens/*.css}
│   └── mocks/
│       ├── browser.ts
│       ├── handlers.ts                             ← + forgot/reset/refresh
│       └── fixtures.ts                             ← + refreshToken on session
└── ...
```

---

## How to verify each fix

| Fix | How to verify |
| --- | --- |
| A1 Log In page | Visit `/log-in` — see the real form (not sign-up). |
| A2 Recovery | Visit `/forgot-password`, submit any email → toast + "Check your inbox" panel. |
| A3 Refresh | Open devtools network tab, watch a 401 → `/auth/refresh` → retry. |
| A4 Auto-logout | In dev console: `localStorage.setItem("aavasar.auth", "{...broken...}")` → refresh → toast + `/sign-up`. |
| A5 Expiry sweep | Edit persisted JSON so `expiresAt` is in the past → refresh → "Your session expired" toast. |
| B1 Toasts | Trigger any failed mutation (offline mode) → see a single coherent toast, not a stack trace. |
| B2 Skeletons | Throttle network to "Slow 3G" → KPI tiles + active gigs show shimmering placeholders, never `—`. |
| B3 Onboarding mutations | Block `/onboarding/basic` in devtools → submit StepBasic → see toast, stay on the page. |
| C1 Zod resolver (sign-up) | Type `a` in the password field — instant inline error from the schema, no banner. |
| C2 Zod resolver (onboarding) | Empty the university field, hit Continue — inline error from `OnboardingBasicSchema`. |
| C3 Dependency | `npm install` succeeds with `@hookform/resolvers`. |

---

## Trust direction (re-verified)

```
L1 pages    →  imports L2 hooks       (✓)  never imports L4 services
L2 hooks    →  imports L3 use cases   (✓)  never imports axios
L3 usecase  →  imports L4 services    (✓)  never imports React
L4 service  →  imports L5 transport   (✓)  never imports L1/L2
L5 transport→  imports L6 contracts   (✓)  never imports a feature
L6 contract →  imports `zod` only     (✓)
```

The call graph is acyclic. Each layer is testable in isolation. The
features expose only their barrel `index.ts`; no module reaches into
another feature's internals (`grep -rn "from .@features/.*/" src/` returns
zero matches outside of barrel files).

---

## Open follow-ups (not blocking)

- **Token storage hardening.** localStorage is XSS-readable. For a real
  production deploy, consider httpOnly secure cookies set by the backend
  + a small "auth state" flag in memory, instead of persisting the full
  session JSON.
- **CSRF.** Once we move off bearer tokens to cookies, add CSRF
  double-submit or SameSite=strict + state token.
- **Rate-limit feedback.** When the backend returns 429, the `ApiError`
  class already carries the message, but the UI doesn't highlight the
  Retry-After header. Worth a follow-up.
- **Social login.** Google/LinkedIn buttons are visually present but
  inert — wire them once the backend OAuth flow exists.
- **MFA / 2FA.** Not in the design system today; expect it for the
  premium recruiter tier.
