-- Phase 2: opt-in product choices (≤2 options, ≤50 variants).
-- Products without choices have zero rows here (implicit single offer).

create table public.product_options (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  name text not null,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  constraint product_options_name_nonempty check (length(trim(name)) > 0)
);

create table public.product_option_values (
  id uuid primary key default gen_random_uuid(),
  option_id uuid not null references public.product_options (id) on delete cascade,
  name text not null,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  constraint product_option_values_name_nonempty check (length(trim(name)) > 0)
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  -- One value id per option, sorted by option position at write time
  option_value_ids uuid[] not null,
  -- Human label e.g. "Chocolate · 6 inch" (snapshotted onto order_items)
  label text not null,
  -- null → fall back to products.price_cents
  price_cents integer check (price_cents is null or price_cents >= 0),
  created_at timestamptz not null default now(),
  constraint product_variants_label_nonempty check (length(trim(label)) > 0),
  constraint product_variants_value_ids_nonempty check (cardinality(option_value_ids) >= 1)
);

create index product_options_product_id_idx on public.product_options (product_id);
create index product_option_values_option_id_idx on public.product_option_values (option_id);
create index product_variants_product_id_idx on public.product_variants (product_id);

create unique index product_variants_product_value_ids_uidx
  on public.product_variants (product_id, option_value_ids);

-- ---------------------------------------------------------------------------
-- RLS (mirrors products: public read live+published; owner all)
-- ---------------------------------------------------------------------------

alter table public.product_options enable row level security;
alter table public.product_option_values enable row level security;
alter table public.product_variants enable row level security;

-- Helper: product is publicly readable (live on published store)
create or replace function public.product_is_public(p_product_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.products
    join public.stores on stores.id = products.store_id
    where products.id = p_product_id
      and products.status = 'live'
      and stores.status = 'published'
  );
$$;

create or replace function public.product_owned_by_uid(p_product_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.products
    join public.stores on stores.id = products.store_id
    where products.id = p_product_id
      and stores.owner_id = (select auth.uid())
  );
$$;

-- product_options
create policy "product_options_public_read"
  on public.product_options
  for select
  to anon, authenticated
  using (public.product_is_public(product_id));

create policy "product_options_owner_all"
  on public.product_options
  for all
  to authenticated
  using (public.product_owned_by_uid(product_id))
  with check (public.product_owned_by_uid(product_id));

-- product_option_values (via parent option → product)
create policy "product_option_values_public_read"
  on public.product_option_values
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.product_options
      where product_options.id = product_option_values.option_id
        and public.product_is_public(product_options.product_id)
    )
  );

create policy "product_option_values_owner_all"
  on public.product_option_values
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.product_options
      where product_options.id = product_option_values.option_id
        and public.product_owned_by_uid(product_options.product_id)
    )
  )
  with check (
    exists (
      select 1
      from public.product_options
      where product_options.id = product_option_values.option_id
        and public.product_owned_by_uid(product_options.product_id)
    )
  );

-- product_variants
create policy "product_variants_public_read"
  on public.product_variants
  for select
  to anon, authenticated
  using (public.product_is_public(product_id));

create policy "product_variants_owner_all"
  on public.product_variants
  for all
  to authenticated
  using (public.product_owned_by_uid(product_id))
  with check (public.product_owned_by_uid(product_id));
