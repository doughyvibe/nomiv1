-- Phase 6: snapshot buyer-chosen fulfilment date on the order (date-only).
-- Windows / slots arrive in Phase 7.

alter table public.orders
  add column if not exists fulfillment_date date;

comment on column public.orders.fulfillment_date is
  'Buyer-chosen handoff date (YYYY-MM-DD). Null when date collection was not required.';
