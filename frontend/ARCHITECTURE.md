# Aavasar Frontend — Enterprise Architecture

> *जता सीप, त्यता अवसर* — *"Where there's skill, there's opportunity."*

This document describes how the frontend is structured, why it's structured
that way, and how a single user action travels from a button click all the
way to the backend (and back). The goal is that any new engineer can pick a
feature, follow the data, and ship a change without violating boundaries.

---

## 1. Stack at a glance

| Concern | Choice | Why |
| --- | --- | --- |
| Build tool | **Vite 5** | Fast HMR, ESM-native, zero config Tailwind / TS / JSX. |
| Language | **TypeScript 5 (strict)** | Compile-time contract enforcement across the 6 layers. |
| UI runtime | **React 18** | Concurrent rendering, suspense for code-split routes. |
| Routing | **React Router 6** | Nested layouts + lazy routes + typed `routes.ts` table. |
| Server state | **TanStack Query v5** | Caching, retries, dedup, devtools — handles 90% of "API state." |
| Client state | **Zustand** (persisted) | One store per feature; never god-state. |
| Forms | **React Hook Form + Zod** | One library handles UX, one handles validation. |
| HTTP | **Axios** + interceptors | Single adapter, swappable for MSW or mocks. |
| Icons | **lucide-react** | Same icon family as the design source, tree-shakable. |
| Styling | **CSS variables** (design tokens) + inline styles | 1:1 with the design system; no runtime CSS engine needed. |

---

## 2. The 6-layer data flow

Every feature is structured around the same six layers. When data flows
"down" (user → backend) it passes through L1 → L6; the response "up"
(backend → UI) parses through L6 → L1.

```
┌──────────────────────────────────────────────────────────────────┐
│  L1  PRESENTATION    React pages + components                    │
│                       src/pages/**, src/features/*/components/   │
│        ▼                                                          │
│  L2  HOOKS / STATE   React Query + Zustand bindings              │
│                       src/features/*/hooks/, *.store.ts          │
│        ▼                                                          │
│  L3  APPLICATION     Business orchestration (use cases)          │
│                       src/features/*/application/*.usecase.ts    │
│        ▼                                                          │
│  L4  SERVICE         Feature API adapters (endpoint URLs only)   │
│                       src/features/*/api/*.service.ts            │
│        ▼                                                          │
│  L5  TRANSPORT       Axios instance + interceptors               │
│                       src/shared/lib/transport/                  │
│        ▼                                                          │
│  L6  CONTRACT        Zod schemas → TS types (wire shapes)        │
│                       src/features/*/contracts/, src/shared/lib/ │
│                       contracts/                                  │
│        ▼                                                          │
│        wire (HTTP/JSON)  ──────────────►  Backend                 │
└──────────────────────────────────────────────────────────────────┘
```

### Why six layers and not "just put it in the component"?

Most React apps blur L1 + L2 + L4 in a hook called `useThings()`. That works
fine for an app of three screens. At Aavasar's scope — two products (marketing
+ app), two audiences (student + recruiter), trust & verification flows,
onboarding wizards — it stops working. The same `gigService.list` is called
from the marketing landing page, the student "Find Work" page, and the
recruiter analytics overlay. If the network shape changes, you don't want to
hunt through screens. Each layer **does one thing well**:

- **L1 Presentation** owns *what users see*. No fetching, no business rules.
- **L2 Hooks** own *the React binding*. Cache keys, mutations, optimistic UI.
- **L3 Application** owns *the business flow*. Multi-step orchestration.
- **L4 Service** owns *which endpoint*. URLs + payload shapes.
- **L5 Transport** owns *cross-cutting network concerns*. Auth, retry, trace.
- **L6 Contract** owns *the wire shape*. Backend talks → we trust the type.

### Trust direction

L1–L3 can call **down** to L4–L6. **They never reach up.** A use case never
imports a hook. A service never imports a page. This keeps the call graph
acyclic and makes every layer testable in isolation.

---

## 3. Worked example — Sign Up (all six layers in one form)

The Sign-Up screen is the canonical end-to-end demonstration. When a student
clicks **Create Account**:

```
[L1]  SignUpPage.tsx              react-hook-form collects { fullName, email, password, role, agreedToTerms }
   │
   ▼
[L2]  useSignUp() hook            useMutation wraps signUp(); on success
                                  invalidates ["auth"] queries
   │
   ▼
[L3]  signUp() use case            SignUpRequestSchema.parse(input)      ← L6 validates
                                   authService.signUp(payload)            ← calls L4
                                   useAuthStore.setSession(session)       ← writes to store
                                   return session
   │
   ▼
[L4]  authService.signUp()         POST /auth/sign-up via http (L5)
                                   AuthSessionSchema.parse(response)      ← L6 validates
                                   return parsed session
   │
   ▼
[L5]  http (axios)                 attachAuthHeader (currently no token)
                                   attachTraceHeader (x-request-id)
                                   network round-trip
                                   normalizeError (any failure → ApiError)
   │
   ▼
[wire]                             POST https://api.aavasar.np/v1/auth/sign-up
                                   { "fullName": "...", "email": "...", "role": "student", ... }

────────  response  ────────

[L5]  axios response               { data: AuthSession } envelope unwrapped by `request<T>`
   │
   ▼
[L6]  AuthSessionSchema            parses raw JSON → typed AuthSession
                                   (throws ZodError if backend lied about shape)
   │
   ▼
[L4]  authService.signUp()          returns AuthSession
   │
   ▼
[L3]  signUp() use case             commits session to useAuthStore (Zustand)
   │
   ▼
[L2]  useSignUp() hook              mutation success → React Query invalidate
   │
   ▼
[L1]  SignUpPage.tsx                navigate("/onboarding")
```

