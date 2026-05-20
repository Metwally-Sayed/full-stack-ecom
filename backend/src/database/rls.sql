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
