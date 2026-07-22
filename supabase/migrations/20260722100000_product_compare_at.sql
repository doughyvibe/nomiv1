-- Phase 9: optional compare-at (was) price — merchandising only.
-- Does not affect cart totals, inventory, or checkout.

alter table public.products
  add column if not exists compare_at_cents integer;

alter table public.products
  drop constraint if exists products_compare_at_cents_nonneg;

alter table public.products
  add constraint products_compare_at_cents_nonneg
    check (compare_at_cents is null or compare_at_cents >= 0);

comment on column public.products.compare_at_cents is
  'Optional was-price for sale storytelling. Merchandising only; not used in totals.';
