-- Epicurean vibe rename + storefront seller fields

alter table public.stores drop constraint if exists stores_vibe_check;

update public.stores set vibe = 'epicurean' where vibe = 'industrial';

alter table public.stores
  add column if not exists featured_product_id uuid references public.products (id) on delete set null,
  add column if not exists trade_hint text check (
    trade_hint is null
    or trade_hint in ('general', 'food', 'handmade', 'services', 'plants')
  );

alter table public.stores add constraint stores_vibe_check check (
  vibe is null
  or vibe in ('unicorn', 'outback', 'futuristic', 'epicurean')
);