If any link in this chain fails, the **closest** layer that knows how to
handle it does — and nothing bubbles past where it can be understood:

- **Network down?** L5 throws `NetworkError`. L1 shows "check your connection."
- **Backend returns 422?** L5 throws `ApiError` with field-level errors. L1
  routes them to react-hook-form via `setError`.
- **Backend response shape changed?** L6 `ZodError` — caught by the
  `ErrorBoundary` and logged with the request id from L5.

---

## 4. Folder map

```
frontend/
├── public/                       Static assets — copied verbatim into build
│   ├── aavasar-mark.png
│   ├── aavasar-logo.png
│   └── photos/                    hero-a.png, hero-b.png, peer-network.jpg
├── src/
│   ├── app/                      App composition (entrypoint, providers, router)
│   │   ├── main.tsx              ReactDOM bootstrap + optional mock server
│   │   ├── App.tsx               <ErrorBoundary><AppProviders><AppRouter/></></>
│   │   ├── router.tsx            Lazy-loaded routes + protected route mounts
│   │   ├── providers/
│   │   │   ├── QueryProvider.tsx React Query client (devtools in dev)
│   │   │   ├── AuthBoot.tsx      Wires Zustand auth → L5 token provider
│   │   │   └── index.tsx         Composed <AppProviders>
│   │   └── routes/
│   │       └── ProtectedRoute.tsx  Role-aware route guard
│   │
│   ├── pages/                    L1 Presentation (route components)
│   │   ├── marketing/            LandingPage.tsx + sections/, SignUpPage.tsx
│   │   ├── student/              StudentDashboardPage.tsx (+ future)
│   │   ├── recruiter/            RecruiterDashboardPage.tsx (+ future)
│   │   └── onboarding/           OnboardingPage.tsx + steps/{Basic,Skills,Portfolio,Complete}
│   │
│   ├── features/                 Vertically sliced feature modules
│   │   ├── auth/                 Sign-up, log-in, session
│   │   │   ├── api/              L4 service
│   │   │   ├── application/      L3 use cases
│   │   │   ├── contracts/        L6 Zod + types
│   │   │   ├── hooks/            L2 React-Query bindings
│   │   │   ├── store/            Zustand session store
│   │   │   └── index.ts          Public barrel (the only file consumers import)
│   │   ├── gigs/                 Gig listings, filters, recruiter pipeline
│   │   ├── dashboard/            Student + recruiter KPI aggregates
│   │   ├── onboarding/           4-step wizard state + persistence
│   │   ├── applications/         (stub) student applications, recruiter inbox
│   │   └── profile/              (stub) profile editing
│   │
│   ├── shared/                   Reusable building blocks
│   │   ├── ui/                   DS primitives (Button, Card, …) ported to TS
│   │   ├── icons/                Lucide wrapper with strict IconName type
│   │   ├── layouts/              MarketingLayout / StudentLayout / RecruiterLayout
│   │   ├── hooks/                Cross-cutting hooks (debounce, media query, …)
│   │   ├── lib/
│   │   │   ├── env.ts            Zod-validated import.meta.env
│   │   │   ├── transport/        L5 axios + interceptors + typed errors
│   │   │   ├── contracts/        L6 shared schemas (Money, Pagination, Role)
│   │   │   └── utils/            formatNpr, splitDayMonth, …
│   │   └── config/
│   │       └── routes.ts         Single source of truth for paths
│   │
│   ├── styles/                   Global CSS (tokens + reset)
│   │   ├── tokens/{colors,typography,spacing,fonts}.css
│   │   └── index.css             Imports tokens, sets base rules
│   │
│   ├── mocks/                    Axios-adapter mock server for dev
│   │   ├── browser.ts            Swaps http.defaults.adapter when VITE_USE_MOCKS=true
│   │   ├── fixtures.ts           Canned data
│   │   └── handlers.ts           Method+URL pattern → fixture
│   │
│   └── vite-env.d.ts             Typed env access
│
├── .env.example                  Copy → .env to run locally
├── ARCHITECTURE.md               This file
├── README.md                     Run + contribute
├── index.html                    Vite entry HTML
├── package.json
├── tsconfig.json                 Path aliases: @app, @pages, @features, @shared
├── tsconfig.node.json
└── vite.config.ts
```

### Path aliases

```ts
import { Button } from "@shared/ui";
import { useSignUp } from "@features/auth";
import { routes } from "@shared/config/routes";
```

