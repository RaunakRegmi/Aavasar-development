# Aavasar Backend

> Production-grade Node.js + Express + Prisma backend for the
> Aavasar student-talent marketplace. Pairs with `frontend/` —
> wire shapes mirror the frontend's L6 Zod contracts so a 422 from
> the API lights up form fields automatically.

---

## 1. Folder structure

```
backend/
├── prisma/
│   └── schema.prisma                 PostgreSQL schema (single source of truth)
├── src/
│   ├── server.ts                     process entrypoint (binds port, graceful shutdown)
│   ├── app.ts                        Express factory — no listen call
│   ├── config/
│   │   ├── env.ts                    Zod-validated process.env
│   │   ├── logger.ts                 Pino instance (JSON in prod, pretty in dev)
│   │   └── prisma.ts                 PrismaClient singleton
│   ├── middlewares/
│   │   ├── requestId.ts              x-request-id (mint or echo)
│   │   ├── requestLogger.ts          pino-http with custom log levels
│   │   ├── validate.ts               generic Zod validation (body/query/params)
│   │   ├── auth.ts                   requireAuth, requireRole
│   │   ├── rateLimit.ts              general + auth-specific limiters
│   │   ├── notFound.ts               catch-all 404
│   │   └── error.ts                  GLOBAL ERROR HANDLER — must be last
│   ├── lib/
│   │   ├── errors.ts                 AppError hierarchy (isOperational flag)
│   │   ├── jwt.ts                    sign/verify access + refresh, hashRefreshToken
│   │   ├── password.ts               bcryptjs hash/verify
│   │   ├── response.ts               envelope wrapper (ok / okList / noContent)
│   │   ├── async.ts                  asyncHandler
│   │   └── pagination.ts             PaginationSchema + parseSort
│   ├── modules/
│   │   ├── users/
│   │   │   ├── user.repository.ts    L4 data access
│   │   │   └── user.mapper.ts        Prisma User → SessionUserDto
│   │   ├── auth/
│   │   │   ├── auth.routes.ts        L1 entry
│   │   │   ├── auth.controller.ts    L2 request handling
│   │   │   ├── auth.service.ts       L3 business logic (PURE — no HTTP)
│   │   │   ├── auth.repository.ts    L4 data access (refresh tokens, password resets)
│   │   │   ├── auth.contracts.ts     L6 Zod schemas
│   │   │   └── strategies/           Passport: google / linkedin / github
│   │   └── gigs/
│   │       ├── gig.routes.ts         L1
│   │       ├── gig.controller.ts     L2
│   │       ├── gig.service.ts        L3 (role + ownership enforcement)
│   │       ├── gig.repository.ts     L4
│   │       ├── gig.contracts.ts      L6
│   │       └── gig.mapper.ts         Prisma → GigDto
│   └── container/
│       └── index.ts                  COMPOSITION ROOT — wires repos→services→controllers
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

Each module owns its 5 layers. Other modules only consume a sibling
module through its public `index`-style exports (today: the
controller/service exported by the composition root). No cross-module
reach into another module's repository.

---

## 2. Request flow — every API call follows this chain

```
            HTTP request from the React frontend
                          │
                          ▼
   ┌────────────────────────────────────────────────────────┐
   │  helmet  →  cors  →  json/cookie  →  passport.init     │
   │  →  requestId  →  pino-http  →  rateLimit              │  app.ts
   └────────────────────────────────────────────────────────┘
                          │
                          ▼
   ┌────────────────────────────────────────────────────────┐
   │  L1  ROUTES                                            │  modules/<x>/<x>.routes.ts
   │      mounts validate(...) + requireAuth(...) + handler │
   └────────────────────────────────────────────────────────┘
                          │
                          ▼
   ┌────────────────────────────────────────────────────────┐
   │  L2  CONTROLLER                                        │  modules/<x>/<x>.controller.ts
   │      reads validated req, calls service, writes        │
   │      response via ok() / okList() / noContent()        │
   └────────────────────────────────────────────────────────┘
                          │
                          ▼
   ┌────────────────────────────────────────────────────────┐
   │  L3  SERVICE  (NO HTTP / EXPRESS)                      │  modules/<x>/<x>.service.ts
   │      pure business rules — testable in isolation       │
   └────────────────────────────────────────────────────────┘
                          │
                          ▼
   ┌────────────────────────────────────────────────────────┐
   │  L4  REPOSITORY                                        │  modules/<x>/<x>.repository.ts
   │      Prisma queries only — no auth, no orchestration   │
   └────────────────────────────────────────────────────────┘
                          │
                          ▼
   ┌────────────────────────────────────────────────────────┐
   │  L5  ENTITY  /  Prisma model                           │  prisma/schema.prisma
   │      table row, snake_case → camelCase via mapper      │
   └────────────────────────────────────────────────────────┘

           ── response goes back up the same chain ──
                          │
                          ▼
   ┌────────────────────────────────────────────────────────┐
   │  mapper → DTO  →  envelope { data, meta? }             │
   │  errors flow through `error.ts` and become             │
   │  { code, message, fields?, traceId }                   │
   └────────────────────────────────────────────────────────┘
