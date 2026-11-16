insert into public.admin_profiles (id, role)
values ('af7d9f60-1d8b-46ff-86eb-30e6c200d41d', 'admin')
on conflict (id) do update
set role = excluded.role;