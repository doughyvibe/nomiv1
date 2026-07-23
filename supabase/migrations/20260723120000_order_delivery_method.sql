-- Snapshot which named delivery option the buyer chose (method enum stays pickup|delivery).
alter table public.orders
  add column if not exists delivery_method_id text,
  add column if not exists delivery_method_label text;

comment on column public.orders.delivery_method_id is
  'Id of stores.fulfillment.delivery_methods entry chosen at checkout; null for pickup or legacy.';
comment on column public.orders.delivery_method_label is
  'Buyer-facing delivery method name snapshot at order time.';
