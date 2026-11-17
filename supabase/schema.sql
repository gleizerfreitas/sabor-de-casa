create extension if not exists pgcrypto;

create type public.menu_status as enum ('RASCUNHO', 'PUBLICADO');

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists ux_categories_name
  on public.categories (lower(trim(name)));

create table if not exists public.dishes (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  name text not null check (length(trim(name)) > 0),
  description text default '',
  price numeric(10,2) not null check (price > 0),
  photo_url text not null check (length(trim(photo_url)) > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_dishes_category_id
  on public.dishes (category_id);

create index if not exists idx_dishes_is_active
  on public.dishes (is_active);

create table if not exists public.daily_menus (
  id uuid primary key default gen_random_uuid(),
  menu_date date not null,
  status public.menu_status not null default 'RASCUNHO',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint daily_menus_menu_date_unique unique (menu_date),
  constraint daily_menus_menu_date_not_past check (menu_date >= current_date),
  constraint daily_menus_published_requires_timestamp
    check (
      (status = 'PUBLICADO' and published_at is not null)
      or (status = 'RASCUNHO')
    )
);

create index if not exists idx_daily_menus_menu_date
  on public.daily_menus (menu_date);

create index if not exists idx_daily_menus_status
  on public.daily_menus (status);

create table if not exists public.daily_menu_items (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid not null references public.daily_menus(id) on delete cascade,
  dish_id uuid not null references public.dishes(id) on delete restrict,
  available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint daily_menu_items_unique unique (menu_id, dish_id)
);

create index if not exists idx_daily_menu_items_menu_id
  on public.daily_menu_items (menu_id);

create index if not exists idx_daily_menu_items_dish_id
  on public.daily_menu_items (dish_id);

create index if not exists idx_daily_menu_items_available
  on public.daily_menu_items (available);

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role = 'admin'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_settings (
  id uuid primary key default gen_random_uuid(),
  owner_name text not null check (length(trim(owner_name)) > 0),
  whatsapp text not null check (whatsapp ~ '^55[1-9][0-9][6-9][0-9]{8}$'),
  timezone text not null default 'America/Fortaleza',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_business_hours (
  id uuid primary key default gen_random_uuid(),
  settings_id uuid not null references public.admin_settings(id) on delete cascade,
  day_of_week text not null check (day_of_week in (
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  )),
  is_open boolean not null default false,
  opening_time time,
  closing_time time,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint admin_business_hours_day_unique unique (settings_id, day_of_week),
  constraint admin_business_hours_interval_valid check (
    (is_open and opening_time is not null and closing_time is not null and opening_time < closing_time)
    or (not is_open and opening_time is null and closing_time is null)
  )
);

create index if not exists idx_admin_business_hours_settings_id
  on public.admin_business_hours (settings_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.ensure_single_admin_settings_row()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' and exists (select 1 from public.admin_settings) then
    raise exception 'Apenas uma configuração administrativa pode existir.';
  end if;

  if tg_op = 'UPDATE' and (
    (select count(*) from public.admin_settings) > 1
  ) then
    raise exception 'Somente uma configuração administrativa pode existir.';
  end if;

  return new;
end;
$$;

create trigger trg_categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create trigger trg_dishes_set_updated_at
before update on public.dishes
for each row execute function public.set_updated_at();

create trigger trg_daily_menus_set_updated_at
before update on public.daily_menus
for each row execute function public.set_updated_at();

create trigger trg_daily_menu_items_set_updated_at
before update on public.daily_menu_items
for each row execute function public.set_updated_at();

create trigger trg_admin_profiles_set_updated_at
before update on public.admin_profiles
for each row execute function public.set_updated_at();

create trigger trg_admin_settings_set_updated_at
before update on public.admin_settings
for each row execute function public.set_updated_at();

create trigger trg_admin_business_hours_set_updated_at
before update on public.admin_business_hours
for each row execute function public.set_updated_at();

create trigger trg_admin_settings_single_row
before insert or update on public.admin_settings
for each row execute function public.ensure_single_admin_settings_row();

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

create or replace function public.update_admin_settings(
  p_owner_name text,
  p_whatsapp text,
  p_timezone text,
  p_hours jsonb
)
returns public.admin_settings
language plpgsql
security invoker
set search_path = public
as $$
declare
  settings_row public.admin_settings;
  hour_row jsonb;
begin
  if not public.is_admin() then
    raise exception 'Acesso administrativo obrigatório.';
  end if;
  if length(trim(p_owner_name)) = 0 then
    raise exception 'Informe o nome da proprietária.';
  end if;
  if p_whatsapp !~ '^55[1-9][0-9][6-9][0-9]{8}$' then
    raise exception 'Informe um número de WhatsApp brasileiro válido com DDD.';
  end if;
  if jsonb_array_length(p_hours) <> 7 then
    raise exception 'Informe os sete dias da semana.';
  end if;

  select * into settings_row
    from public.admin_settings
    order by created_at
    limit 1
    for update;

  if settings_row.id is null then
    insert into public.admin_settings (owner_name, whatsapp, timezone)
    values (trim(p_owner_name), p_whatsapp, p_timezone)
    returning * into settings_row;
  else
    update public.admin_settings
       set owner_name = trim(p_owner_name), whatsapp = p_whatsapp, timezone = p_timezone
     where id = settings_row.id
     returning * into settings_row;
  end if;

  delete from public.admin_business_hours where settings_id = settings_row.id;
  for hour_row in select * from jsonb_array_elements(p_hours)
  loop
    insert into public.admin_business_hours (
      settings_id, day_of_week, is_open, opening_time, closing_time
    )
    values (
      settings_row.id,
      hour_row->>'dayOfWeek',
      (hour_row->>'isOpen')::boolean,
      nullif(hour_row->>'openingTime', '')::time,
      nullif(hour_row->>'closingTime', '')::time
    );
  end loop;
  return settings_row;
end;
$$;

revoke all on function public.update_admin_settings(text, text, text, jsonb) from public;
grant execute on function public.update_admin_settings(text, text, text, jsonb) to authenticated;

create or replace function public.save_daily_menu(
  p_menu_id uuid,
  p_menu_date date,
  p_dish_ids uuid[]
)
returns public.daily_menus
language plpgsql
security invoker
set search_path = public
as $$
declare
  menu_row public.daily_menus;
  selected_dish_id uuid;
  configured_day text;
  configured_settings_id uuid;
begin
  if not public.is_admin() then
    raise exception 'Acesso administrativo obrigatório.';
  end if;
  if p_menu_date < current_date then
    raise exception 'Escolha uma data de hoje ou futura.';
  end if;

  configured_day := (array['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'])[extract(dow from p_menu_date)::integer + 1];
  select settings.id into configured_settings_id
  from public.admin_settings settings
  order by settings.created_at
  limit 1;

  if configured_settings_id is not null then
    if not exists (
      select 1 from public.admin_business_hours hours
      where hours.settings_id = configured_settings_id
        and hours.day_of_week = configured_day
        and hours.is_open
    ) then
      raise exception 'A data escolhida corresponde a um dia sem funcionamento configurado.';
    end if;
  elsif extract(isodow from p_menu_date) > 5 then
    raise exception 'A data escolhida corresponde a um dia sem funcionamento configurado.';
  end if;
  if p_dish_ids is null or cardinality(p_dish_ids) = 0 then
    raise exception 'Selecione pelo menos um prato.';
  end if;
  if cardinality(p_dish_ids) <> (select count(distinct value) from unnest(p_dish_ids) as value) then
    raise exception 'O mesmo prato não pode ser incluído mais de uma vez.';
  end if;

  if p_menu_id is null then
    if exists (select 1 from public.dishes where id = any(p_dish_ids) and not is_active) then
      raise exception 'Somente pratos ativos podem ser incluídos em um novo cardápio.';
    end if;
    insert into public.daily_menus (menu_date)
    values (p_menu_date)
    returning * into menu_row;
  else
    select * into menu_row from public.daily_menus where id = p_menu_id for update;
    if menu_row.id is null then
      raise exception 'Cardápio não encontrado.';
    end if;
    update public.daily_menus set menu_date = p_menu_date
    where id = p_menu_id
    returning * into menu_row;
  end if;

  foreach selected_dish_id in array p_dish_ids loop
    if not exists (select 1 from public.dishes dish where dish.id = selected_dish_id) then
      raise exception 'Um dos pratos selecionados não existe.';
    end if;
    if not exists (
      select 1 from public.dishes d
      where d.id = selected_dish_id
        and (d.is_active or exists (
          select 1 from public.daily_menu_items old_item
          where old_item.menu_id = menu_row.id and old_item.dish_id = selected_dish_id
        ))
    ) then
      raise exception 'Pratos inativos não podem ser incluídos em novos cardápios.';
    end if;
  end loop;

  delete from public.daily_menu_items item
  where item.menu_id = menu_row.id and item.dish_id <> all(p_dish_ids);

  insert into public.daily_menu_items (menu_id, dish_id)
  select menu_row.id, selected.value
  from unnest(p_dish_ids) as selected(value)
  on conflict (menu_id, dish_id) do nothing;

  return menu_row;
end;
$$;

revoke all on function public.save_daily_menu(uuid, date, uuid[]) from public;
grant execute on function public.save_daily_menu(uuid, date, uuid[]) to authenticated;

create or replace function public.publish_daily_menu(p_menu_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'Acesso administrativo obrigatório.'; end if;
  if not exists (select 1 from public.daily_menus menu where menu.id = p_menu_id and menu.status = 'RASCUNHO') then
    raise exception 'Somente cardápios em rascunho podem ser publicados.';
  end if;
  if not exists (select 1 from public.daily_menu_items item where item.menu_id = p_menu_id) then
    raise exception 'Não é possível publicar um cardápio sem itens.';
  end if;
  update public.daily_menus set status = 'PUBLICADO', published_at = now() where id = p_menu_id;
end;
$$;

create or replace function public.delete_daily_menu(p_menu_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'Acesso administrativo obrigatório.'; end if;
  if not exists (select 1 from public.daily_menus menu where menu.id = p_menu_id and menu.status = 'RASCUNHO') then
    raise exception 'Somente cardápios em rascunho podem ser excluídos.';
  end if;
  delete from public.daily_menus where id = p_menu_id;
end;
$$;

revoke all on function public.publish_daily_menu(uuid) from public;
revoke all on function public.delete_daily_menu(uuid) from public;
grant execute on function public.publish_daily_menu(uuid) to authenticated;
grant execute on function public.delete_daily_menu(uuid) to authenticated;

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

alter table public.admin_business_hours enable row level security;
create policy "admin_manage_business_hours"
on public.admin_business_hours
for all
using (public.is_admin())
with check (public.is_admin());

create policy "public_read_business_hours"
on public.admin_business_hours
for select
using (true);

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
