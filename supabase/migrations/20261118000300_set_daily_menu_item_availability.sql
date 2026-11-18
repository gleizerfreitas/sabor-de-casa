create or replace function public.set_daily_menu_item_availability(
  p_menu_id uuid,
  p_dish_id uuid,
  p_available boolean
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
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

  if not exists (
    select 1
    from public.daily_menus as menu
    where menu.id = p_menu_id
      and menu.menu_date = today
      and menu.status = 'PUBLICADO'
  ) then
    raise exception 'A disponibilidade só pode ser gerenciada para o cardápio publicado do dia.';
  end if;

  if not exists (
    select 1
    from public.daily_menu_items as item
    where item.menu_id = p_menu_id
      and item.dish_id = p_dish_id
  ) then
    raise exception 'O prato não pertence ao cardápio selecionado.';
  end if;

  update public.daily_menu_items
  set available = p_available
  where menu_id = p_menu_id
    and dish_id = p_dish_id;
end;
$$;

revoke all on function public.set_daily_menu_item_availability(uuid, uuid, boolean) from public;
grant execute on function public.set_daily_menu_item_availability(uuid, uuid, boolean) to authenticated;
