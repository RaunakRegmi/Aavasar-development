# Aavasar Frontend

> *जता सीप, त्यता अवसर* — *"Where there's skill, there's opportunity."*

The web frontend for **Aavasar**, the student-talent marketplace localized
for Nepal (NPR). Built with React 18, TypeScript, Vite, and a strict 6-layer
architecture. See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the
end-to-end data flow and folder map.

---

## Quickstart

```bash
# 1. Install dependencies
cd frontend
npm install

# 2. Configure environment
cp .env.example .env
#   Default uses in-memory mocks so the backend is optional in dev.

# 3. Start the dev server
npm run dev
```

The app will be available at <http://localhost:5173>.

### What you can navigate locally

| Route | Layer being exercised |
| --- | --- |
| `/` | Marketing landing page (full DS recreation) |
| `/sign-up` | Sign-up form — flows through all 6 layers |
| `/onboarding` | 4-step student wizard with persisted draft |
| `/student/dashboard` | Student Hub (auth-protected; sign up as student first) |
| `/recruiter/dashboard` | Recruiter Admin (sign up with `@company` email) |

Because mocks are on by default, the sign-up form returns a session
immediately. To exercise the recruiter view, enter an email containing
`company` (e.g. `you@company.com`).

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | TypeScript build + production bundle |
| `npm run preview` | Serve the production bundle locally |
| `npm run typecheck` | `tsc --noEmit` (CI gate) |
| `npm run lint` | ESLint with the strict ruleset |

---

## Project layout

```
src/
├── app/           App composition (entrypoint, providers, router, guards)
├── pages/         L1 Presentation — route components (marketing / student / recruiter / onboarding)
├── features/      Feature modules — each owns its 6 layers
│   ├── auth/      api/ · application/ · contracts/ · hooks/ · store/ · index.ts
│   ├── gigs/
│   ├── dashboard/
│   └── onboarding/
├── shared/        Reusable building blocks
│   ├── ui/        Design system primitives ported to TypeScript
│   ├── icons/     Lucide wrapper
│   ├── layouts/   Marketing / Student / Recruiter shells
│   ├── lib/       env · transport (L5) · contracts (L6) · utils
│   └── config/    routes.ts (single source of truth for paths)
├── styles/        Token CSS (colors, typography, spacing, fonts)
└── mocks/         Axios-adapter mock server for backend-less dev
```

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the **why** behind each layer.

---

## The 6-layer data flow at a glance

```
L1 Presentation     pages/, features/*/components
        ▼
L2 Hooks / State    features/*/hooks/, *.store.ts        (React Query, Zustand)
        ▼
L3 Application      features/*/application/*.usecase.ts  (business orchestration)
        ▼
L4 Service          features/*/api/*.service.ts          (endpoint URLs only)
        ▼
L5 Transport        shared/lib/transport/                 (axios + interceptors)
        ▼
L6 Contract         features/*/contracts/, shared/lib/contracts/ (Zod schemas)
        ▼
                    HTTP wire → Backend
```

A `Sign Up` click follows this chain top-to-bottom; the response parses
back up through the same layers in reverse. Every layer does **one** thing.

---

## Talking to the real backend

When the backend ships:

1. Set `VITE_API_BASE_URL=https://api.your-host/api/v1` in `.env`.
2. Set `VITE_USE_MOCKS=false`.
3. Restart `npm run dev`.

That's all. Because the L6 contracts mirror the wire shape exactly, any
deviation by the backend will throw a `ZodError` at the L4 boundary —
fail-loud rather than silently corrupting state downstream.

---

## Design system

The visual design is a faithful TypeScript port of the **Aavasar Design
System** (`../Aavasar Design System/`). Tokens live as CSS variables in
`src/styles/tokens/*.css` so:

- A single token edit (e.g. `--brand-700: ...`) re-themes the whole app.
- Primitives in `src/shared/ui/` never hardcode colors; they reference
  `var(--…)`.
- Photography and the wordmark were copied verbatim from the design
  system's `assets/` folder into `public/`.

Brand voice rules (warm, encouraging, professional; no emoji; NPR with
South-Asian digit grouping; Devanagari only for brand moments) are
honored throughout the UI.

---

## Contributing

1. Find or create the right feature folder under `src/features/`.
2. Respect layer boundaries: a page never imports a service; a service
   never imports a hook.
3. Always validate wire payloads through a Zod schema — never `as` cast.
4. Run `npm run typecheck` before pushing.

See `ARCHITECTURE.md → "Adding a new feature"` for a step-by-step example.
