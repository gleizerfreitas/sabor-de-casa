insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'dish-photos',
  'dish-photos',
  true,
  1048576,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "public_read_dish_photos"
on storage.objects
for select
using (bucket_id = 'dish-photos');

create policy "admin_upload_dish_photos"
on storage.objects
for insert
with check (
  bucket_id = 'dish-photos'
  and public.is_admin()
);

create policy "admin_update_dish_photos"
on storage.objects
for update
using (
  bucket_id = 'dish-photos'
  and public.is_admin()
)
with check (
  bucket_id = 'dish-photos'
  and public.is_admin()
);

create policy "admin_delete_dish_photos"
on storage.objects
for delete
using (
  bucket_id = 'dish-photos'
  and public.is_admin()
);
