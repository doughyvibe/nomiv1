-- Nomi schema v1 — stores, products, orders, reserved slugs + RLS
-- Apply via Supabase Dashboard → SQL Editor, or: supabase db push (when CLI linked)

-- ---------------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------------

create type public.store_status as enum (
  'draft',
  'published',
  'unpublished',
  'suspended',
  'deleted'
);

create type public.order_status as enum (
  'payment_pending',
  'seller_verification_requested',
  'seller_confirmed_paid',
  'expired',
  'cancelled',
  'completed'
);

create type public.fulfillment_method as enum ('pickup', 'delivery');

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.stores (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  slug text not null unique,
  status public.store_status not null default 'draft',
  vibe text check (
    vibe is null
    or vibe in ('unicorn', 'outback', 'futuristic', 'industrial')
  ),
  hero jsonb not null default '{}'::jsonb,
  fulfillment jsonb not null default '{}'::jsonb,
  paynow jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores (id) on delete cascade,
  name text not null,
  price_cents integer not null check (price_cents >= 0),
  description text not null default '',
  image_url text,
  category text,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores (id) on delete cascade,
  reference text not null unique,
  status public.order_status not null default 'payment_pending',
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  fulfillment_method public.fulfillment_method not null,
  delivery_address text,
  order_notes text,
  subtotal_cents integer not null check (subtotal_cents >= 0),
  fulfillment_fee_cents integer not null default 0 check (fulfillment_fee_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  payment_expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_name text not null,
  price_cents integer not null check (price_cents >= 0),
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);

create table public.reserved_slugs (
  slug text primary key
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index stores_owner_id_idx on public.stores (owner_id);
create index stores_status_idx on public.stores (status);
create index products_store_id_idx on public.products (store_id);
create index products_store_id_archived_idx on public.products (store_id, archived);
create index orders_store_id_idx on public.orders (store_id);
create index orders_store_id_status_idx on public.orders (store_id, status);
create index order_items_order_id_idx on public.order_items (order_id);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger stores_set_updated_at
  before update on public.stores
  for each row execute function public.set_updated_at();

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Seed reserved slugs (PRD §7)
-- ---------------------------------------------------------------------------

insert into public.reserved_slugs (slug) values
  ('www'),
  ('app'),
  ('admin'),
  ('api'),
  ('help'),
  ('support'),
  ('status'),
  ('docs'),
  ('blog'),
  ('mail'),
  ('email'),
  ('cdn'),
  ('assets'),
  ('static'),
  ('billing'),
  ('dashboard'),
  ('login'),
  ('signup'),
  ('security'),
  ('pricing'),
  ('settings'),
  ('orders'),
  ('products'),
  ('analytics'),
  ('nomi')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.stores enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reserved_slugs enable row level security;

-- stores: public reads published; owners full access to own rows
create policy "stores_public_read_published"
  on public.stores
  for select
  to anon, authenticated
  using (status = 'published');

create policy "stores_owner_select"
  on public.stores
  for select
  to authenticated
  using (owner_id = (select auth.uid()));

create policy "stores_owner_insert"
  on public.stores
  for insert
  to authenticated
  with check (owner_id = (select auth.uid()));

create policy "stores_owner_update"
  on public.stores
  for update
  to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "stores_owner_delete"
  on public.stores
  for delete
  to authenticated
  using (owner_id = (select auth.uid()));

-- products: public reads non-archived from published stores; owners manage own
create policy "products_public_read"
  on public.products
  for select
  to anon, authenticated
  using (
    not archived
    and exists (
      select 1
      from public.stores
      where stores.id = products.store_id
        and stores.status = 'published'
    )
  );

create policy "products_owner_all"
  on public.products
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.stores
      where stores.id = products.store_id
        and stores.owner_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.stores
      where stores.id = products.store_id
        and stores.owner_id = (select auth.uid())
    )
  );

-- orders: no public policies — inserts via service role in server routes (Phase 4)
create policy "orders_owner_select"
  on public.orders
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.stores
      where stores.id = orders.store_id
        and stores.owner_id = (select auth.uid())
    )
  );

create policy "orders_owner_update"
  on public.orders
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.stores
      where stores.id = orders.store_id
        and stores.owner_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.stores
      where stores.id = orders.store_id
        and stores.owner_id = (select auth.uid())
    )
  );

-- order_items: owners read items for their store's orders
create policy "order_items_owner_select"
  on public.order_items
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.orders
      join public.stores on stores.id = orders.store_id
      where orders.id = order_items.order_id
        and stores.owner_id = (select auth.uid())
    )
  );

-- reserved_slugs: public read for slug validation
create policy "reserved_slugs_public_read"
  on public.reserved_slugs
  for select
  to anon, authenticated
  using (true);
