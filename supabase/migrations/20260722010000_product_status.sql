-- Phase 1: product status (draft | live | archived).
-- status is source of truth; archived kept in sync for transition.

alter table public.products
  add column if not exists status text;

-- Backfill before NOT NULL / check
update public.products
set status = case when archived then 'archived' else 'live' end
where status is null;

alter table public.products
  alter column status set default 'live',
  alter column status set not null;

alter table public.products
  drop constraint if exists products_status_check;

alter table public.products
  add constraint products_status_check
  check (status in ('draft', 'live', 'archived'));

create index if not exists products_store_id_status_idx
  on public.products (store_id, status);

-- Keep archived bool in sync when either column is written
create or replace function public.sync_product_status_archived()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    if new.status is null then
      new.status := case when coalesce(new.archived, false) then 'archived' else 'live' end;
    end if;
    new.archived := (new.status = 'archived');
    return new;
  end if;

  -- UPDATE: status wins when it changed; otherwise archived can drive restore/archive
  if new.status is distinct from old.status then
    new.archived := (new.status = 'archived');
  elsif new.archived is distinct from old.archived then
    if new.archived then
      new.status := 'archived';
    elsif old.status = 'archived' then
      new.status := 'live';
    end if;
  else
    new.archived := (new.status = 'archived');
  end if;

  return new;
end;
$$;

drop trigger if exists products_sync_status_archived on public.products;
create trigger products_sync_status_archived
  before insert or update on public.products
  for each row
  execute function public.sync_product_status_archived();

-- Public storefront: live products only (drafts stay private)
drop policy if exists "products_public_read" on public.products;

create policy "products_public_read"
  on public.products
  for select
  to anon, authenticated
  using (
    status = 'live'
    and exists (
      select 1
      from public.stores
      where stores.id = products.store_id
        and stores.status = 'published'
    )
  );
