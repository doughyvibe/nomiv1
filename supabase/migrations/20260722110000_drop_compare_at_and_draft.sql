-- Trim: drop compare-at; collapse product status to live | archived.

-- Existing drafts → archived (do not auto-publish WIP)
update public.products
set status = 'archived', archived = true
where status = 'draft';

alter table public.products
  drop constraint if exists products_compare_at_cents_nonneg;

alter table public.products
  drop column if exists compare_at_cents;

alter table public.products
  drop constraint if exists products_status_check;

alter table public.products
  add constraint products_status_check
    check (status in ('live', 'archived'));

-- Keep archived bool in sync (draft branch removed)
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
    new.archived := (new.status = 'archived');
  end if;

  return new;
end;
$$;
