-- Store images bucket (hero + product photos)
-- Apply via Supabase Dashboard → SQL Editor (like the initial schema migration).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'store-images',
  'store-images',
  true,                       -- public read: storefront images are public content
  5242880,                    -- 5 MB cap (client compresses before upload)
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- Authenticated sellers manage files under their own {user_id}/ prefix
create policy "store_images_owner_insert"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'store-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "store_images_owner_update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'store-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "store_images_owner_delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'store-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- Public read (bucket is public, but explicit select policy keeps RLS coherent)
create policy "store_images_public_read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'store-images');
