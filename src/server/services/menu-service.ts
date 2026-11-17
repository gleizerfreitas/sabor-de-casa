import type { SupabaseClient } from "@supabase/supabase-js";
import type { DailyMenu } from "@/src/types/menu";

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

export async function listDailyMenus(supabase: SupabaseClient) {
  const result = await supabase
    .from("daily_menus")
    .select("id, menu_date, status, published_at, daily_menu_items(id, dish_id, available)")
    .order("menu_date", { ascending: true });
  if (result.error) throw new Error(`Não foi possível carregar os cardápios: ${result.error.message}`);

  return (result.data ?? []).map((menu) => ({
    id: menu.id,
    menu_date: menu.menu_date,
    status: menu.status,
    published_at: menu.published_at,
    items: Array.isArray(menu.daily_menu_items) ? menu.daily_menu_items : [],
  })) as DailyMenu[];
}

export async function getDailyMenu(supabase: SupabaseClient, id: string) {
  const result = await supabase
    .from("daily_menus")
    .select("id, menu_date, status, published_at, daily_menu_items(id, dish_id, available)")
    .eq("id", id)
    .maybeSingle();
  if (result.error) throw new Error(`Não foi possível carregar o cardápio: ${result.error.message}`);
  if (!result.data) return null;

  return {
    id: result.data.id,
    menu_date: result.data.menu_date,
    status: result.data.status,
    published_at: result.data.published_at,
    items: Array.isArray(result.data.daily_menu_items) ? result.data.daily_menu_items : [],
  } as DailyMenu;
}

export async function saveDailyMenu(
  supabase: SupabaseClient,
  id: string | null,
  date: string,
  dishIds: string[],
) {
  const result = await supabase.rpc("save_daily_menu", {
    p_menu_id: id,
    p_menu_date: date,
    p_dish_ids: dishIds,
  });
  if (result.error) {
    if (result.error.code === "23505") throw new Error("Já existe um cardápio para essa data.");
    throw new Error(result.error.message || "Não foi possível salvar o cardápio.");
  }
  return result.data;
}

export async function publishDailyMenu(supabase: SupabaseClient, id: string) {
  const result = await supabase.rpc("publish_daily_menu", { p_menu_id: id });
  if (result.error) throw new Error(result.error.message || "Não foi possível publicar o cardápio.");
}

export async function deleteDailyMenu(supabase: SupabaseClient, id: string) {
  const result = await supabase.rpc("delete_daily_menu", { p_menu_id: id });
  if (result.error) throw new Error(result.error.message || "Não foi possível excluir o cardápio.");
}
