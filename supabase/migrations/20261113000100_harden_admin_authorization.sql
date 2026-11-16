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
      and ap.role = 'admin'
  );
$$;

comment on function public.is_admin() is
  'Returns true only for the authenticated user associated with the admin role.';

alter table public.admin_profiles enable row level security;

drop policy if exists "admin_manage_admin_profiles" on public.admin_profiles;
create policy "admin_manage_admin_profiles"
on public.admin_profiles
for all
using (public.is_admin())
with check (public.is_admin());

comment on table public.admin_profiles is
  'Explicit authorization association for the single administrative account.';
