create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles ap
    where ap.id = auth.uid()
  );
$$;

alter table public.categories enable row level security;
create policy "admin_manage_categories"
on public.categories
for all
using (public.is_admin())
with check (public.is_admin());

alter table public.dishes enable row level security;
create policy "admin_manage_dishes"
on public.dishes
for all
using (public.is_admin())
with check (public.is_admin());

create policy "public_read_dishes"
on public.dishes
for select
using (true);

alter table public.daily_menus enable row level security;
create policy "admin_manage_daily_menus"
on public.daily_menus
for all
using (public.is_admin())
with check (public.is_admin());

create policy "public_read_published_daily_menus"
on public.daily_menus
for select
using (status = 'PUBLICADO');

alter table public.daily_menu_items enable row level security;
create policy "admin_manage_daily_menu_items"
on public.daily_menu_items
for all
using (public.is_admin())
with check (public.is_admin());

create policy "public_read_published_daily_menu_items"
on public.daily_menu_items
for select
using (
  exists (
    select 1
    from public.daily_menus m
    where m.id = daily_menu_items.menu_id
      and m.status = 'PUBLICADO'
  )
);

alter table public.admin_profiles enable row level security;
create policy "admin_manage_admin_profiles"
on public.admin_profiles
for all
using (public.is_admin())
with check (public.is_admin());

alter table public.admin_settings enable row level security;
create policy "admin_manage_admin_settings"
on public.admin_settings
for all
using (public.is_admin())
with check (public.is_admin());

create policy "public_read_admin_settings"
on public.admin_settings
for select
using (true);
