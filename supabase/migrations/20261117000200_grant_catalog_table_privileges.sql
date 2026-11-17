grant select on table public.categories, public.dishes
to anon, authenticated;

grant insert, update, delete on table public.categories, public.dishes
to authenticated;
