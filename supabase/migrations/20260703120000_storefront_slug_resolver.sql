-- Resolve a storefront slug for public buyers without exposing draft store data.
-- RLS only allows anon SELECT on published rows, so we need SECURITY DEFINER to
-- distinguish "slug does not exist" from "exists but not published".

create or replace function public.resolve_storefront_slug(p_slug text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select case
    when not exists (
      select 1 from public.stores where slug = p_slug and status <> 'deleted'
    ) then 'not_found'
    when exists (
      select 1 from public.stores where slug = p_slug and status = 'published'
    ) then 'published'
    else 'unavailable'
  end;
$$;

grant execute on function public.resolve_storefront_slug(text) to anon, authenticated;
