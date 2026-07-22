-- Pick Multiple bounds on product customisations.
alter table public.product_customisations
  add column if not exists min_select integer
    check (min_select is null or min_select >= 0),
  add column if not exists max_select integer
    check (max_select is null or max_select >= 1);

alter table public.product_customisations
  drop constraint if exists product_customisations_minmax_order;

alter table public.product_customisations
  add constraint product_customisations_minmax_order
  check (
    min_select is null
    or max_select is null
    or min_select <= max_select
  );
