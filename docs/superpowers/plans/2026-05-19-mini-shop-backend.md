# Mini Shop Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready Fastify + TypeScript + Supabase REST API backend for the Mini Shop challenge, serving both a mobile app and admin dashboard.

**Architecture:** Route → Controller → Service → Repository → Supabase, modular per-feature folders, Zod validation in controllers, service-role Supabase client for all backend operations, auth enforced via Fastify `preHandler` hooks.

**Tech Stack:** Node.js 22 ESM, Fastify 5, TypeScript, Supabase (PostgreSQL + Auth + Storage), Zod, tsx (dev), tsup (build)

**Working directory:** `/Users/metwally/Desktop/full-stack-app-ecom/backend`

---

## File Map

```
backend/
  src/
    app.ts                                   Fastify factory, register plugins + routes
    server.ts                                Start server on env.PORT
    config/
      env.ts                                 Zod env parse → typed `env` export
      supabase.ts                            supabaseAdmin + supabaseAnon clients
    plugins/
      cors.plugin.ts                         @fastify/cors
      error-handler.plugin.ts               Global error handler (AppError + ZodError)
      swagger.plugin.ts                      @fastify/swagger + @fastify/swagger-ui
    modules/
      auth/
        auth.routes.ts                       POST /register /login /forgot-password, GET /me
        auth.controller.ts                   Parse + validate req, call service, send res
        auth.service.ts                      register / login / forgotPassword / me logic
        auth.schemas.ts                      Zod: registerSchema, loginSchema, forgotPasswordSchema
        auth.types.ts                        AuthResponse, Profile interfaces
      categories/
        categories.routes.ts                 GET /categories
        categories.controller.ts
        categories.service.ts
        categories.repository.ts             getAllCategories()
        categories.schemas.ts               (empty — no body validation for GET)
        categories.types.ts                  Category interface
      products/
        products.routes.ts                   GET / GET/:id / POST / PATCH/:id / DELETE/:id
        products.controller.ts
        products.service.ts
        products.repository.ts               listProducts / getProduct / create / update / softDelete
        products.schemas.ts                  productQuerySchema, createProductSchema, updateProductSchema
        products.types.ts                    Product, CreateProductBody, UpdateProductBody
      orders/
        orders.routes.ts                     POST / GET/my / GET / PATCH/:id/status
        orders.controller.ts
        orders.service.ts                    createOrder (server-side pricing), getMyOrders, etc.
        orders.repository.ts                 insertOrder / getOrderById / listMyOrders / listAllOrders
        orders.schemas.ts                    createOrderSchema, updateOrderStatusSchema, orderQuerySchema
        orders.types.ts                      Order, OrderItem, CreateOrderBody
      uploads/
        uploads.routes.ts                    POST /product-image
        uploads.controller.ts
        uploads.service.ts                   Stream file → Supabase Storage → return publicUrl
        uploads.schemas.ts                   (validation in controller — multipart has no Zod body)
    middlewares/
      require-auth.ts                        Bearer → supabase.auth.getUser → request.user
      require-admin.ts                       request.user.role === 'admin' guard
    utils/
      app-error.ts                           AppError class
      pagination.ts                          getPaginationRange(), buildMeta()
      response.ts                            listResponse(), singleResponse(), messageResponse()
      zod.ts                                 validateBody / validateQuery / validateParams helpers
    database/
      schema.sql                             DDL for all 5 tables + indexes
      rls.sql                                Enable RLS + all policies + is_admin() helper
      seed.ts                                Seed categories, products, test users, storage bucket
    types/
      fastify.d.ts                           Extend FastifyRequest with .user
      common.ts                              UserRole, OrderStatus type aliases
  .env.example
  tsconfig.json
  README.md
```

---

## Task 1: Install Dependencies and Configure Project

**Files:**
- Modify: `package.json`
- Create: `tsconfig.json`
- Create: `.env.example`

- [ ] **Step 1: Install all runtime dependencies**

```bash
cd /Users/metwally/Desktop/full-stack-app-ecom/backend
npm install @fastify/cors @fastify/swagger @fastify/swagger-ui @fastify/multipart
npm install @supabase/supabase-js zod dotenv tsx
```

Expected: added packages, 0 vulnerabilities.

- [ ] **Step 2: Install dev dependencies**

```bash
npm install -D typescript tsup @types/node
```

- [ ] **Step 3: Update package.json**

Replace the entire `package.json` with:

```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "Mini Shop REST API",
  "type": "module",
  "main": "dist/server.js",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsup src/server.ts --format esm --dts --out-dir dist",
    "start": "node dist/server.js",
    "seed": "tsx src/database/seed.ts"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@fastify/cors": "^10.0.2",
    "@fastify/multipart": "^9.0.3",
    "@fastify/swagger": "^9.5.0",
    "@fastify/swagger-ui": "^5.2.3",
    "@supabase/supabase-js": "^2.50.0",
    "dotenv": "^16.5.0",
    "fastify": "^5.8.5",
    "tsx": "^4.19.3",
    "zod": "^3.25.28"
  },
  "devDependencies": {
    "@types/node": "^22.15.18",
    "tsup": "^8.5.0",
    "typescript": "^5.8.3"
  }
}
```

> Note: adjust version numbers to match what npm installed — use `npm list --depth=0` to verify.

- [ ] **Step 4: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 5: Create .env.example**

```env
NODE_ENV=development
PORT=8080

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

SUPABASE_STORAGE_BUCKET=products

CORS_ORIGIN=http://localhost:5173
PASSWORD_RESET_REDIRECT_URL=http://localhost:5173/reset-password
```

- [ ] **Step 6: Create .env from .env.example and fill in your Supabase credentials**

```bash
cp .env.example .env
# Now open .env and fill in SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
```

- [ ] **Step 7: Verify npm list shows all packages**

```bash
npm list --depth=0
```

Expected: fastify, @fastify/cors, @fastify/multipart, @fastify/swagger, @fastify/swagger-ui, @supabase/supabase-js, zod, dotenv, tsx all listed.

- [ ] **Step 8: Commit**

```bash
cd /Users/metwally/Desktop/full-stack-app-ecom
git add backend/package.json backend/tsconfig.json backend/.env.example
git commit -m "chore: configure backend project — ESM, TypeScript, all dependencies"
```

---

## Task 2: Environment Validation

**Files:**
- Create: `src/config/env.ts`

- [ ] **Step 1: Create src/config directory and env.ts**

```bash
mkdir -p src/config
```

Create `src/config/env.ts`:

```typescript
import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z
    .string()
    .default('8080')
    .transform((v) => parseInt(v, 10)),
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_ANON_KEY: z.string().min(1, 'SUPABASE_ANON_KEY is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  SUPABASE_STORAGE_BUCKET: z.string().default('products'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  PASSWORD_RESET_REDIRECT_URL: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add backend/src/config/env.ts
git commit -m "feat: add Zod env validation — startup exits with clear message on bad config"
```

---

## Task 3: Supabase Clients

**Files:**
- Create: `src/config/supabase.ts`

- [ ] **Step 1: Create src/config/supabase.ts**

```typescript
import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

// Service role client — used for all backend operations.
// Bypasses RLS. Never expose this key to the frontend.
export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

// Anon client — used only for auth flows that need the public key
// (signInWithPassword, signUp, resetPasswordForEmail).
export const supabaseAnon = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
```

- [ ] **Step 2: Compile check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add backend/src/config/supabase.ts
git commit -m "feat: add supabaseAdmin and supabaseAnon clients"
```

---

## Task 4: Core Utilities

**Files:**
- Create: `src/utils/app-error.ts`
- Create: `src/utils/pagination.ts`
- Create: `src/utils/response.ts`
- Create: `src/utils/zod.ts`

- [ ] **Step 1: Create src/utils directory**

```bash
mkdir -p src/utils
```

- [ ] **Step 2: Create src/utils/app-error.ts**

```typescript
export class AppError extends Error {
  statusCode: number;
  error: string;

  constructor(statusCode: number, error: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
```

- [ ] **Step 3: Create src/utils/pagination.ts**

```typescript
export interface PaginationRange {
  from: number;
  to: number;
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function getPaginationRange(page: number, limit: number): PaginationRange {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  return { from, to, page, limit };
}

export function buildMeta(page: number, limit: number, total: number): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
```

- [ ] **Step 4: Create src/utils/response.ts**

```typescript
export function listResponse<T>(data: T[], meta: object) {
  return { data, meta };
}

export function singleResponse<T>(data: T) {
  return { data };
}

export function messageResponse(message: string) {
  return { message };
}
```

- [ ] **Step 5: Create src/utils/zod.ts**

```typescript
import { ZodSchema, ZodError } from 'zod';
import { AppError } from './app-error.js';

function formatZodError(error: ZodError): string {
  return error.errors
    .map((e) => `${e.path.join('.')}: ${e.message}`)
    .join(', ');
}

export function validateBody<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new AppError(400, 'Bad Request', formatZodError(result.error));
  }
  return result.data;
}

export function validateQuery<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new AppError(400, 'Bad Request', formatZodError(result.error));
  }
  return result.data;
}