```

This mirrors the frontend's 6-layer flow (UI → hooks → use-case →
service → transport → contract). A POST from the SignUp form arrives
at L1 here as a validated payload, flows down to L4, and the
`AuthSession` it returns flies back up through the same five layers
to land in `useSignUp().mutateAsync(...)` on the frontend.

---

## 3. Local development

```bash
# 1. Postgres (Docker is the cheapest path):
docker run --name aavasar-pg \
  -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=aavasar \
  -p 5432:5432 -d postgres:16

# 2. Install + configure
cd backend
npm install
cp .env.example .env
# Open .env and set JWT_*_SECRET to 48 bytes of random:
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"

# 3. Migrations + Prisma client
npm run prisma:migrate -- --name init

# 4. Run the API
npm run dev
# → http://localhost:8080/api/v1
```

Health probes:

- `GET /healthz` → `200 ok` (liveness)
- `GET /readyz` → `200 ready` (runs `SELECT 1` against Postgres)

---

## 4. Database migrations

Prisma migrations are the source of truth for the schema. The
workflow is:

```bash
# Edit prisma/schema.prisma, then create a migration:
npm run prisma:migrate -- --name add_gig_status_index

# That generates a SQL file under prisma/migrations/<timestamp>_<name>/
# AND regenerates the typed Prisma client. Commit BOTH the SQL file
# and the schema.prisma changes in the same PR.
```

**Production deploys** never run `migrate dev`. The release pipeline
runs:

```bash
npm run prisma:deploy        # applies any pending migrations
npm run build                # tsc → dist/
npm run start                # node dist/server.js
```

**Rules of thumb:**

- Add a column? Prefer `nullable + default → backfill → set NOT NULL`
  across two releases. A single migration that drops/renames a column
  in active code is a deploy outage waiting to happen.
- Big backfills? Don't put them in a migration. Ship a one-off script
  under `scripts/`, run it post-deploy, then drop the temporary
  nullability in the next release.
- Renaming? Prisma writes a destructive SQL by default. Inspect the
  generated SQL before merging — manual edits are sometimes required
  to do an additive rename.

---

## 5. Error model

`AppError` is the base class for everything intentionally thrown by
the codebase. Each subclass picks a status, a stable `code`, and the
`isOperational` flag that the global handler uses to decide the log
level.

```
BadRequestError      400  BAD_REQUEST
ValidationError      422  VALIDATION_FAILED  (carries `fields` map)
UnauthorizedError    401  UNAUTHORIZED
ForbiddenError       403  FORBIDDEN
NotFoundError        404  NOT_FOUND
ConflictError        409  CONFLICT
RateLimitError       429  TOO_MANY_REQUESTS  (sets Retry-After)
ServiceUnavailableError 503 SERVICE_UNAVAILABLE
InternalError        500  INTERNAL_ERROR   ← isOperational = false
```

The handler also translates **Prisma** known-error codes
(`P2002` → 409, `P2025` → 404), **ZodError** → 422, and JWT errors
→ 401 before the response is built. Programmer bugs are logged at
`error`/`fatal` with the full stack; their message is hidden behind
"Something went wrong on our end" in production responses.

---

## 6. Authentication

**Local credentials.**
`/auth/sign-up` and `/auth/log-in` produce an `AuthSession`:

```jsonc
{
  "data": {
    "accessToken":  "eyJhbGc...",        // HS256, 15-minute TTL by default
    "refreshToken": "eyJhbGc...",        // HS256, 30-day TTL
    "expiresAt":    "2025-…T…+00:00",    // ISO of access token expiry
    "user":         { /* SessionUser */ }
  }
}
```

The frontend stores both in its persisted auth store. The L5 transport
attaches `Authorization: Bearer <access>` to every request.

**Refresh flow.** When an access token expires the frontend's
interceptor hits `POST /auth/refresh` with the refresh token. The
service:

1. Verifies the JWT signature + expiry.
2. Looks up the row by `jti`. The refresh token is stored as a
   SHA-256 hash — a DB leak alone doesn't grant session access.
3. If the row is revoked OR the hash mismatches → that's a
   replay/leak → invalidate **every** session for the user
   (`tokenVersion++`).
4. Otherwise rotate: revoke the old row, insert a new one, return a
   fresh access + refresh pair.

**OAuth.** Google / LinkedIn / GitHub are wired via Passport. Each
strategy only registers if its env vars are set; the corresponding
`/auth/oauth/<provider>/start` route 503s with a clear message if the
provider isn't configured. The callback redirects to
`OAUTH_SUCCESS_REDIRECT` with `accessToken` + `refreshToken` query
parameters (the frontend's `/auth/callback` page picks them up).

---

## 7. Listing endpoints — pagination, sorting, filtering

Every listing endpoint (`GET /gigs`, `GET /admin/users`, …) follows the
same conventions. Take `GET /gigs` as the canonical example:

```
GET /api/v1/gigs?page=2&pageSize=20&category=design&payKind=hourly&sort=-postedAt,title
```

| Param      | Type             | Notes |
| ---------- | ---------------- | ----- |
| `page`     | int ≥ 1          | default 1 |
| `pageSize` | int 1..50        | default 20 |
| `query`    | string ≤ 200     | full-text on title + description |
| `category` | string           | exact match |
| `location` | remote/onsite/hybrid | |
| `payKind`  | hourly/fixed     | |
| `status`   | GigStatus        | requires auth for non-active |
| `sort`     | csv field list   | `-field` for desc; whitelisted to `postedAt`, `title`, `payAmountMinor` |

Response includes the envelope's `meta`:

```jsonc
{
  "data": [ /* GigDto[] */ ],
  "meta": { "page": 2, "pageSize": 20, "total": 137 }
}
```

---

## 8. Dependency injection / testability

The composition root (`src/container/index.ts`) is the single place
where concrete classes are instantiated. Every service / controller /
repository takes its dependencies via the constructor — so any one of
them can be swapped for a fake in a unit test:

```ts
// example service test
import { describe, it, expect, vi } from "vitest";
import { AuthService } from "@modules/auth/auth.service";

