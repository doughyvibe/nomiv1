-- Phase 4: optional inventory + sold-out policy.
-- Default track_inventory = false (unlimited). Decrement on seller_confirmed_paid only.

alter table public.products
  add column if not exists track_inventory boolean not null default false,
  add column if not exists stock_qty integer,
  add column if not exists sold_out_policy text not null default 'show';

alter table public.products
  drop constraint if exists products_stock_qty_nonneg,
  drop constraint if exists products_sold_out_policy_check;

alter table public.products
  add constraint products_stock_qty_nonneg
    check (stock_qty is null or stock_qty >= 0),
  add constraint products_sold_out_policy_check
    check (sold_out_policy in ('hide', 'show'));

alter table public.product_variants
  add column if not exists stock_qty integer;

alter table public.product_variants
  drop constraint if exists product_variants_stock_qty_nonneg;

alter table public.product_variants
  add constraint product_variants_stock_qty_nonneg
    check (stock_qty is null or stock_qty >= 0);

-- ---------------------------------------------------------------------------
-- Atomic stock adjust for one order (decrement on paid; restore on cancel-from-paid)
-- ---------------------------------------------------------------------------

create or replace function public.apply_order_inventory(
  p_order_id uuid,
  p_direction text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
  updated integer;
begin
  if p_direction not in ('decrement', 'restore') then
    raise exception 'invalid_inventory_direction';
  end if;

  for r in
    select
      oi.product_id,
      oi.variant_id,
      oi.quantity,
      p.track_inventory
    from public.order_items oi
    join public.products p on p.id = oi.product_id
    where oi.order_id = p_order_id
      and oi.product_id is not null
  loop
    if not coalesce(r.track_inventory, false) then
      continue;
    end if;

    if r.variant_id is not null then
      if p_direction = 'decrement' then
        update public.product_variants
        set stock_qty = stock_qty - r.quantity
        where id = r.variant_id
          and stock_qty is not null
          and stock_qty >= r.quantity;
        get diagnostics updated = row_count;
        if updated = 0 then
          raise exception 'insufficient_stock';
        end if;
      else
        -- ponytail: orphan snapshots (deleted variant) skip restore
        update public.product_variants
        set stock_qty = coalesce(stock_qty, 0) + r.quantity
        where id = r.variant_id;
      end if;
    else
      if p_direction = 'decrement' then
        update public.products
        set stock_qty = stock_qty - r.quantity
        where id = r.product_id
          and track_inventory = true
          and stock_qty is not null
          and stock_qty >= r.quantity;
        get diagnostics updated = row_count;
        if updated = 0 then
          raise exception 'insufficient_stock';
        end if;
      else
        update public.products
        set stock_qty = coalesce(stock_qty, 0) + r.quantity
        where id = r.product_id
          and track_inventory = true;
      end if;
    end if;
  end loop;
end;
$$;

-- Seller-owned status transition + inventory in one transaction.
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

  update public.orders
  set status = p_next_status
  where id = o.id;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.apply_order_inventory(uuid, text) from public;
revoke all on function public.seller_transition_order(uuid, text, public.order_status) from public;

grant execute on function public.apply_order_inventory(uuid, text) to service_role;
grant execute on function public.seller_transition_order(uuid, text, public.order_status)
  to authenticated;