export function validateParams<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new AppError(400, 'Bad Request', formatZodError(result.error));
  }
  return result.data;
}
```

- [ ] **Step 6: Compile check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add backend/src/utils/
git commit -m "feat: add AppError, pagination, response helpers, and Zod validate helpers"
```

---

## Task 5: TypeScript Type Declarations

**Files:**
- Create: `src/types/fastify.d.ts`
- Create: `src/types/common.ts`

- [ ] **Step 1: Create src/types directory**

```bash
mkdir -p src/types
```

- [ ] **Step 2: Create src/types/common.ts**

```typescript
export type UserRole = 'customer' | 'admin';
export type OrderStatus = 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
```

- [ ] **Step 3: Create src/types/fastify.d.ts**

```typescript
import { UserRole } from './common.js';

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
    };
  }
}
```

- [ ] **Step 4: Compile check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add backend/src/types/
git commit -m "feat: add FastifyRequest.user type extension and shared type aliases"
```

---

## Task 6: Plugins — CORS and Error Handler

**Files:**
- Create: `src/plugins/cors.plugin.ts`
- Create: `src/plugins/error-handler.plugin.ts`

- [ ] **Step 1: Create src/plugins directory**

```bash
mkdir -p src/plugins
```

- [ ] **Step 2: Create src/plugins/cors.plugin.ts**

```typescript
import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { env } from '../config/env.js';

export async function corsPlugin(app: FastifyInstance): Promise<void> {
  await app.register(cors, {
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  });
}
```

- [ ] **Step 3: Create src/plugins/error-handler.plugin.ts**

```typescript
import { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from '../utils/app-error.js';
import { env } from '../config/env.js';

export async function errorHandlerPlugin(app: FastifyInstance): Promise<void> {
  app.setErrorHandler((error, _request, reply) => {
    if (env.NODE_ENV === 'development') {
      console.error(error);
    }

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: error.error,
        message: error.message,
      });
    }

    if (error instanceof ZodError) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation failed',
      });
    }

    // Fastify's own validation errors carry statusCode 400
    if ('statusCode' in error && error.statusCode === 400) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: error.message,
      });
    }

    return reply.status(500).send({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Something went wrong',
    });
  });
}
```

- [ ] **Step 4: Compile check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add backend/src/plugins/
git commit -m "feat: add CORS plugin and global error handler plugin"
```

---

## Task 7: Auth Middlewares

**Files:**
- Create: `src/middlewares/require-auth.ts`
- Create: `src/middlewares/require-admin.ts`

- [ ] **Step 1: Create src/middlewares directory**

```bash
mkdir -p src/middlewares
```

- [ ] **Step 2: Create src/middlewares/require-auth.ts**

```typescript
import { FastifyRequest, FastifyReply } from 'fastify';
import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../utils/app-error.js';

export async function requireAuth(
  request: FastifyRequest,
  _reply: FastifyReply,
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError(401, 'Unauthorized', 'Missing or invalid Authorization header');
  }

  const token = authHeader.split(' ')[1];

  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);

  if (authError || !user) {
    throw new AppError(401, 'Unauthorized', 'Invalid or expired token');
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id, email, name, role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    throw new AppError(401, 'Unauthorized', 'User profile not found');
  }

  request.user = {
    id: profile.id as string,
    email: profile.email as string,
    name: profile.name as string,
    role: profile.role as 'customer' | 'admin',
  };
}
```

- [ ] **Step 3: Create src/middlewares/require-admin.ts**

```typescript
import { FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from '../utils/app-error.js';

export async function requireAdmin(
  request: FastifyRequest,
  _reply: FastifyReply,
): Promise<void> {
  if (request.user?.role !== 'admin') {
    throw new AppError(403, 'Forbidden', 'Admin access required');
  }
}
```

- [ ] **Step 4: Compile check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add backend/src/middlewares/
git commit -m "feat: add requireAuth and requireAdmin preHandler middlewares"
```

---

## Task 8: Fastify App, Server, and Swagger

**Files:**
- Create: `src/plugins/swagger.plugin.ts`
- Create: `src/app.ts`
- Create: `src/server.ts`

- [ ] **Step 1: Create src/plugins/swagger.plugin.ts**

```typescript
import { FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

export async function swaggerPlugin(app: FastifyInstance): Promise<void> {
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Mini Shop API',
        description:
          'REST API for the Mini Shop challenge — serves Expo mobile app and React admin dashboard.',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      tags: [
        { name: 'Auth', description: 'Authentication and user profile' },
        { name: 'Categories', description: 'Product categories' },
        { name: 'Products', description: 'Product catalog' },
        { name: 'Orders', description: 'Order management' },
        { name: 'Uploads', description: 'File uploads' },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });
}
```

- [ ] **Step 2: Create src/app.ts**

```typescript
import Fastify from 'fastify';
import multipart from '@fastify/multipart';
import { corsPlugin } from './plugins/cors.plugin.js';
import { errorHandlerPlugin } from './plugins/error-handler.plugin.js';
import { swaggerPlugin } from './plugins/swagger.plugin.js';

export function buildApp() {
  const app = Fastify({
    logger: {
      level: 'info',
    },
  });

  // Plugins — order matters: swagger before routes, error handler first
  app.register(errorHandlerPlugin);
  app.register(corsPlugin);
  app.register(swaggerPlugin);
  app.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB
    },
  });

  // Health check
  app.get('/health', { schema: { tags: ['Health'], summary: 'Health check' } }, async () => ({
    status: 'ok',
  }));

  // Feature routes will be registered here in later tasks

  return app;
}
```

- [ ] **Step 3: Create src/server.ts**

```typescript
import { buildApp } from './app.js';
import { env } from './config/env.js';

async function start(): Promise<void> {
  const app = buildApp();

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
  } catch (err) {
    console.error('❌ Server startup failed:', err);
    process.exit(1);
  }
}

start();
```

- [ ] **Step 4: Compile check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Start the server and verify it boots**

```bash
npm run dev
```

Expected output (in ~2s):
```
Server listening at http://0.0.0.0:8080
```

- [ ] **Step 6: Test health check and Swagger**

```bash
curl http://localhost:8080/health
# Expected: {"status":"ok"}

curl -I http://localhost:8080/docs
# Expected: HTTP/1.1 302 or 200 — Swagger UI loads
```

Stop the dev server (`Ctrl+C`) after verifying.

- [ ] **Step 7: Commit**

```bash
git add backend/src/app.ts backend/src/server.ts backend/src/plugins/swagger.plugin.ts
git commit -m "feat: Fastify app factory, server entrypoint, Swagger at /docs, health check"
```

---

## Task 9: Database SQL Files

> ⚠️ **MANUAL GATE** — after this task you must run `schema.sql` then `rls.sql` in the Supabase SQL Editor before proceeding to Task 10.

**Files:**
- Create: `src/database/schema.sql`
- Create: `src/database/rls.sql`

- [ ] **Step 1: Create src/database directory**

```bash
mkdir -p src/database
```

- [ ] **Step 2: Create src/database/schema.sql**

```sql
-- Enable pgcrypto for gen_random_uuid()
create extension if not exists "pgcrypto";

