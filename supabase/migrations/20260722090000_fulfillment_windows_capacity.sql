-- Phase 7: fulfilment windows snapshot + soft-hold capacity counters.
-- Inventory still decrements only on seller_confirmed_paid (§8 #5).
-- Capacity soft-holds at order create; released on cancel or payment expiry reconcile.

alter table public.orders
  add column if not exists fulfillment_window_id text,
  add column if not exists fulfillment_window_label text,
  add column if not exists capacity_held_daily boolean not null default false,
  add column if not exists capacity_held_window boolean not null default false;

comment on column public.orders.fulfillment_window_id is
  'Buyer-chosen window id snapshot (Phase 7). Null when date-only.';
comment on column public.orders.fulfillment_window_label is
  'Buyer-facing window label snapshot at order time.';

-- ---------------------------------------------------------------------------
-- Soft-hold counters (daily bucket = window_id ''; per-window otherwise)
-- ---------------------------------------------------------------------------

create table if not exists public.fulfillment_capacity_holds (
  store_id uuid not null references public.stores (id) on delete cascade,
  fulfillment_date date not null,
  window_id text not null default '',
  held_count integer not null default 0,
  primary key (store_id, fulfillment_date, window_id),
  constraint fulfillment_capacity_holds_count_nonneg check (held_count >= 0)
);

create index if not exists fulfillment_capacity_holds_store_date_idx
  on public.fulfillment_capacity_holds (store_id, fulfillment_date);

alter table public.fulfillment_capacity_holds enable row level security;

-- Sellers can read their own holds (dashboard messaging); writes via RPC only.
drop policy if exists fulfillment_capacity_holds_select_own
  on public.fulfillment_capacity_holds;
create policy fulfillment_capacity_holds_select_own
  on public.fulfillment_capacity_holds
  for select
  using (
    exists (
      select 1 from public.stores s
      where s.id = store_id
        and s.owner_id = auth.uid()
        and s.status <> 'deleted'
    )
  );

-- ---------------------------------------------------------------------------
-- Reconcile: release holds for payment-expired orders still marked held
-- ---------------------------------------------------------------------------

create or replace function public.reconcile_expired_capacity_holds(
  p_store_id uuid,
  p_date date
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
begin
  for r in
    select id, fulfillment_window_id, capacity_held_daily, capacity_held_window
    from public.orders
    where store_id = p_store_id
      and fulfillment_date = p_date
      and status = 'payment_pending'
      and payment_expires_at < now()
      and (capacity_held_daily or capacity_held_window)
    for update
  loop
    if r.capacity_held_daily then
      update public.fulfillment_capacity_holds
      set held_count = greatest(0, held_count - 1)
      where store_id = p_store_id
        and fulfillment_date = p_date
        and window_id = '';
    end if;
    if r.capacity_held_window and coalesce(r.fulfillment_window_id, '') <> '' then
      update public.fulfillment_capacity_holds
      set held_count = greatest(0, held_count - 1)
      where store_id = p_store_id
        and fulfillment_date = p_date
        and window_id = r.fulfillment_window_id;
    end if;
    update public.orders
    set capacity_held_daily = false,
        capacity_held_window = false
    where id = r.id;
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- Atomic soft-hold
-- ---------------------------------------------------------------------------

create or replace function public.hold_fulfillment_capacity(
  p_store_id uuid,
  p_date date,
  p_window_id text,
  p_daily_cap integer,
  p_window_cap integer
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_window text := coalesce(p_window_id, '');
  held_daily boolean := false;
  held_window boolean := false;
  updated integer;
begin
  perform public.reconcile_expired_capacity_holds(p_store_id, p_date);

  if p_daily_cap is null and p_window_cap is null then
    return jsonb_build_object(
      'ok', true,
      'held_daily', false,
      'held_window', false
    );
  end if;

  if p_daily_cap is not null then
    insert into public.fulfillment_capacity_holds (
      store_id, fulfillment_date, window_id, held_count
    ) values (p_store_id, p_date, '', 0)
    on conflict do nothing;

    update public.fulfillment_capacity_holds
    set held_count = held_count + 1
    where store_id = p_store_id
      and fulfillment_date = p_date
      and window_id = ''
      and held_count < p_daily_cap;
    get diagnostics updated = row_count;
    if updated = 0 then
      return jsonb_build_object('ok', false, 'error', 'capacity_full');
    end if;
    held_daily := true;
  end if;

  if p_window_cap is not null and v_window <> '' then
    insert into public.fulfillment_capacity_holds (
      store_id, fulfillment_date, window_id, held_count
    ) values (p_store_id, p_date, v_window, 0)
    on conflict do nothing;

    update public.fulfillment_capacity_holds
    set held_count = held_count + 1
    where store_id = p_store_id
      and fulfillment_date = p_date
      and window_id = v_window
      and held_count < p_window_cap;
    get diagnostics updated = row_count;
    if updated = 0 then
      if held_daily then
        update public.fulfillment_capacity_holds
        set held_count = greatest(0, held_count - 1)
        where store_id = p_store_id
          and fulfillment_date = p_date
          and window_id = '';
      end if;
      return jsonb_build_object('ok', false, 'error', 'capacity_full');
    end if;
    held_window := true;
  end if;

  return jsonb_build_object(
    'ok', true,
    'held_daily', held_daily,
    'held_window', held_window
  );
end;
$$;

-- Release by slot (failed order insert after hold).
create or replace function public.release_fulfillment_capacity_slot(
  p_store_id uuid,
  p_date date,
  p_window_id text,
  p_held_daily boolean,
  p_held_window boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_held_daily then
    update public.fulfillment_capacity_holds
    set held_count = greatest(0, held_count - 1)
    where store_id = p_store_id
      and fulfillment_date = p_date
      and window_id = '';
  end if;
  if p_held_window and coalesce(p_window_id, '') <> '' then
    update public.fulfillment_capacity_holds
    set held_count = greatest(0, held_count - 1)
    where store_id = p_store_id
      and fulfillment_date = p_date
      and window_id = p_window_id;
  end if;
end;
$$;

-- Release by order (cancel).
create or replace function public.release_order_fulfillment_capacity(
  p_order_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  o public.orders%rowtype;
begin
  select * into o from public.orders where id = p_order_id for update;
  if not found then
    return;
  end if;
  if not o.capacity_held_daily and not o.capacity_held_window then
    return;
  end if;
  if o.fulfillment_date is null then
    update public.orders
    set capacity_held_daily = false,
        capacity_held_window = false
    where id = o.id;
    return;
  end if;

  perform public.release_fulfillment_capacity_slot(
    o.store_id,
    o.fulfillment_date,
    coalesce(o.fulfillment_window_id, ''),
    o.capacity_held_daily,
    o.capacity_held_window
  );

  update public.orders
  set capacity_held_daily = false,
      capacity_held_window = false
  where id = o.id;
end;
$$;

-- Patch seller_transition_order to release capacity on cancel.
create or replace function public.seller_transition_order(
  p_store_id uuid,
  p_reference text,
  p_next_status public.order_status
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  o public.orders%rowtype;
  allowed boolean := false;
begin
  if auth.uid() is null then
    return jsonb_build_object('ok', false, 'error', 'Not signed in');
  end if;

  if not exists (
    select 1
    from public.stores
    where id = p_store_id
      and owner_id = auth.uid()
      and status <> 'deleted'
  ) then
    return jsonb_build_object('ok', false, 'error', 'Not allowed');
  end if;

  select * into o
  from public.orders
  where store_id = p_store_id
    and reference = p_reference
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'Order not found');
  end if;

  if p_next_status = 'seller_confirmed_paid' then
    allowed := o.status in ('payment_pending', 'seller_verification_requested');
  elsif p_next_status = 'completed' then
    allowed := o.status = 'seller_confirmed_paid';
  elsif p_next_status = 'cancelled' then
    allowed := o.status in (
      'payment_pending',
      'seller_verification_requested',
      'seller_confirmed_paid'
    );
  else
    return jsonb_build_object('ok', false, 'error', 'Invalid status');
  end if;

  if not allowed then
    return jsonb_build_object(
      'ok', false,
      'error', 'This order cannot be updated to that status'
    );
  end if;

  begin
    if p_next_status = 'seller_confirmed_paid' then
      perform public.apply_order_inventory(o.id, 'decrement');
    elsif p_next_status = 'cancelled' and o.status = 'seller_confirmed_paid' then
      perform public.apply_order_inventory(o.id, 'restore');
    end if;
  exception
    when others then
      if SQLERRM like '%insufficient_stock%' then
        return jsonb_build_object(
          'ok', false,
          'error', 'Not enough stock left to confirm this order'
        );
      end if;
      raise;
  end;

  -- Soft-hold capacity release on any cancel (paid or unpaid).
  if p_next_status = 'cancelled' then
    perform public.release_order_fulfillment_capacity(o.id);
  end if;

  update public.orders
  set status = p_next_status
  where id = o.id;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.reconcile_expired_capacity_holds(uuid, date) from public;
revoke all on function public.hold_fulfillment_capacity(uuid, date, text, integer, integer) from public;
revoke all on function public.release_fulfillment_capacity_slot(uuid, date, text, boolean, boolean) from public;
revoke all on function public.release_order_fulfillment_capacity(uuid) from public;

grant execute on function public.reconcile_expired_capacity_holds(uuid, date) to service_role;
grant execute on function public.hold_fulfillment_capacity(uuid, date, text, integer, integer)
  to service_role;
grant execute on function public.release_fulfillment_capacity_slot(uuid, date, text, boolean, boolean)
  to service_role;
grant execute on function public.release_order_fulfillment_capacity(uuid) to service_role;

-- seller_transition_order already granted to authenticated in inventory migration;
-- re-assert after replace.
grant execute on function public.seller_transition_order(uuid, text, public.order_status)
  to authenticated;
