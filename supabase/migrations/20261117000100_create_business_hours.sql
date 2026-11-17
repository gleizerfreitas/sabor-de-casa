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

create trigger trg_admin_business_hours_set_updated_at
before update on public.admin_business_hours
for each row execute function public.set_updated_at();

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

alter table public.admin_settings
  drop constraint if exists admin_settings_whatsapp_check;

update public.admin_settings
   set whatsapp = regexp_replace(whatsapp, '\D', '', 'g'),
       updated_at = now()
 where whatsapp !~ '^55[1-9][0-9][6-9][0-9]{8}$'
   and regexp_replace(whatsapp, '\D', '', 'g') ~ '^55[1-9][0-9][6-9][0-9]{8}$';

alter table public.admin_settings
  add constraint admin_settings_whatsapp_brazilian_check
  check (whatsapp ~ '^55[1-9][0-9][6-9][0-9]{8}$');

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

  select *
    into settings_row
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
       set owner_name = trim(p_owner_name),
           whatsapp = p_whatsapp,
           timezone = p_timezone
     where id = settings_row.id
     returning * into settings_row;
  end if;

  delete from public.admin_business_hours
   where settings_id = settings_row.id;

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
