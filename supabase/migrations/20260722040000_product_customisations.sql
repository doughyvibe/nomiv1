-- Phase 3: typed product customisations (text / select / priced add-ons).
-- Answers are collected at add-to-cart and snapshotted on order_items.

create table public.product_customisations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  label text not null,
  -- text | single_select | yes_no | multi_select
  type text not null,
  required boolean not null default false,
  -- select types: [{"label":"…","price_cents":null|int}, ...]
  choices jsonb not null default '[]'::jsonb,
  -- yes_no add-on fee when answered yes (null = free)
  price_cents integer check (price_cents is null or price_cents >= 0),
  position integer not null default 0,
  created_at timestamptz not null default now(),
  constraint product_customisations_label_nonempty check (length(trim(label)) > 0),
  constraint product_customisations_type_ok check (
    type in ('text', 'single_select', 'yes_no', 'multi_select')
  )
);

create index product_customisations_product_id_idx
  on public.product_customisations (product_id);

alter table public.product_customisations enable row level security;

-- Reuses product_is_public / product_owned_by_uid from variants migration.

create policy "product_customisations_public_read"
  on public.product_customisations
  for select
  to anon, authenticated
  using (public.product_is_public(product_id));

create policy "product_customisations_owner_all"
  on public.product_customisations
  for all
  to authenticated
  using (public.product_owned_by_uid(product_id))
  with check (public.product_owned_by_uid(product_id));
