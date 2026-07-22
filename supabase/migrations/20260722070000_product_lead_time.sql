-- Phase 5: lead_time_days — prep constraint only (no buyer date picker).
-- Fulfilment calendar / checkout dates arrive in Phase 6.

alter table public.products
  add column if not exists lead_time_days integer;

update public.products
set lead_time_days = 0
where lead_time_days is null;

alter table public.products
  alter column lead_time_days set default 0,
  alter column lead_time_days set not null;

alter table public.products
  drop constraint if exists products_lead_time_days_check;

alter table public.products
  add constraint products_lead_time_days_check
  check (lead_time_days >= 0);