-- profiles: extends auth.users
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null,
  email       text not null unique,
  role        text not null default 'customer'
                check (role in ('customer', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- categories
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- products
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  price       numeric(10, 2) not null check (price >= 0),
  image_url   text,
  category_id uuid references public.categories(id) on delete set null,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- orders
create table if not exists public.orders (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  status       text not null default 'Pending'
                 check (status in ('Pending', 'Processing', 'Completed', 'Cancelled')),
  total_amount numeric(10, 2) not null check (total_amount >= 0),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- order_items
create table if not exists public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  product_id  uuid references public.products(id) on delete set null,
  quantity    integer not null check (quantity > 0),
  unit_price  numeric(10, 2) not null check (unit_price >= 0),
  created_at  timestamptz not null default now()
);

-- Indexes
create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_products_is_active   on public.products(is_active);
create index if not exists idx_orders_user_id        on public.orders(user_id);
create index if not exists idx_orders_status         on public.orders(status);
create index if not exists idx_order_items_order_id  on public.order_items(order_id);
```

- [ ] **Step 3: Create src/database/rls.sql**

```sql
-- Enable RLS on all tables
alter table public.profiles    enable row level security;
alter table public.categories  enable row level security;
alter table public.products    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

-- Helper function: returns true if the calling user has role = 'admin'
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================
-- profiles
-- ============================================================
create policy "users: read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "admins: read all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "users: update own name"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "admins: update any profile"
  on public.profiles for update
  using (public.is_admin());

-- ============================================================
-- categories
-- ============================================================
create policy "authenticated: read categories"
  on public.categories for select
  using (auth.role() = 'authenticated');

create policy "admins: insert categories"
  on public.categories for insert
  with check (public.is_admin());

create policy "admins: update categories"
  on public.categories for update
  using (public.is_admin());

create policy "admins: delete categories"
  on public.categories for delete
  using (public.is_admin());

-- ============================================================
-- products
-- ============================================================
create policy "authenticated: read active products"
  on public.products for select
  using (auth.role() = 'authenticated' and is_active = true);

create policy "admins: read all products"
  on public.products for select
  using (public.is_admin());

create policy "admins: insert products"
  on public.products for insert
  with check (public.is_admin());

create policy "admins: update products"
  on public.products for update
  using (public.is_admin());

-- ============================================================
-- orders
-- ============================================================
create policy "customers: read own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "customers: insert own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "admins: read all orders"
  on public.orders for select
  using (public.is_admin());

create policy "admins: update order status"
  on public.orders for update
  using (public.is_admin());

-- ============================================================
-- order_items
-- ============================================================
create policy "customers: read own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

create policy "customers: insert own order items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

create policy "admins: read all order items"
  on public.order_items for select
  using (public.is_admin());

create policy "admins: manage all order items"
  on public.order_items for all
  using (public.is_admin());
```

- [ ] **Step 4: Commit the SQL files**

```bash
git add backend/src/database/schema.sql backend/src/database/rls.sql
git commit -m "feat: add PostgreSQL schema and RLS policy SQL files"
```

- [ ] **Step 5: ⚠️ MANUAL STEP — Run schema.sql in Supabase SQL Editor**

1. Open your Supabase project dashboard.
2. Navigate to **SQL Editor**.
3. Paste and run the entire content of `src/database/schema.sql`.
4. Verify tables appear under **Table Editor**: profiles, categories, products, orders, order_items.

- [ ] **Step 6: ⚠️ MANUAL STEP — Run rls.sql in Supabase SQL Editor**

1. In Supabase SQL Editor, paste and run the entire content of `src/database/rls.sql`.
2. Verify under **Authentication → Policies** that policies appear on all 5 tables.

**Do not proceed to Task 10 until both SQL files have been applied.**

---

## Task 10: Auth Module

**Files:**
- Create: `src/modules/auth/auth.types.ts`
- Create: `src/modules/auth/auth.schemas.ts`
- Create: `src/modules/auth/auth.service.ts`
- Create: `src/modules/auth/auth.controller.ts`
- Create: `src/modules/auth/auth.routes.ts`

- [ ] **Step 1: Create module directory**

```bash
mkdir -p src/modules/auth
```

- [ ] **Step 2: Create src/modules/auth/auth.types.ts**

```typescript
export interface Profile {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface AuthResponse {
  user: Profile;
  accessToken: string;
  refreshToken: string;
}
```

- [ ] **Step 3: Create src/modules/auth/auth.schemas.ts**

```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
```

- [ ] **Step 4: Create src/modules/auth/auth.service.ts**

```typescript
import { supabaseAdmin, supabaseAnon } from '../../config/supabase.js';
import { env } from '../../config/env.js';
import { AppError } from '../../utils/app-error.js';
import type { AuthResponse, Profile } from './auth.types.js';
import type { RegisterInput, LoginInput, ForgotPasswordInput } from './auth.schemas.js';

async function fetchProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id, email, name, role, created_at')
    .eq('id', userId)
    .single();

  if (error || !data) {
    throw new AppError(500, 'Internal Server Error', 'Failed to fetch user profile');
  }

  return {
    id: data.id as string,
    email: data.email as string,
    name: data.name as string,
    role: data.role as 'customer' | 'admin',
    createdAt: data.created_at as string,
  };
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  // Create auth user with email already confirmed (easier for testing)
  const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: { name: input.name },
  });

  if (createError) {
    if (createError.message.toLowerCase().includes('already')) {
      throw new AppError(409, 'Conflict', 'Email address is already registered');
    }
    throw new AppError(500, 'Internal Server Error', createError.message);
  }

  const authUser = createData.user!;

  // Insert profile row
  const { error: profileError } = await supabaseAdmin.from('profiles').insert({
    id: authUser.id,
    email: input.email,
    name: input.name,
    role: 'customer',
  });

  if (profileError) {
    // If profile already exists (duplicate register attempt), ignore
    if (!profileError.message.includes('duplicate')) {
      throw new AppError(500, 'Internal Server Error', 'Failed to create user profile');
    }
  }

  // Sign in to get session tokens
  const { data: signInData, error: signInError } = await supabaseAnon.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (signInError || !signInData.session) {
    throw new AppError(500, 'Internal Server Error', 'User created but failed to create session');
  }

  const profile = await fetchProfile(authUser.id);

  return {
    user: profile,
    accessToken: signInData.session.access_token,
    refreshToken: signInData.session.refresh_token,
  };
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const { data, error } = await supabaseAnon.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error || !data.session) {
    throw new AppError(401, 'Unauthorized', 'Invalid email or password');
  }

  const profile = await fetchProfile(data.user.id);

  return {
    user: profile,
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
  };
}

export async function forgotPassword(input: ForgotPasswordInput): Promise<void> {
  const redirectTo =
    env.PASSWORD_RESET_REDIRECT_URL ?? `${env.CORS_ORIGIN}/reset-password`;

  const { error } = await supabaseAnon.auth.resetPasswordForEmail(input.email, {
    redirectTo,
  });

  if (error) {
    throw new AppError(500, 'Internal Server Error', 'Failed to send reset email');
  }
}

export async function me(userId: string): Promise<Profile> {
  return fetchProfile(userId);
}
```

- [ ] **Step 5: Create src/modules/auth/auth.controller.ts**

```typescript
import { FastifyRequest, FastifyReply } from 'fastify';
import { validateBody } from '../../utils/zod.js';
import { singleResponse, messageResponse } from '../../utils/response.js';
import { registerSchema, loginSchema, forgotPasswordSchema } from './auth.schemas.js';
import * as authService from './auth.service.js';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const body = validateBody(registerSchema, request.body);
  const result = await authService.register(body);
  return reply.status(201).send(singleResponse(result));
}

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const body = validateBody(loginSchema, request.body);
  const result = await authService.login(body);
  return reply.status(200).send(singleResponse(result));
}

export async function forgotPassword(request: FastifyRequest, reply: FastifyReply) {
  const body = validateBody(forgotPasswordSchema, request.body);
  await authService.forgotPassword(body);
  return reply.status(200).send(messageResponse('Password reset email sent'));
}

export async function me(request: FastifyRequest, reply: FastifyReply) {
  const profile = await authService.me(request.user.id);
  return reply.status(200).send(singleResponse(profile));
}
```

- [ ] **Step 6: Create src/modules/auth/auth.routes.ts**

```typescript
import { FastifyInstance } from 'fastify';
import { requireAuth } from '../../middlewares/require-auth.js';
import * as authController from './auth.controller.js';

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post('/register', {
    schema: { tags: ['Auth'], summary: 'Register a new customer account' },
  }, authController.register);

  app.post('/login', {
    schema: { tags: ['Auth'], summary: 'Login and receive JWT tokens' },
  }, authController.login);

  app.post('/forgot-password', {
    schema: { tags: ['Auth'], summary: 'Send password reset email' },
  }, authController.forgotPassword);

  app.get('/me', {
    schema: {
      tags: ['Auth'],
      summary: 'Get the current authenticated user profile',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [requireAuth],
  }, authController.me);
}
```

- [ ] **Step 7: Register authRoutes in src/app.ts**

Open `src/app.ts` and add the import + register call:

```typescript
// Add this import near the top (after existing imports):
import { authRoutes } from './modules/auth/auth.routes.js';