const fakeUsers = { findByEmail: vi.fn().mockResolvedValue(null), create: vi.fn() };
const fakeAuth  = { createRefreshToken: vi.fn().mockResolvedValue({}) };

const svc = new AuthService(fakeUsers as any, fakeAuth as any);

it("rejects duplicate sign-up", async () => {
  fakeUsers.findByEmail.mockResolvedValueOnce({ id: "u_1" });
  await expect(svc.signUp(/* ... */)).rejects.toMatchObject({ code: "CONFLICT" });
});
```

No DI framework, no decorator metadata, no `reflect-metadata`. Just
constructor injection wired in one file.

---

## 9. Security checklist (already in place)

- `helmet` with sensible defaults — CSP intentionally off for an API.
- `cors` strict origin allowlist (the frontend's `FRONTEND_ORIGIN`).
- Bearer auth only; refresh tokens stored hashed; rotation on every use.
- `tokenVersion` "kill switch" — bumping it logs out every device.
- Password hashing with bcryptjs cost 12.
- `rate-limiter-flexible` on every route + a stricter limiter on
  `/auth/*` to slow credential stuffing.
- Zod validation at the controller boundary; nothing trusts `req.body`
  past `validate(...)`.
- PII redaction in the pino logger (Authorization headers, passwords,
  tokens — see `config/logger.ts`).
- Account-enumeration defence: `/auth/forgot-password` always 200s
  whether or not the email is registered.

---

## 10. Scaling strategy

Where the codebase is designed to grow as the platform does.

**Phase 1 — single Node process + managed Postgres.** That's what
this repo defaults to. Comfortable up to a few hundred RPS on a
2-vCPU box.

**Phase 2 — horizontal scale + Redis.**

- Run Node behind a load balancer; sticky sessions are NOT required
  because we use stateless bearer tokens.
- Replace the in-memory rate limiter with a Redis-backed
  `RateLimiterRedis` (drop-in swap inside `middlewares/rateLimit.ts`).
- Add Redis-backed caching for hot reads:
  `GET /gigs` (1-minute TTL), `GET /auth/me` (per-user 30-second TTL).
- Move OAuth state-store cookies to a signed-cookie strategy or
  Redis so multiple Node pods can complete the round-trip.

**Phase 3 — read replicas + asynchronous workers.**

- Postgres read replica. Repositories opt into the replica for
  list/featured/getById; writes stay on primary.
- Promote password-reset email send and OAuth account-link
  notifications to a queue (BullMQ over Redis). The service layer
  already returns synchronously — only the side effect moves.

**Phase 4 — split modules into separate services.**

- Modules are already isolated under `src/modules/<name>`. A natural
  cut line is to peel off `messaging`, `notifications`, and
  `payments` into their own services. They share the same
  `lib/errors`, `lib/jwt`, and contracts via a future `@aavasar/sdk`
  shared package.

**Operational additions (cross-cutting):**

- Tracing — wire `@opentelemetry/sdk-node` in `server.ts`; the
  request id from `requestId` becomes the trace's correlation id.
- Metrics — `prom-client` exposing `/metrics` (RED — Rate, Errors,
  Duration — per route).
- Sentry / Datadog — capture every `InternalError` (the global
  handler is the single funnel; `event: "error.programmer"` is the
  filter).
- Feature flags — `@openfeature/server-sdk` for staged rollouts of
  the recruiter pipeline and the AI applicant-scoring path.

---

## 11. Scripts

| Command | Effect |
| --- | --- |
| `npm run dev`              | `tsx watch src/server.ts` — HMR dev server |
| `npm run typecheck`        | `tsc --noEmit` |
| `npm run build`            | compile to `dist/` |
| `npm run start`            | `node dist/server.js` (production) |
| `npm run prisma:migrate`   | dev migration (creates SQL + applies) |
| `npm run prisma:deploy`    | apply pending migrations (CI/prod) |
| `npm run prisma:generate`  | regenerate the Prisma client only |
| `npm run prisma:studio`    | open Prisma's table browser |
| `npm test`                 | vitest run |

---

## 12. Endpoints (current)

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| `GET`   | `/healthz`                              | — | liveness |
| `GET`   | `/readyz`                               | — | readiness (db ping) |
| `GET`   | `/api/v1`                               | — | version metadata |
| `POST`  | `/api/v1/auth/sign-up`                  | — | new account |
| `POST`  | `/api/v1/auth/log-in`                   | — | credentials |
| `POST`  | `/api/v1/auth/refresh`                  | — | rotate session |
| `POST`  | `/api/v1/auth/log-out`                  | ✓ | revoke refresh |
| `GET`   | `/api/v1/auth/me`                       | ✓ | current SessionUser |
| `POST`  | `/api/v1/auth/forgot-password`          | — | issues reset link |
| `POST`  | `/api/v1/auth/reset-password`           | — | consumes token, issues session |
| `GET`   | `/api/v1/auth/oauth/{google,linkedin,github}/start`    | — | OAuth start |
| `GET`   | `/api/v1/auth/oauth/{google,linkedin,github}/callback` | — | OAuth callback (redirects) |
| `GET`   | `/api/v1/gigs`                          | — | list w/ paging + filters |
| `GET`   | `/api/v1/gigs/featured`                 | — | premium picks |
| `GET`   | `/api/v1/gigs/:id`                      | — | one gig |
| `POST`  | `/api/v1/gigs`                          | ✓ recruiter | create |
| `PATCH` | `/api/v1/gigs/:id`                      | ✓ owner/admin | update |
| `DELETE`| `/api/v1/gigs/:id`                      | ✓ owner/admin | delete |

Future modules (mirroring the frontend's stubs): `companies`,
`applications`, `messages`, `onboarding`, `dashboard` aggregates,
`notifications`, `billing`, `admin`.
