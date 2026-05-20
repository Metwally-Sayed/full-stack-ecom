# Mini Shop Backend — Design

Date: 2026-05-19
Status: Approved
Scope: `/backend` only (mobile + dashboard come later)

## 1. Overview

REST API backend for the "Mini Shop" full-stack challenge. Serves both an Expo
React Native mobile app and a React Vite admin dashboard. Provides auth,
products, categories, orders, and image uploads, backed by Supabase
(PostgreSQL, Auth, Storage).

## 2. Tech Stack

- Node.js 22, ESM (`"type": "module"`)
- Fastify 5
- TypeScript
- Supabase: PostgreSQL, Auth, Storage, RLS policies
- Zod validation
- `tsx` (dev), `tsup` (build)
- `@fastify/cors`, `@fastify/multipart`, `@fastify/swagger`, `@fastify/swagger-ui`

## 3. Architecture

Layered, modular, per-feature:

```
Route → Controller → Service → Repository → Supabase
```

- **Routes** — define endpoints, attach `preHandler` auth/admin hooks.
- **Controllers** — parse + Zod-validate request, shape HTTP response.
- **Services** — business logic.
- **Repositories** — Supabase DB queries.
- **Schemas** — Zod validation schemas.
- **Middlewares** — `require-auth`, `require-admin` (Fastify `preHandler` hooks).

Folder structure as specified in the task brief (`src/{config,plugins,modules,
middlewares,utils,database,types}`), `app.ts` + `server.ts` entrypoints.

## 4. Key Decisions (beyond the task brief)

1. **SQL execution is manual.** `supabase-js` cannot run DDL. `schema.sql` and
   `rls.sql` are run once by hand in the Supabase SQL Editor. `seed.ts` runs via
   the client API. Build pauses after the SQL files are written so the user can
   apply them before module verification.

2. **Storage bucket auto-created.** The seed script creates the `products`
   bucket idempotently via `storage.createBucket(name, { public: true })`.

3. **Validation in controllers via Zod.** `validateBody/validateQuery/
   validateParams` helpers throw `AppError(400, "Bad Request", ...)` on failure.
   Fastify native JSON-Schema validation is NOT used for request validation —
   Zod is the single source of truth.

4. **Lightweight Swagger.** `GET /docs` lists every route with method, path,
   tags, summary, and auth requirement. Request/response bodies are lightly
   documented (not fully typed) to avoid duplicating every Zod schema as JSON
   Schema.

5. **Explicit profile creation.** `/auth/register` and `seed.ts` create the
   `profiles` row explicitly with the service role key. No DB trigger — one
   clear code path.

6. **Seed idempotency.** Auth users matched by email via `auth.admin.
   listUsers()` before create; categories upserted by `slug`, products by
   `name`.

7. **Configurable password-reset redirect.** `PASSWORD_RESET_REDIRECT_URL` env
   var (defaults to `CORS_ORIGIN`) passed as `redirectTo` to
   `resetPasswordForEmail`.

## 5. Data Model

Tables (Postgres, `public` schema): `profiles`, `categories`, `products`,
`orders`, `order_items`. Schema is exactly as given in the task brief
(`schema.sql`), including checks, FKs, and indexes.

RLS policies (`rls.sql`) applied to all five tables per the task brief: profiles
(self read/update, admin all), categories (auth read, admin manage), products
(auth read active, admin all), orders (own read/create, admin read/update),
order_items (own via parent order, admin all).

## 6. API Surface

| Method | Path | Access | Notes |
|--------|------|--------|-------|
| POST | `/auth/register` | public | name, email, password → user + tokens |
| POST | `/auth/login` | public | email, password → user + tokens |
| POST | `/auth/forgot-password` | public | triggers Supabase reset email |
| GET | `/auth/me` | auth | current profile |
| GET | `/categories` | public | all categories, ordered by name |
| GET | `/products` | public | active only; search, category, pagination |
| GET | `/products/:id` | public | one active product |
| POST | `/products` | admin | create |
| PATCH | `/products/:id` | admin | update |
| DELETE | `/products/:id` | admin | soft delete (`is_active = false`) |
| POST | `/orders` | auth | server-side price + total |
| GET | `/orders/my` | auth | own orders, paginated, newest first |
| GET | `/orders` | admin | all orders, status filter, paginated |
| PATCH | `/orders/:id/status` | admin | update status |
| POST | `/uploads/product-image` | admin | multipart → Supabase Storage → URL |
| GET | `/docs` | public | Swagger UI |

Responses: camelCase. Lists `{ data, meta }`, single `{ data }`, actions
`{ message }`. Error format: `{ statusCode, error, message }`.

### Order pricing rule

`POST /orders` fetches product rows from DB by the requested IDs. If any
product is missing or inactive, the entire order is rejected. `unit_price` and
`total_amount` are computed server-side from DB prices — client prices are
never trusted.

## 7. Error Handling

`AppError(statusCode, error, message)` class. Global error handler:
- `AppError` → its `{ statusCode, error, message }`.
- `ZodError` → 400 `{ ..., error: "Bad Request", message: "Validation failed" }`.
- Unknown → 500 `{ ..., error: "Internal Server Error", message: "Something went wrong" }`.
- Full error logged in development only.

## 8. Auth

- `require-auth`: reads `Authorization: Bearer <token>`, verifies via
  `supabaseAdmin.auth.getUser(token)`, loads profile, attaches `request.user`
  (`{ id, email, name, role }`). 401 on failure. `FastifyRequest` extended in
  `src/types/fastify.d.ts`.
- `require-admin`: runs after `require-auth`, 403 unless `role === "admin"`.

## 9. Environment

`.env` / `.env.example`: `NODE_ENV`, `PORT`, `SUPABASE_URL`,
`SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET`,
`CORS_ORIGIN`, `PASSWORD_RESET_REDIRECT_URL`. Validated by Zod at startup
(`config/env.ts`); invalid env throws a clear error. Service role key is
backend-only.

## 10. Seed Data

3 categories (Electronics, Fashion, Home), 10 products across them, 1 customer
(`customer@test.com` / `Password123!`), 1 admin (`admin@test.com` /
`Password123!`). Idempotent. Creates the storage bucket.

## 11. Risks / Limitations

- **Service role bypasses RLS.** The backend uses the service role key, so RLS
  is not the enforcement path here. Policies are still written and applied
  (task requirement) and protect any direct client access. README states this.
- **Live verification is partial.** Build/boot/seed and live API calls can be
  verified. Schema + RLS must be applied manually before module verification —
  a mid-build gate.
- **Email delivery** for forgot-password depends on the Supabase project's SMTP
  config; the default mailer is rate-limited.

## 12. Build Sequence

The 22-step order from the task brief, with one insertion: after `rls.sql` is
written, pause for the user to run `schema.sql` + `rls.sql` in the Supabase SQL
Editor before building feature modules, enabling live per-module verification.
