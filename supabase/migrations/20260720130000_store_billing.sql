-- Billing metadata on stores (Stripe subscription sync). Visibility still uses status.

alter table public.stores
  add column if not exists stripe_customer_id text,
  add column if not exists subscription_id text,
  add column if not exists subscription_status text,
  add column if not exists subscription_plan text,
  add column if not exists subscription_period_end timestamptz;

create index if not exists stores_stripe_customer_id_idx
  on public.stores (stripe_customer_id)
  where stripe_customer_id is not null;

create index if not exists stores_subscription_id_idx
  on public.stores (subscription_id)
  where subscription_id is not null;
