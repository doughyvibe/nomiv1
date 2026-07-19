-- Slug availability must see all stores (including other users' drafts).
-- RLS only allows SELECT on published rows or own rows, so a plain
-- stores query falsely reports draft slugs as free. Mirror
-- resolve_storefront_slug: SECURITY DEFINER, boolean only — no row leak.

create or replace function public.is_store_slug_available(p_slug text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    not exists (
      select 1 from public.reserved_slugs where slug = p_slug
    )
    and not exists (
      select 1 from public.stores where slug = p_slug
    );
$$;

revoke all on function public.is_store_slug_available(text) from public;
grant execute on function public.is_store_slug_available(text) to authenticated;
