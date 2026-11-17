alter table public.categories enable row level security;

create policy "public_read_categories"
on public.categories
for select
using (true);