// Add inside buildApp(), after the health check route:
app.register(authRoutes, { prefix: '/auth' });
```

- [ ] **Step 8: Compile check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 9: Start server and test auth endpoints**

```bash
npm run dev
```

Test registration:
```bash
curl -s -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Password123!"}' | jq .
```

Expected:
```json
{
  "data": {
    "user": { "id": "...", "email": "test@example.com", "name": "Test User", "role": "customer" },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

Test login:
```bash
curl -s -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!"}' | jq .accessToken
```

Test /me (paste the accessToken from above):
```bash
curl -s http://localhost:8080/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" | jq .data.email
```

Expected: `"test@example.com"`

Stop dev server.

- [ ] **Step 10: Commit**

```bash
git add backend/src/modules/auth/
git commit -m "feat: auth module — register, login, forgot-password, GET /me"
```

---

## Task 11: Categories Module

**Files:**
- Create: `src/modules/categories/categories.types.ts`
- Create: `src/modules/categories/categories.schemas.ts`
- Create: `src/modules/categories/categories.repository.ts`
- Create: `src/modules/categories/categories.service.ts`
- Create: `src/modules/categories/categories.controller.ts`
- Create: `src/modules/categories/categories.routes.ts`

- [ ] **Step 1: Create module directory**

```bash
mkdir -p src/modules/categories
```

- [ ] **Step 2: Create src/modules/categories/categories.types.ts**

```typescript
export interface Category {
  id: string;
  name: string;
  slug: string;
}
```

- [ ] **Step 3: Create src/modules/categories/categories.schemas.ts**

```typescript
// No body schemas needed for GET /categories.
// Exported as placeholder to satisfy the module pattern.
export const categoriesSchemas = {};
```

- [ ] **Step 4: Create src/modules/categories/categories.repository.ts**

```typescript
import { supabaseAdmin } from '../../config/supabase.js';

export async function getAllCategories() {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('id, name, slug')
    .order('name');

  if (error) throw error;
  return data ?? [];
}
```

- [ ] **Step 5: Create src/modules/categories/categories.service.ts**

```typescript
import * as repo from './categories.repository.js';
import type { Category } from './categories.types.js';

export async function getCategories(): Promise<Category[]> {
  const rows = await repo.getAllCategories();
  return rows.map((row) => ({
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
  }));
}
```

- [ ] **Step 6: Create src/modules/categories/categories.controller.ts**

```typescript
import { FastifyRequest, FastifyReply } from 'fastify';
import { listResponse } from '../../utils/response.js';
import * as categoriesService from './categories.service.js';

export async function getCategories(_request: FastifyRequest, reply: FastifyReply) {
  const categories = await categoriesService.getCategories();
  return reply.status(200).send(listResponse(categories, {}));
}
```

- [ ] **Step 7: Create src/modules/categories/categories.routes.ts**

```typescript
import { FastifyInstance } from 'fastify';
import * as categoriesController from './categories.controller.js';

export async function categoriesRoutes(app: FastifyInstance): Promise<void> {
  app.get('/', {
    schema: { tags: ['Categories'], summary: 'Get all product categories' },
  }, categoriesController.getCategories);
}
```

- [ ] **Step 8: Register in src/app.ts**

Add import:
```typescript
import { categoriesRoutes } from './modules/categories/categories.routes.js';
```

Add register (after authRoutes):
```typescript
app.register(categoriesRoutes, { prefix: '/categories' });
```

- [ ] **Step 9: Compile check and test**

```bash
npx tsc --noEmit
npm run dev
```

```bash
curl -s http://localhost:8080/categories | jq .
```

Expected (after seed in Task 16):
```json
{ "data": [{ "id": "...", "name": "Electronics", "slug": "electronics" }, ...], "meta": {} }
```

For now with no seed data: `{ "data": [], "meta": {} }`

Stop dev server.

- [ ] **Step 10: Commit**

```bash
git add backend/src/modules/categories/
git commit -m "feat: categories module — GET /categories"
```

---

## Task 12: Products Module

**Files:**
- Create: `src/modules/products/products.types.ts`
- Create: `src/modules/products/products.schemas.ts`
- Create: `src/modules/products/products.repository.ts`
- Create: `src/modules/products/products.service.ts`
- Create: `src/modules/products/products.controller.ts`
- Create: `src/modules/products/products.routes.ts`

- [ ] **Step 1: Create module directory**

```bash
mkdir -p src/modules/products
```

- [ ] **Step 2: Create src/modules/products/products.types.ts**

```typescript
export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isActive: boolean;
  category: ProductCategory | null;
  createdAt: string;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string | null;
  categoryId?: string;
  isActive?: boolean;
}

export interface ProductListQuery {
  search?: string;
  category?: string;
  page: number;
  limit: number;
}
```

- [ ] **Step 3: Create src/modules/products/products.schemas.ts**

```typescript
import { z } from 'zod';

export const productQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? Math.min(parseInt(v, 10), 100) : 10)),
});

export const productParamsSchema = z.object({
  id: z.string().uuid('Product ID must be a valid UUID'),
});

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().nonnegative('Price must be >= 0'),
  imageUrl: z.string().url('imageUrl must be a valid URL').optional(),
  categoryId: z.string().uuid('categoryId must be a valid UUID'),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().nonnegative().optional(),
  imageUrl: z.string().url().nullable().optional(),
  categoryId: z.string().uuid().optional(),
  isActive: z.boolean().optional(),
});
```

- [ ] **Step 4: Create src/modules/products/products.repository.ts**

```typescript
import { supabaseAdmin } from '../../config/supabase.js';
import { AppError } from '../../utils/app-error.js';

const PRODUCT_SELECT =
  'id, name, description, price, image_url, is_active, created_at, categories(id, name, slug)';

export async function listProducts(opts: {
  search?: string;
  categorySlug?: string;
  from: number;
  to: number;
}) {
  // Resolve category slug to id
  let categoryId: string | undefined;
  if (opts.categorySlug) {
    const { data: cat } = await supabaseAdmin
      .from('categories')
      .select('id')
      .eq('slug', opts.categorySlug)
      .single();
    if (!cat) return { data: [], count: 0 };
    categoryId = cat.id as string;
  }

  let query = supabaseAdmin
    .from('products')
    .select(PRODUCT_SELECT, { count: 'exact' })
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(opts.from, opts.to);

  if (opts.search) query = query.ilike('name', `%${opts.search}%`);
  if (categoryId) query = query.eq('category_id', categoryId);

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data ?? [], count: count ?? 0 };
}

export async function getProductById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getProductByIdAdmin(id: string) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function categoryExists(categoryId: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('categories')
    .select('id')
    .eq('id', categoryId)
    .single();
  return !!data;
}

export async function createProduct(input: {
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category_id: string;
}) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .insert(input)
    .select(PRODUCT_SELECT)
    .single();

  if (error || !data) throw error ?? new Error('Failed to create product');
  return data;
}

export async function updateProduct(
  id: string,
  updates: {
    name?: string;
    description?: string;
    price?: number;
    image_url?: string | null;
    category_id?: string;
    is_active?: boolean;
    updated_at: string;
  },
) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .update(updates)
    .eq('id', id)
    .select(PRODUCT_SELECT)
    .single();

  if (error || !data) throw error ?? new Error('Failed to update product');
  return data;
}

export async function softDeleteProduct(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('products')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}
```

- [ ] **Step 5: Create src/modules/products/products.service.ts**

```typescript
import { AppError } from '../../utils/app-error.js';
import { getPaginationRange, buildMeta } from '../../utils/pagination.js';
import * as repo from './products.repository.js';
import type { Product, CreateProductInput, UpdateProductInput, ProductListQuery } from './products.types.js';

function mapProduct(row: Record<string, unknown>): Product {
  const cat = row.categories as Record<string, string> | null;
  return {
    id: row.id as string,
    name: row.name as string,
    description: (row.description as string | null) ?? null,
    price: Number(row.price),
    imageUrl: (row.image_url as string | null) ?? null,
    isActive: row.is_active as boolean,
    category: cat
      ? { id: cat.id, name: cat.name, slug: cat.slug }
      : null,
    createdAt: row.created_at as string,
  };
}

export async function listProducts(query: ProductListQuery) {
  const { from, to } = getPaginationRange(query.page, query.limit);
  const { data, count } = await repo.listProducts({
    search: query.search,
    categorySlug: query.category,
    from,
    to,
  });

  return {
    data: data.map((row) => mapProduct(row as Record<string, unknown>)),
    meta: buildMeta(query.page, query.limit, count),
  };
}

export async function getProduct(id: string): Promise<Product> {
  const row = await repo.getProductById(id);
  if (!row) throw new AppError(404, 'Not Found', 'Product not found');
  return mapProduct(row as Record<string, unknown>);
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const exists = await repo.categoryExists(input.categoryId);
  if (!exists) throw new AppError(404, 'Not Found', 'Category not found');

  const row = await repo.createProduct({
    name: input.name,
    description: input.description,
    price: input.price,
    image_url: input.imageUrl,
    category_id: input.categoryId,
  });

  return mapProduct(row as Record<string, unknown>);
}

export async function updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
  const existing = await repo.getProductByIdAdmin(id);
  if (!existing) throw new AppError(404, 'Not Found', 'Product not found');

  if (input.categoryId) {
    const exists = await repo.categoryExists(input.categoryId);
    if (!exists) throw new AppError(404, 'Not Found', 'Category not found');
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.name !== undefined) updates.name = input.name;
  if (input.description !== undefined) updates.description = input.description;
  if (input.price !== undefined) updates.price = input.price;
  if (input.imageUrl !== undefined) updates.image_url = input.imageUrl;
  if (input.categoryId !== undefined) updates.category_id = input.categoryId;
  if (input.isActive !== undefined) updates.is_active = input.isActive;

  const row = await repo.updateProduct(id, updates as Parameters<typeof repo.updateProduct>[1]);
  return mapProduct(row as Record<string, unknown>);
}

export async function softDeleteProduct(id: string): Promise<void> {
  const existing = await repo.getProductByIdAdmin(id);
  if (!existing) throw new AppError(404, 'Not Found', 'Product not found');
  await repo.softDeleteProduct(id);
}
```

- [ ] **Step 6: Create src/modules/products/products.controller.ts**

```typescript
import { FastifyRequest, FastifyReply } from 'fastify';
import { validateBody, validateQuery, validateParams } from '../../utils/zod.js';
import { listResponse, singleResponse, messageResponse } from '../../utils/response.js';
import {
  productQuerySchema,
  productParamsSchema,
  createProductSchema,
  updateProductSchema,
} from './products.schemas.js';
import * as productsService from './products.service.js';

export async function listProducts(request: FastifyRequest, reply: FastifyReply) {
  const query = validateQuery(productQuerySchema, request.query);
  const result = await productsService.listProducts(query);
  return reply.status(200).send(listResponse(result.data, result.meta));
}

export async function getProduct(request: FastifyRequest, reply: FastifyReply) {
  const { id } = validateParams(productParamsSchema, request.params);
  const product = await productsService.getProduct(id);
  return reply.status(200).send(singleResponse(product));
}

export async function createProduct(request: FastifyRequest, reply: FastifyReply) {
  const body = validateBody(createProductSchema, request.body);
  const product = await productsService.createProduct(body);
  return reply.status(201).send(singleResponse(product));
}

export async function updateProduct(request: FastifyRequest, reply: FastifyReply) {
  const { id } = validateParams(productParamsSchema, request.params);
  const body = validateBody(updateProductSchema, request.body);
  const product = await productsService.updateProduct(id, body);
  return reply.status(200).send(singleResponse(product));
}

export async function deleteProduct(request: FastifyRequest, reply: FastifyReply) {
  const { id } = validateParams(productParamsSchema, request.params);
  await productsService.softDeleteProduct(id);
  return reply.status(200).send(messageResponse('Product deactivated successfully'));
}
```

- [ ] **Step 7: Create src/modules/products/products.routes.ts**

```typescript
import { FastifyInstance } from 'fastify';
import { requireAuth } from '../../middlewares/require-auth.js';
import { requireAdmin } from '../../middlewares/require-admin.js';
import * as productsController from './products.controller.js';

export async function productsRoutes(app: FastifyInstance): Promise<void> {
  app.get('/', {
    schema: { tags: ['Products'], summary: 'List active products (search, category, pagination)' },
  }, productsController.listProducts);

  app.get('/:id', {
    schema: { tags: ['Products'], summary: 'Get a single active product by ID' },
  }, productsController.getProduct);

  app.post('/', {
    schema: {
      tags: ['Products'],
      summary: 'Create a product (admin)',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [requireAuth, requireAdmin],
  }, productsController.createProduct);

  app.patch('/:id', {
    schema: {
      tags: ['Products'],
      summary: 'Update a product (admin)',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [requireAuth, requireAdmin],
  }, productsController.updateProduct);

  app.delete('/:id', {
    schema: {
      tags: ['Products'],
      summary: 'Soft-delete a product (admin) — sets is_active = false',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [requireAuth, requireAdmin],
  }, productsController.deleteProduct);
}
```

- [ ] **Step 8: Register in src/app.ts**

Add import:
```typescript
import { productsRoutes } from './modules/products/products.routes.js';
```

Add register:
```typescript
app.register(productsRoutes, { prefix: '/products' });
```

- [ ] **Step 9: Compile check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 10: Start and test products**

```bash
npm run dev
```

```bash
# List products (public)
curl -s "http://localhost:8080/products?page=1&limit=5" | jq .meta

# Get nonexistent product — expect 404
curl -s "http://localhost:8080/products/00000000-0000-0000-0000-000000000000" | jq .
```

Stop dev server.

- [ ] **Step 11: Commit**

```bash
git add backend/src/modules/products/
git commit -m "feat: products module — list/get/create/update/soft-delete, admin protected"
```

---

## Task 13: Orders Module

**Files:**
- Create: `src/modules/orders/orders.types.ts`
- Create: `src/modules/orders/orders.schemas.ts`
- Create: `src/modules/orders/orders.repository.ts`
- Create: `src/modules/orders/orders.service.ts`
- Create: `src/modules/orders/orders.controller.ts`
- Create: `src/modules/orders/orders.routes.ts`

- [ ] **Step 1: Create module directory**

```bash
mkdir -p src/modules/orders
```

- [ ] **Step 2: Create src/modules/orders/orders.types.ts**

```typescript
import type { OrderStatus } from '../../types/common.js';

export interface OrderItem {
  id: string;
  productId: string | null;
  productName: string | null;
  productImageUrl: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderUser {
  id: string;
  name: string;
  email: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  user?: OrderUser;
  items: OrderItem[];
}

export interface CreateOrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderInput {
  items: CreateOrderItemInput[];
}
```

- [ ] **Step 3: Create src/modules/orders/orders.schemas.ts**

```typescript
import { z } from 'zod';

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid('productId must be a valid UUID'),
        quantity: z.number().int().min(1, 'Quantity must be at least 1'),
      }),
    )
    .min(1, 'Order must contain at least one item'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['Pending', 'Processing', 'Completed', 'Cancelled']),
});

export const orderQuerySchema = z.object({
  status: z.enum(['Pending', 'Processing', 'Completed', 'Cancelled']).optional(),
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? Math.min(parseInt(v, 10), 100) : 10)),
});

export const orderParamsSchema = z.object({
  id: z.string().uuid('Order ID must be a valid UUID'),
});

export const myOrderQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? Math.min(parseInt(v, 10), 100) : 10)),
});
```

- [ ] **Step 4: Create src/modules/orders/orders.repository.ts**

```typescript
import { supabaseAdmin } from '../../config/supabase.js';

const ORDER_SELECT = `
  id, status, total_amount, created_at, user_id,
  order_items(
    id, quantity, unit_price, product_id,
    products(id, name, image_url)
  )
`.trim();

export async function insertOrder(userId: string, totalAmount: number) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .insert({ user_id: userId, status: 'Pending', total_amount: totalAmount })
    .select('id')
    .single();

  if (error || !data) throw error ?? new Error('Failed to create order');
  return data.id as string;
}

export async function insertOrderItems(
  items: { order_id: string; product_id: string; quantity: number; unit_price: number }[],
) {
  const { error } = await supabaseAdmin.from('order_items').insert(items);
  if (error) throw error;
}

export async function getOrderById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select(ORDER_SELECT)
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function listMyOrders(userId: string, from: number, to: number) {
  const { data, error, count } = await supabaseAdmin
    .from('orders')
    .select(ORDER_SELECT, { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { data: data ?? [], count: count ?? 0 };
}

export async function listAllOrders(opts: {
  status?: string;
  from: number;
  to: number;
}) {
  let query = supabaseAdmin
    .from('orders')
    .select(ORDER_SELECT, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(opts.from, opts.to);

  if (opts.status) query = query.eq('status', opts.status);

  const { data: orders, error, count } = await query;
  if (error) throw error;

  const userIds = [...new Set((orders ?? []).map((o) => o.user_id as string))];
  let profileMap = new Map<string, { id: string; name: string; email: string }>();

  if (userIds.length > 0) {
    const { data: profiles } = await supabaseAdmin
      .from('profiles')
      .select('id, name, email')
      .in('id', userIds);

    profileMap = new Map(
      (profiles ?? []).map((p) => [
        p.id as string,
        { id: p.id as string, name: p.name as string, email: p.email as string },
      ]),
    );
  }

  return {
    data: (orders ?? []).map((order) => ({
      ...order,
      profile: profileMap.get(order.user_id as string) ?? null,
    })),
    count: count ?? 0,
  };
}

export async function updateOrderStatus(id: string, status: string) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(ORDER_SELECT)
    .single();

  if (error || !data) throw error ?? new Error('Failed to update order');
  return data;
}
```

- [ ] **Step 5: Create src/modules/orders/orders.service.ts**

```typescript
import { supabaseAdmin } from '../../config/supabase.js';
import { AppError } from '../../utils/app-error.js';
import { getPaginationRange, buildMeta } from '../../utils/pagination.js';
import * as repo from './orders.repository.js';
import type { Order, OrderItem, CreateOrderInput } from './orders.types.js';
import type { OrderStatus } from '../../types/common.js';

function mapItem(item: Record<string, unknown>): OrderItem {
  const product = item.products as Record<string, unknown> | null;
  return {
    id: item.id as string,
    productId: (item.product_id as string | null) ?? null,
    productName: (product?.name as string | null) ?? null,
    productImageUrl: (product?.image_url as string | null) ?? null,
    quantity: item.quantity as number,
    unitPrice: Number(item.unit_price),
    lineTotal: Number(item.unit_price) * (item.quantity as number),
  };
}

function mapOrder(row: Record<string, unknown>, profile?: { id: string; name: string; email: string } | null): Order {
  const items = (row.order_items as Record<string, unknown>[] | null) ?? [];
  return {
    id: row.id as string,
    status: row.status as OrderStatus,
    totalAmount: Number(row.total_amount),
    createdAt: row.created_at as string,
    ...(profile ? { user: profile } : {}),
    items: items.map(mapItem),
  };
}

export async function createOrder(userId: string, input: CreateOrderInput): Promise<Order> {
  const productIds = input.items.map((i) => i.productId);

  // Fetch products — use DB prices, never trust client
  const { data: products, error } = await supabaseAdmin
    .from('products')
    .select('id, name, price, is_active')
    .in('id', productIds);

  if (error) throw error;

  if (!products || products.length !== productIds.length) {
    const foundIds = new Set((products ?? []).map((p) => p.id as string));
    const missing = productIds.filter((id) => !foundIds.has(id));
    throw new AppError(400, 'Bad Request', `Products not found: ${missing.join(', ')}`);
  }

  const inactive = products.filter((p) => !p.is_active);
  if (inactive.length > 0) {
    throw new AppError(
      400,
      'Bad Request',
      `Products not available: ${inactive.map((p) => p.name as string).join(', ')}`,
    );
  }

  const productMap = new Map(products.map((p) => [p.id as string, p]));

  const totalAmount = input.items.reduce((sum, item) => {
    const product = productMap.get(item.productId)!;
    return sum + Number(product.price) * item.quantity;
  }, 0);

  const orderId = await repo.insertOrder(userId, totalAmount);

  await repo.insertOrderItems(
    input.items.map((item) => ({
      order_id: orderId,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: Number(productMap.get(item.productId)!.price),
    })),
  );

  const row = await repo.getOrderById(orderId);
  if (!row) throw new AppError(500, 'Internal Server Error', 'Failed to fetch created order');
  return mapOrder(row as Record<string, unknown>);
}

export async function getMyOrders(userId: string, page: number, limit: number) {
  const { from, to } = getPaginationRange(page, limit);
  const { data, count } = await repo.listMyOrders(userId, from, to);
  return {
    data: data.map((row) => mapOrder(row as Record<string, unknown>)),
    meta: buildMeta(page, limit, count),
  };
}

export async function getAllOrders(opts: { status?: string; page: number; limit: number }) {
  const { from, to } = getPaginationRange(opts.page, opts.limit);
  const { data, count } = await repo.listAllOrders({ status: opts.status, from, to });
  return {
    data: data.map((row) =>
      mapOrder(row as Record<string, unknown>, (row.profile as { id: string; name: string; email: string } | null) ?? undefined),
    ),
    meta: buildMeta(opts.page, opts.limit, count),
  };
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  const existing = await repo.getOrderById(id);
  if (!existing) throw new AppError(404, 'Not Found', 'Order not found');

  const row = await repo.updateOrderStatus(id, status);
  return mapOrder(row as Record<string, unknown>);
}
```

- [ ] **Step 6: Create src/modules/orders/orders.controller.ts**

```typescript
import { FastifyRequest, FastifyReply } from 'fastify';
import { validateBody, validateQuery, validateParams } from '../../utils/zod.js';
import { listResponse, singleResponse } from '../../utils/response.js';
import {
  createOrderSchema,
  updateOrderStatusSchema,
  orderQuerySchema,
  orderParamsSchema,
  myOrderQuerySchema,
} from './orders.schemas.js';
import * as ordersService from './orders.service.js';
import type { OrderStatus } from '../../types/common.js';

export async function createOrder(request: FastifyRequest, reply: FastifyReply) {
  const body = validateBody(createOrderSchema, request.body);
  const order = await ordersService.createOrder(request.user.id, body);
  return reply.status(201).send(singleResponse(order));
}

export async function getMyOrders(request: FastifyRequest, reply: FastifyReply) {
  const query = validateQuery(myOrderQuerySchema, request.query);
  const result = await ordersService.getMyOrders(request.user.id, query.page, query.limit);
  return reply.status(200).send(listResponse(result.data, result.meta));
}

export async function getAllOrders(request: FastifyRequest, reply: FastifyReply) {
  const query = validateQuery(orderQuerySchema, request.query);
  const result = await ordersService.getAllOrders(query);
  return reply.status(200).send(listResponse(result.data, result.meta));
}

export async function updateOrderStatus(request: FastifyRequest, reply: FastifyReply) {
  const { id } = validateParams(orderParamsSchema, request.params);
  const body = validateBody(updateOrderStatusSchema, request.body);
  const order = await ordersService.updateOrderStatus(id, body.status as OrderStatus);
  return reply.status(200).send(singleResponse(order));
}
```

- [ ] **Step 7: Create src/modules/orders/orders.routes.ts**

```typescript
import { FastifyInstance } from 'fastify';
import { requireAuth } from '../../middlewares/require-auth.js';
import { requireAdmin } from '../../middlewares/require-admin.js';
import * as ordersController from './orders.controller.js';

export async function ordersRoutes(app: FastifyInstance): Promise<void> {
  // POST /orders — authenticated
  app.post('/', {
    schema: {
      tags: ['Orders'],
      summary: 'Place a new order (server-side pricing)',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [requireAuth],
  }, ordersController.createOrder);

  // GET /orders/my — authenticated
  app.get('/my', {
    schema: {
      tags: ['Orders'],
      summary: "Get current user's order history",
      security: [{ bearerAuth: [] }],
    },
    preHandler: [requireAuth],
  }, ordersController.getMyOrders);

  // GET /orders — admin
  app.get('/', {
    schema: {
      tags: ['Orders'],
      summary: 'List all orders with user info (admin)',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [requireAuth, requireAdmin],
  }, ordersController.getAllOrders);

  // PATCH /orders/:id/status — admin
  app.patch('/:id/status', {
    schema: {
      tags: ['Orders'],
      summary: 'Update order status (admin)',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [requireAuth, requireAdmin],
  }, ordersController.updateOrderStatus);
}
```

- [ ] **Step 8: Register in src/app.ts**

Add import:
```typescript
import { ordersRoutes } from './modules/orders/orders.routes.js';
```

Add register:
```typescript
app.register(ordersRoutes, { prefix: '/orders' });
```

- [ ] **Step 9: Compile check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 10: Commit**

```bash
git add backend/src/modules/orders/
git commit -m "feat: orders module — create order (server-side pricing), my-orders, admin list, update status"
```

---

## Task 14: Uploads Module

**Files:**
- Create: `src/modules/uploads/uploads.types.ts` (not needed — response is simple)
- Create: `src/modules/uploads/uploads.schemas.ts`
- Create: `src/modules/uploads/uploads.service.ts`
- Create: `src/modules/uploads/uploads.controller.ts`
- Create: `src/modules/uploads/uploads.routes.ts`

- [ ] **Step 1: Create module directory**

```bash
mkdir -p src/modules/uploads
```

- [ ] **Step 2: Create src/modules/uploads/uploads.schemas.ts**

```typescript
// Multipart validation is handled in the controller.
// Allowed mime types and max size are defined here for easy adjustment.
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];
```

- [ ] **Step 3: Create src/modules/uploads/uploads.service.ts**

```typescript
import { supabaseAdmin } from '../../config/supabase.js';
import { env } from '../../config/env.js';
import { AppError } from '../../utils/app-error.js';

export async function uploadProductImage(
  buffer: Buffer,
  mimeType: string,
): Promise<string> {
  const ext = mimeType.split('/')[1] === 'jpeg' ? 'jpg' : mimeType.split('/')[1];
  const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .upload(filename, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    throw new AppError(500, 'Internal Server Error', `Failed to upload image: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from(env.SUPABASE_STORAGE_BUCKET).getPublicUrl(filename);

  return publicUrl;
}
```

- [ ] **Step 4: Create src/modules/uploads/uploads.controller.ts**

```typescript
import { FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from '../../utils/app-error.js';
import { singleResponse } from '../../utils/response.js';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from './uploads.schemas.js';
import { uploadProductImage } from './uploads.service.js';

export async function uploadImage(request: FastifyRequest, reply: FastifyReply) {
  const part = await request.file();

  if (!part) {
    throw new AppError(400, 'Bad Request', 'No file uploaded');
  }

  if (!(ALLOWED_MIME_TYPES as readonly string[]).includes(part.mimetype)) {
    throw new AppError(
      400,
      'Bad Request',
      `File type not allowed. Accepted: ${ALLOWED_MIME_TYPES.join(', ')}`,
    );
  }

  const buffer = await part.toBuffer();

  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    throw new AppError(400, 'Bad Request', 'File size exceeds 5 MB limit');
  }

  const imageUrl = await uploadProductImage(buffer, part.mimetype);

  return reply.status(200).send(singleResponse({ imageUrl }));
}
```

- [ ] **Step 5: Create src/modules/uploads/uploads.routes.ts**

```typescript
import { FastifyInstance } from 'fastify';
import { requireAuth } from '../../middlewares/require-auth.js';
import { requireAdmin } from '../../middlewares/require-admin.js';
import { uploadImage } from './uploads.controller.js';

export async function uploadsRoutes(app: FastifyInstance): Promise<void> {
  app.post('/product-image', {
    schema: {
      tags: ['Uploads'],
      summary: 'Upload a product image to Supabase Storage (admin)',
      security: [{ bearerAuth: [] }],
      consumes: ['multipart/form-data'],
    },
    preHandler: [requireAuth, requireAdmin],
  }, uploadImage);
}
```

- [ ] **Step 6: Register in src/app.ts**

Add import:
```typescript
import { uploadsRoutes } from './modules/uploads/uploads.routes.js';
```

Add register:
```typescript
app.register(uploadsRoutes, { prefix: '/uploads' });
```

- [ ] **Step 7: Compile check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 8: Start server and test upload (requires admin token from seed)**

After running the seed in Task 15, come back here and test:

```bash
# Get admin token
ADMIN_TOKEN=$(curl -s -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Password123!"}' | jq -r '.data.accessToken')

# Upload a test image (create a small jpeg first)
curl -s -X POST http://localhost:8080/uploads/product-image \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -F "file=@/path/to/any-image.jpg" | jq .
```

Expected:
```json
{ "data": { "imageUrl": "https://...supabase.co/storage/v1/object/public/products/products/..." } }
```

- [ ] **Step 9: Commit**

```bash
git add backend/src/modules/uploads/
git commit -m "feat: uploads module — POST /uploads/product-image, admin-only, Supabase Storage"
```

---

## Task 15: Seed Script

**Files:**
- Create: `src/database/seed.ts`

- [ ] **Step 1: Create src/database/seed.ts**

```typescript
import 'dotenv/config';
import { supabaseAdmin, supabaseAnon } from '../config/supabase.js';
import { env } from '../config/env.js';

// ─── Storage Bucket ───────────────────────────────────────────────────────────

async function ensureBucket() {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === env.SUPABASE_STORAGE_BUCKET);
  if (!exists) {
    const { error } = await supabaseAdmin.storage.createBucket(
      env.SUPABASE_STORAGE_BUCKET,
      { public: true },
    );
    if (error) throw new Error(`Failed to create bucket: ${error.message}`);
    console.log(`✅ Created storage bucket: ${env.SUPABASE_STORAGE_BUCKET}`);
  } else {
    console.log(`ℹ️  Storage bucket already exists: ${env.SUPABASE_STORAGE_BUCKET}`);
  }
}

// ─── Categories ───────────────────────────────────────────────────────────────

async function seedCategories() {
  const categories = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Home', slug: 'home' },
  ];

  const { error } = await supabaseAdmin
    .from('categories')
    .upsert(categories, { onConflict: 'slug' });

  if (error) throw new Error(`Failed to seed categories: ${error.message}`);
  console.log('✅ Categories seeded');
}

