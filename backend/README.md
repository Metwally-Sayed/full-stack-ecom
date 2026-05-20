# Mini Shop Backend

REST API for the Mini Shop full-stack challenge. Serves an Expo React Native mobile app and a React Vite admin dashboard.

## Tech Stack

| | |
|---|---|
| **Runtime** | Node.js 22 (ESM) |
| **Framework** | Fastify 5 |
| **Language** | TypeScript |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (JWT) |
| **Storage** | Supabase Storage |
| **Validation** | Zod |
| **Dev** | tsx |
| **Build** | tsup |

## Architecture

```
Route → Controller → Service → Repository → Supabase
```

```
src/
  config/        env.ts, supabase.ts
  plugins/       cors, error-handler, swagger
  modules/       auth / categories / products / orders / uploads
  middlewares/   require-auth.ts, require-admin.ts
  utils/         app-error, pagination, response, zod helpers
  database/      schema.sql, rls.sql, seed.ts
  types/         fastify.d.ts, common.ts
  app.ts         Fastify factory
  server.ts      Entrypoint
```

## Environment Variables

Copy `.env.example` → `.env` and fill in the three Supabase values:

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` / `production` |
| `PORT` | Server port (default `8080`) |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key — **backend only, never expose** |
| `SUPABASE_STORAGE_BUCKET` | Storage bucket name (default `products`) |
| `CORS_ORIGIN` | Allowed CORS origin (default `http://localhost:5173`) |
| `PASSWORD_RESET_REDIRECT_URL` | Where Supabase redirects after password reset |

## Supabase Setup

### 1 — Database schema

Run `src/database/schema.sql` in the **Supabase SQL Editor**.  
Creates: `profiles`, `categories`, `products`, `orders`, `order_items` + indexes.

### 2 — RLS policies

Run `src/database/rls.sql` in the **Supabase SQL Editor**.  
Enables Row Level Security on all 5 tables and creates the `is_admin()` helper.

> The backend uses the service role key which bypasses RLS. Policies protect any direct client access (e.g. a future mobile anon-key flow).

### 3 — Realtime products

Run `src/database/realtime.sql` in the **Supabase SQL Editor**.  
Adds `public.products` to the `supabase_realtime` publication so dashboard edits can notify subscribed clients.

Clients should subscribe with a Supabase access token. The RLS policies determine which product change events each user can receive.

### 4 — Storage bucket

Created automatically by `npm run seed` (public bucket named `products`).

## Installation & Running

```bash
cd backend
npm install
cp .env.example .env   # fill in Supabase credentials

# Run schema.sql + rls.sql + realtime.sql in Supabase SQL Editor first, then:
npm run seed            # seed categories, products, test accounts
npm run dev             # start dev server at http://localhost:8080
```

## Production Build

```bash
npm run build   # compiles to dist/
npm start       # runs dist/server.js
```

## API Routes

### Auth
| Method | Path | Access |
|---|---|---|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |
| POST | `/auth/forgot-password` | Public |
| GET | `/auth/me` | Authenticated |

### Categories
| Method | Path | Access |
|---|---|---|
| GET | `/categories` | Public |

### Products
| Method | Path | Access |
|---|---|---|
| GET | `/products` | Public — supports `?search=`, `?category=`, `?page=`, `?limit=` |
| GET | `/products/:id` | Public |
| POST | `/products` | Admin |
| PATCH | `/products/:id` | Admin |
| DELETE | `/products/:id` | Admin — soft delete (`is_active = false`) |

### Orders
| Method | Path | Access |
|---|---|---|
| POST | `/orders` | Authenticated |
| GET | `/orders/my` | Authenticated |
| GET | `/orders` | Admin — supports `?status=`, `?page=`, `?limit=` |
| PATCH | `/orders/:id/status` | Admin |

### Uploads
| Method | Path | Access |
|---|---|---|
| POST | `/uploads/product-image` | Admin — multipart/form-data |

### Docs
| Method | Path |
|---|---|
| GET | `/docs` — Swagger UI |
| GET | `/health` — Health check |

## Test Credentials

| Role | Email | Password |
|---|---|---|
| Customer | `customer@test.com` | `Password123!` |
| Admin | `admin@test.com` | `Password123!` |

## Technical Decisions

I used a modular Route → Controller → Service → Repository architecture. This keeps HTTP handling, business logic, and database access separated. It makes the backend easier to test, extend, and connect to both the mobile app and admin dashboard.

Validation is handled via Zod in controllers (single source of truth), not Fastify's native JSON-Schema validation. All prices are computed server-side on `POST /orders` — the frontend sends product IDs and quantities only; the backend fetches prices from the database and rejects orders containing inactive or missing products.

The service role key is backend-only and bypasses Supabase RLS. RLS policies are applied for any direct client access.