No more `../../../../shared/ui/Button`. Aliases are defined twice (in
`tsconfig.json` for type-aware tools and in `vite.config.ts` for the bundler)
because Vite and the TS compiler don't share resolvers.

---

## 5. Feature module anatomy

Every feature follows the same internal shape so that "I need to add `X` to
feature `Y`" has a single right answer:

```
features/<name>/
├── api/              L4 — endpoint adapters, one file per resource
├── application/      L3 — use cases, one file per business action
├── contracts/        L6 — Zod schemas + inferred types
├── hooks/            L2 — React Query / Zustand bindings
├── components/       L1 — feature-specific UI (NOT shared across features)
├── store/            Client-side state when needed (drafts, wizards, …)
└── index.ts          PUBLIC BARREL — the only file other features may import
```

**The `index.ts` boundary is non-negotiable.** Other modules import from
`@features/auth` — they do **not** reach into `@features/auth/api/*`. This
gives us a single point of refactor: change the implementation of `useSession`
without grepping every consumer.

---

## 6. State strategy

**There are two kinds of state:**

| Kind | Lives in | Examples |
| --- | --- | --- |
| Server state | TanStack Query cache | gigs, applications, KPIs |
| Client state | Zustand (persisted) | auth session, onboarding draft |

We **do not** put server data into Zustand. We **do not** put auth tokens in
React state. We **do not** use `useEffect` to fetch. Each tool gets the job
it's best at.

### Query keys

Every feature exports a `*QueryKeys` object so cache invalidations are
typo-safe:

```ts
import { gigQueryKeys } from "@features/gigs";
queryClient.invalidateQueries({ queryKey: gigQueryKeys.featured() });
```

---

## 7. Routing & protection

Routes are declared centrally in `src/shared/config/routes.ts`. The router
wraps protected segments with `<ProtectedRoute allow={["student"]} />`,
which:

1. Bounces unauthenticated users to `/sign-up`.
2. Bounces authenticated-but-onboarding-incomplete users to `/onboarding`.
3. Bounces authenticated-but-wrong-role users to *their* dashboard.

Layouts are mounted as parent routes (`<StudentLayout>` is the parent of
every student route). Code splitting happens automatically because page
modules are lazy-loaded inside the router.

---

## 8. Transport & errors

The single axios instance lives in `src/shared/lib/transport/http.ts`.
**Services never import axios directly.** They go through `request<T>` which
unwraps the standard `{ data, meta }` envelope.

Interceptors (in order):

1. **`attachAuthHeader`** — reads the current token from the auth store. No
   stale-closure problems because it reads `useAuthStore.getState()` each call.
2. **`attachTraceHeader`** — stamps `x-request-id` so a user-reported failure
   can be pivoted to backend logs.
3. **`normalizeError`** — converts any axios failure into one of:
   `NetworkError`, `TimeoutError`, `UnauthorizedError`, `ForbiddenError`, or a
   generic `ApiError`. Upstream code does `instanceof ApiError`, never
   `error.response?.status`.

---

## 9. Mocks (dev-only)

Set `VITE_USE_MOCKS=true` in `.env` and `src/mocks/browser.ts` swaps the
axios adapter for an in-memory handler list. This lets the entire frontend
run with **zero backend**. Fixtures live in `src/mocks/fixtures.ts` and
match the L6 contracts shape — so the day the real backend ships, the only
thing that changes is `VITE_USE_MOCKS=false`.

Why not MSW? MSW needs a service worker file in `public/` and an extra
package. The axios-adapter approach intercepts the only path that matters
(the L5 transport) with zero ceremony.

---

## 10. Conventions

- **Public-facing copy** uses Title Case for buttons/nav, Sentence case for
  helper text, ALL-CAPS for eyebrows/badges. Money is rendered with the
  South-Asian (lakh) grouping via `Intl.NumberFormat("en-IN")`.
- **No emoji.** Status is carried by color, icon, and `<Badge tone>`.
- **`Money` is integer minor units (paisa)**, never floats. The view layer
  formats with `formatNpr` / `formatRupeeRate`.
- **Date storage is ISO-8601 with offset**, never JS Date in contracts.
- **Components do not own colors.** They use CSS variables from `tokens/`.
  Change the token, the whole app shifts.
- **Imports must be barrel-style.** `@features/auth`, not `@features/auth/store/auth.store`.

---

## 11. Adding a new feature — step by step

Let's say you're adding **Messages**:

1. `mkdir -p src/features/messages/{api,application,contracts,hooks,components,store}`
2. Write `contracts/message.contract.ts` — Zod schemas for `Message`, `Thread`.
3. Write `api/messages.service.ts` — `list`, `send`, `markRead`. Each
   parses through the schemas.
4. Write `application/sendMessage.usecase.ts` — orchestration if needed
   (optimistic add, then real send). Otherwise inline in the hook.
5. Write `hooks/useThreads.ts` — `useQuery` / `useMutation` bindings + cache keys.
6. Write `index.ts` — barrel-export the hooks and types.
7. Build the route component under `src/pages/student/MessagesPage.tsx`.
   It only imports from `@features/messages` and `@shared/ui`.

That's it. The 6 layers are scaffolded; you fill them in.