// ─── Products ─────────────────────────────────────────────────────────────────

async function seedProducts() {
  const { data: cats } = await supabaseAdmin
    .from('categories')
    .select('id, slug');

  const catMap = new Map((cats ?? []).map((c) => [c.slug as string, c.id as string]));

  const products = [
    {
      name: 'Wireless Headphones',
      description: 'Premium over-ear headphones with active noise cancellation and 30-hour battery life.',
      price: 79.99,
      image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      category_id: catMap.get('electronics'),
      is_active: true,
    },
    {
      name: 'Smart Watch',
      description: 'Feature-packed smartwatch with heart rate monitor, GPS, and 7-day battery.',
      price: 129.99,
      image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      category_id: catMap.get('electronics'),
      is_active: true,
    },
    {
      name: 'Bluetooth Speaker',
      description: 'Portable waterproof speaker with 360° sound and 12-hour playtime.',
      price: 49.99,
      image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
      category_id: catMap.get('electronics'),
      is_active: true,
    },
    {
      name: 'Cotton T-Shirt',
      description: 'Classic fit 100% organic cotton t-shirt, available in multiple colors.',
      price: 19.99,
      image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      category_id: catMap.get('fashion'),
      is_active: true,
    },
    {
      name: 'Running Shoes',
      description: 'Lightweight mesh running shoes with responsive cushioning sole.',
      price: 89.99,
      image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      category_id: catMap.get('fashion'),
      is_active: true,
    },
    {
      name: 'Backpack',
      description: '28L waterproof backpack with laptop compartment and USB charging port.',
      price: 59.99,
      image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      category_id: catMap.get('fashion'),
      is_active: true,
    },
    {
      name: 'Coffee Mug',
      description: 'Double-wall insulated 350ml ceramic mug, keeps drinks hot for 6 hours.',
      price: 14.99,
      image_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400',
      category_id: catMap.get('home'),
      is_active: true,
    },
    {
      name: 'Desk Lamp',
      description: 'LED desk lamp with 5 brightness levels, USB charging port, and touch control.',
      price: 34.99,
      image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
      category_id: catMap.get('home'),
      is_active: true,
    },
    {
      name: 'Notebook Set',
      description: 'Set of 3 A5 dotted notebooks with 160 pages each, lay-flat binding.',
      price: 22.99,
      image_url: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400',
      category_id: catMap.get('home'),
      is_active: true,
    },
    {
      name: 'Water Bottle',
      description: '750ml stainless steel insulated water bottle, keeps cold 24h / hot 12h.',
      price: 27.99,
      image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
      category_id: catMap.get('home'),
      is_active: true,
    },
  ];

  // Idempotent: skip products that already exist by name
  const { data: existing } = await supabaseAdmin.from('products').select('name');
  const existingNames = new Set((existing ?? []).map((p) => p.name as string));
  const toInsert = products.filter((p) => !existingNames.has(p.name));

  if (toInsert.length > 0) {
    const { error } = await supabaseAdmin.from('products').insert(toInsert);
    if (error) throw new Error(`Failed to seed products: ${error.message}`);
    console.log(`✅ Inserted ${toInsert.length} products`);
  } else {
    console.log('ℹ️  All products already exist, skipping');
  }
}

