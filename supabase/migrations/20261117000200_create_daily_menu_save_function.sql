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
  dish_id uuid;
begin
  if not public.is_admin() then
    raise exception 'Acesso administrativo obrigatório.';
  end if;

  if p_menu_date < current_date then
    raise exception 'Escolha uma data de hoje ou futura.';
  end if;

  if p_dish_ids is null or cardinality(p_dish_ids) = 0 then
    raise exception 'Selecione pelo menos um prato.';
  end if;

  if cardinality(p_dish_ids) <> (select count(distinct value) from unnest(p_dish_ids) as value) then
    raise exception 'O mesmo prato não pode ser incluído mais de uma vez.';
  end if;

  if p_menu_id is null then
    if exists (
      select 1 from public.dishes
      where id = any(p_dish_ids) and not is_active
    ) then
      raise exception 'Somente pratos ativos podem ser incluídos em um novo cardápio.';
    end if;

    insert into public.daily_menus (menu_date)
    values (p_menu_date)
    returning * into menu_row;
  else
    select * into menu_row
    from public.daily_menus
    where id = p_menu_id
    for update;

    if menu_row.id is null then
      raise exception 'Cardápio não encontrado.';
    end if;

    update public.daily_menus
    set menu_date = p_menu_date
    where id = p_menu_id
    returning * into menu_row;
  end if;

  foreach dish_id in array p_dish_ids loop
    if not exists (select 1 from public.dishes where id = dish_id) then
      raise exception 'Um dos pratos selecionados não existe.';
    end if;
    if not exists (
      select 1 from public.dishes d
      where d.id = dish_id
        and (d.is_active or exists (
          select 1 from public.daily_menu_items old_item
          where old_item.menu_id = menu_row.id and old_item.dish_id = dish_id
        ))
    ) then
      raise exception 'Pratos inativos não podem ser incluídos em novos cardápios.';
    end if;
  end loop;

  delete from public.daily_menu_items
  where menu_id = menu_row.id and dish_id <> all(p_dish_ids);

  insert into public.daily_menu_items (menu_id, dish_id)
  select menu_row.id, value
  from unnest(p_dish_ids) as value
  on conflict (menu_id, dish_id) do nothing;

  return menu_row;
end;
$$;

revoke all on function public.save_daily_menu(uuid, date, uuid[]) from public;
grant execute on function public.save_daily_menu(uuid, date, uuid[]) to authenticated;
