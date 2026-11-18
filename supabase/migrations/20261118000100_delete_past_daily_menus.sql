create or replace function public.delete_past_daily_menus()
returns integer
language plpgsql
security invoker
set search_path = public
as $$
declare
  deleted_count integer;
  timezone_name text := 'America/Fortaleza';
  today date;
begin
  if not public.is_admin() then
    raise exception 'Acesso administrativo obrigatório.';
  end if;

  select settings.timezone
  into timezone_name
  from public.admin_settings as settings
  order by settings.created_at
  limit 1;

  timezone_name := coalesce(timezone_name, 'America/Fortaleza');
  today := (now() at time zone timezone_name)::date;

  delete from public.daily_menus as menu
  where menu.menu_date < today;

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

revoke all on function public.delete_past_daily_menus() from public;
grant execute on function public.delete_past_daily_menus() to authenticated;