// ─── Users ────────────────────────────────────────────────────────────────────

async function seedUser(opts: {
  email: string;
  password: string;
  name: string;
  role: 'customer' | 'admin';
}) {
  // Try to sign in — if it works, the user already exists
  const { data: signInData } = await supabaseAnon.auth.signInWithPassword({
    email: opts.email,
    password: opts.password,
  });

  let userId: string;

  if (signInData?.user) {
    userId = signInData.user.id;
    console.log(`ℹ️  User already exists: ${opts.email}`);
  } else {
    // Create the user
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: opts.email,
      password: opts.password,
      email_confirm: true,
      user_metadata: { name: opts.name },
    });

    if (error) throw new Error(`Failed to create user ${opts.email}: ${error.message}`);
    userId = data.user!.id;
    console.log(`✅ Created user: ${opts.email}`);
  }

  // Upsert profile (ensures role is correct even if user already existed)
  const { error: profileError } = await supabaseAdmin.from('profiles').upsert(
    { id: userId, email: opts.email, name: opts.name, role: opts.role },
    { onConflict: 'id' },
  );

  if (profileError) {
    throw new Error(`Failed to upsert profile for ${opts.email}: ${profileError.message}`);
  }

  console.log(`✅ Profile upserted: ${opts.email} (role: ${opts.role})`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Starting seed...\n');

  try {
    await ensureBucket();
    await seedCategories();
    await seedProducts();

    await seedUser({
      email: 'customer@test.com',
      password: 'Password123!',
      name: 'Test Customer',
      role: 'customer',
    });

    await seedUser({
      email: 'admin@test.com',
      password: 'Password123!',
      name: 'Test Admin',
      role: 'admin',
    });

    console.log('\n✅ Seed complete!');
    console.log('\n📋 Test credentials:');
    console.log('  Customer: customer@test.com / Password123!');
    console.log('  Admin:    admin@test.com    / Password123!');
  } catch (err) {
    console.error('\n❌ Seed failed:', err);
    process.exit(1);
  }
}

