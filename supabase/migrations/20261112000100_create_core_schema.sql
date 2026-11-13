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
  whatsapp text not null check (length(trim(whatsapp)) >= 8),
  timezone text not null default 'America/Fortaleza',
  opening_time time not null default '11:00:00',
  closing_time time not null default '14:00:00',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

create trigger trg_admin_settings_single_row
before insert or update on public.admin_settings
for each row execute function public.ensure_single_admin_settings_row();
