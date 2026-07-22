-- Phase 3: snapshot customisation answers on order lines (immutable JSON).

alter table public.order_items
  add column if not exists customisations_snapshot jsonb;
