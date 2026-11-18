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
  select settings.id
  into configured_settings_id
  from public.admin_settings as settings
  order by settings.created_at
  limit 1;

  if configured_settings_id is not null then
    if not exists (
      select 1
      from public.admin_business_hours as hours
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

  if cardinality(p_dish_ids) <> (select count(distinct selected.value) from unnest(p_dish_ids) as selected(value)) then
    raise exception 'O mesmo prato não pode ser incluído mais de uma vez.';
  end if;

  if p_menu_id is null then
    if exists (
      select 1
      from public.dishes as dish
      where dish.id = any(p_dish_ids)
        and not dish.is_active
    ) then
      raise exception 'Somente pratos ativos podem ser incluídos em um novo cardápio.';
    end if;

    insert into public.daily_menus (menu_date)
    values (p_menu_date)
    returning * into menu_row;
  else
    select menu.*
    into menu_row
    from public.daily_menus as menu
    where menu.id = p_menu_id
    for update;

    if menu_row.id is null then
      raise exception 'Cardápio não encontrado.';
    end if;

    update public.daily_menus as menu
    set menu_date = p_menu_date
    where menu.id = p_menu_id
    returning menu.* into menu_row;
  end if;

  foreach selected_dish_id in array p_dish_ids loop
    if not exists (
      select 1
      from public.dishes as dish
      where dish.id = selected_dish_id
    ) then
      raise exception 'Um dos pratos selecionados não existe.';
    end if;

    if not exists (
      select 1
      from public.dishes as dish
      where dish.id = selected_dish_id
        and (
          dish.is_active
          or exists (
            select 1
            from public.daily_menu_items as old_item
            where old_item.menu_id = menu_row.id
              and old_item.dish_id = selected_dish_id
          )
        )
    ) then
      raise exception 'Pratos inativos não podem ser incluídos em novos cardápios.';
    end if;
  end loop;

  delete from public.daily_menu_items as item
  where item.menu_id = menu_row.id
    and item.dish_id <> all(p_dish_ids);

  insert into public.daily_menu_items (menu_id, dish_id)
  select menu_row.id, selected.value
  from unnest(p_dish_ids) as selected(value)
  on conflict (menu_id, dish_id) do nothing;

  return menu_row;
end;
$$;

revoke all on function public.save_daily_menu(uuid, date, uuid[]) from public;
grant execute on function public.save_daily_menu(uuid, date, uuid[]) to authenticated;
