create or replace function public.delete_daily_menu(p_menu_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Acesso administrativo obrigatório.';
  end if;

  if not exists (
    select 1
    from public.daily_menus menu
    where menu.id = p_menu_id
      and menu.status in ('RASCUNHO', 'PUBLICADO')
  ) then
    raise exception 'O cardápio não foi encontrado.';
  end if;

  delete from public.daily_menus
  where id = p_menu_id;
end;
$$;

revoke all on function public.delete_daily_menu(uuid) from public;
grant execute on function public.delete_daily_menu(uuid) to authenticated;
