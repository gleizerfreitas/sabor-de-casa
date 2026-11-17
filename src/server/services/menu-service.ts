import type { SupabaseClient } from "@supabase/supabase-js";

type MenuSummary = {
  id: string;
  menu_date: string;
  status: "RASCUNHO" | "PUBLICADO";
  item_count: number;
};

export type AdminMenuOverview = {
  ownerName: string;
  today: string;
  menu: (MenuSummary & { item_count: number }) | null;
  upcomingMenus: Array<MenuSummary & { item_count: number }>;
};

function todayInTimezone(timezone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export async function getTodayMenuSummary(supabase: SupabaseClient): Promise<AdminMenuOverview> {
  const settings = await supabase
    .from("admin_settings")
    .select("owner_name, timezone")
    .order("created_at")
    .limit(1)
    .maybeSingle();
  if (settings.error) throw new Error(`Não foi possível carregar a visão geral: ${settings.error.message}`);

  const today = todayInTimezone(settings.data?.timezone ?? "America/Fortaleza");
  const menu = await supabase
    .from("daily_menus")
    .select("id, menu_date, status")
    .eq("menu_date", today)
    .maybeSingle();
  if (menu.error) throw new Error(`Não foi possível carregar o cardápio do dia: ${menu.error.message}`);

  let itemCount = 0;
  if (menu.data) {
    const items = await supabase
      .from("daily_menu_items")
      .select("id", { count: "exact", head: true })
      .eq("menu_id", menu.data.id);
    if (items.error) throw new Error(`Não foi possível carregar os itens do cardápio: ${items.error.message}`);
    itemCount = items.count ?? 0;
  }

  const upcoming = await supabase
    .from("daily_menus")
    .select("id, menu_date, status, daily_menu_items(id)")
    .gt("menu_date", today)
    .order("menu_date", { ascending: true })
    .limit(5);
  if (upcoming.error) throw new Error(`Não foi possível carregar os próximos cardápios: ${upcoming.error.message}`);

  return {
    ownerName: settings.data?.owner_name ?? "",
    today,
    menu: menu.data ? { ...menu.data, item_count: itemCount } as MenuSummary & { item_count: number } : null,
    upcomingMenus: (upcoming.data ?? []).map((item) => ({
      id: item.id,
      menu_date: item.menu_date,
      status: item.status,
      item_count: Array.isArray(item.daily_menu_items) ? item.daily_menu_items.length : 0,
    })),
  };
}
