-- Public storefront gate with Coming Soon for draft stores (name only — no private data).

create or replace function public.resolve_storefront_public(p_slug text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  r record;
begin
  select name, status into r
  from public.stores
  where slug = p_slug and status <> 'deleted'
  limit 1;

  if not found then
    return jsonb_build_object('kind', 'not_found');
  end if;

  if r.status = 'published' then
    return jsonb_build_object('kind', 'published');
  end if;

  if r.status = 'draft' then
    return jsonb_build_object('kind', 'coming_soon', 'name', r.name);
  end if;

  return jsonb_build_object(
    'kind', 'unavailable',
    'name', r.name,
    'status', r.status
  );
end;
$$;

grant execute on function public.resolve_storefront_public(text) to anon, authenticated;

-- Keep legacy text resolver in sync for any older callers
create or replace function public.resolve_storefront_slug(p_slug text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select case
    when (public.resolve_storefront_public(p_slug)->>'kind') = 'published' then 'published'
    when (public.resolve_storefront_public(p_slug)->>'kind') = 'not_found' then 'not_found'
    else 'unavailable'
  end;
$$;