main();
```

- [ ] **Step 2: Run the seed**

```bash
npm run seed
```

Expected output:
```
🌱 Starting seed...

✅ Created storage bucket: products   (or ℹ️  already exists)
✅ Categories seeded
✅ Inserted 10 products              (or ℹ️  already exist)
✅ Created user: customer@test.com
✅ Profile upserted: customer@test.com (role: customer)
✅ Created user: admin@test.com
✅ Profile upserted: admin@test.com (role: admin)

✅ Seed complete!
```

If you see an error about the profiles table not existing, ensure you ran schema.sql (Task 9 manual step) first.

- [ ] **Step 3: Verify seed in Supabase**

In the Supabase Table Editor:
- `categories`: 3 rows (Electronics, Fashion, Home)
- `products`: 10 rows, all `is_active = true`
- `profiles`: 2 rows — customer and admin

- [ ] **Step 4: Run a full end-to-end test**

```bash
npm run dev
```

```bash
# List categories
curl -s http://localhost:8080/categories | jq '.data | length'
# Expected: 3

# List products
curl -s "http://localhost:8080/products" | jq '.meta'
# Expected: { page:1, limit:10, total:10, totalPages:1 }

# Search products
curl -s "http://localhost:8080/products?search=watch" | jq '.data[0].name'
# Expected: "Smart Watch"

# Filter by category
curl -s "http://localhost:8080/products?category=electronics" | jq '.meta.total'
# Expected: 3

# Login as customer
CUSTOMER_TOKEN=$(curl -s -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@test.com","password":"Password123!"}' | jq -r '.data.accessToken')

# Place an order (get product IDs first)
PRODUCT_ID=$(curl -s "http://localhost:8080/products" | jq -r '.data[0].id')
curl -s -X POST http://localhost:8080/orders \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"items\":[{\"productId\":\"$PRODUCT_ID\",\"quantity\":2}]}" | jq .

# Get my orders
curl -s http://localhost:8080/orders/my \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" | jq '.meta'

# Admin: list all orders
ADMIN_TOKEN=$(curl -s -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Password123!"}' | jq -r '.data.accessToken')

curl -s http://localhost:8080/orders \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.data[0].user.email'
# Expected: "customer@test.com"
```

Stop dev server.

- [ ] **Step 5: Commit**

```bash
git add backend/src/database/seed.ts
git commit -m "feat: seed script — 3 categories, 10 products, customer + admin accounts, storage bucket"
```

---

## Task 16: Build Verification

- [ ] **Step 1: Run TypeScript compile**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Expected: `dist/server.js` created, no errors.

- [ ] **Step 3: Verify build starts**

```bash
node dist/server.js
```

Expected: server starts on port 8080.

```bash
curl http://localhost:8080/health
```

Expected: `{"status":"ok"}`

Stop the server.

- [ ] **Step 4: Fix any build/startup errors before continuing**

Common issues:
- ESM import paths missing `.js` — add `.js` to all relative imports in `src/`
- `tsup` output format mismatch — verify `package.json` `"type": "module"` and `--format esm`

- [ ] **Step 5: Commit**

```bash
git add backend/dist/ backend/
git commit -m "chore: verify production build passes — npm run build + node dist/server.js"
```

---

## Task 17: README

**Files:**
- Create: `README.md` (in `/backend`)

- [ ] **Step 1: Create backend/README.md**

```markdown
# Mini Shop Backend

REST API for the Mini Shop full-stack challenge. Serves an Expo React Native mobile app and a React Vite admin dashboard.

## Tech Stack

- **Runtime:** Node.js 22, ESM
- **Framework:** Fastify 5
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (JWT)
- **Storage:** Supabase Storage
- **Validation:** Zod
- **Build:** tsup, tsx

## Folder Structure

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

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` / `production` |
| `PORT` | Server port (default `8080`) |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (backend only — never expose) |
| `SUPABASE_STORAGE_BUCKET` | Storage bucket name (default `products`) |
| `CORS_ORIGIN` | Allowed CORS origin (default `http://localhost:5173`) |
| `PASSWORD_RESET_REDIRECT_URL` | Where Supabase redirects after password reset |

## Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy your Project URL, anon key, and service role key into `.env`

### Database Setup

Run `src/database/schema.sql` in the **Supabase SQL Editor**:
- Creates: `profiles`, `categories`, `products`, `orders`, `order_items` tables
- Adds indexes for performance

### RLS Setup

Run `src/database/rls.sql` in the **Supabase SQL Editor**:
- Enables Row Level Security on all 5 tables
- Creates `is_admin()` helper function
- Applies role-based read/write policies

> Note: the backend uses the service role key which bypasses RLS. The RLS policies protect against direct client access.

### Storage Bucket Setup

Handled automatically by `npm run seed` — creates a public `products` bucket.

Alternatively, in Supabase Dashboard → Storage → New bucket → name: `products`, public: ✅

## Installation

```bash
npm install
cp .env.example .env
# Fill in .env with your Supabase credentials
```

## Development

```bash
npm run dev
```

Server starts at `http://localhost:8080`

Swagger docs at `http://localhost:8080/docs`

## Seed

After running `schema.sql` and `rls.sql` in Supabase SQL Editor:

```bash
npm run seed
```

Creates:
- 3 categories (Electronics, Fashion, Home)
- 10 products
- Test customer: `customer@test.com` / `Password123!`
- Test admin: `admin@test.com` / `Password123!`

## Build

```bash
npm run build   # outputs to dist/
npm start       # runs dist/server.js
```

## API Routes

### Auth

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/auth/register` | Public | Register new customer |
| POST | `/auth/login` | Public | Login, receive JWT |
| POST | `/auth/forgot-password` | Public | Trigger reset email |
| GET | `/auth/me` | Auth | Current user profile |

### Categories

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/categories` | Public | All categories |

### Products

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/products` | Public | Active products (search, category, pagination) |
| GET | `/products/:id` | Public | Single product |
| POST | `/products` | Admin | Create product |
| PATCH | `/products/:id` | Admin | Update product |
| DELETE | `/products/:id` | Admin | Soft delete (is_active = false) |

### Orders

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/orders` | Auth | Place order (server-side pricing) |
| GET | `/orders/my` | Auth | Own order history |
| GET | `/orders` | Admin | All orders |
| PATCH | `/orders/:id/status` | Admin | Update status |

### Uploads

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/uploads/product-image` | Admin | Upload image → Storage URL |

### Docs

`GET /docs` — Swagger UI

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Customer | `customer@test.com` | `Password123!` |
| Admin | `admin@test.com` | `Password123!` |

## Technical Decisions

I used a modular Route → Controller → Service → Repository architecture. This keeps HTTP handling, business logic, and database access separated. It makes the backend easier to test, extend, and connect to both the mobile app and admin dashboard.

Validation is handled via Zod in controllers rather than Fastify's native JSON-Schema validation, so there is a single source of truth for input shape. All prices are computed server-side on `POST /orders` — the frontend sends product IDs and quantities only; the backend fetches prices from the database and rejects orders that contain inactive or missing products.

The service role key is backend-only and bypasses Supabase RLS. RLS policies are applied for any direct client access (e.g., a future mobile app using the anon key directly).
```

- [ ] **Step 2: Commit**

```bash
git add backend/README.md
git commit -m "docs: add backend README — setup, env vars, API routes, test credentials"
```

---

## Self-Review Checklist

### Spec Coverage

| Requirement | Task |
|---|---|
| POST /auth/register | Task 10 |
| POST /auth/login | Task 10 |
| POST /auth/forgot-password | Task 10 |
| GET /auth/me | Task 10 |
| GET /categories | Task 11 |
| GET /products (search, category, pagination) | Task 12 |
| GET /products/:id | Task 12 |
| POST /products (admin) | Task 12 |
| PATCH /products/:id (admin) | Task 12 |
| DELETE /products/:id soft delete (admin) | Task 12 |
| POST /orders server-side pricing | Task 13 |
| GET /orders/my | Task 13 |
| GET /orders (admin, paginated) | Task 13 |
| PATCH /orders/:id/status (admin) | Task 13 |
| POST /uploads/product-image (admin) | Task 14 |
| GET /docs Swagger | Task 8 |
| schema.sql | Task 9 |
| rls.sql + is_admin() function | Task 9 |
| Seed (3 cats, 10 products, 2 users) | Task 15 |
| Storage bucket (public, auto-created) | Task 15 |
| Zod on every route | All module tasks |
| Consistent error format | Task 6 |
| camelCase responses | All module tasks |
| ESM + TypeScript | Task 1 |
| .env.example | Task 1 |
| README | Task 17 |
| Build verification | Task 16 |

All requirements covered. ✅
