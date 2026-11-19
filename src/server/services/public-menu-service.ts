import type { SupabaseClient } from "@supabase/supabase-js";
import type { PublicDish, PublicMenu } from "@/src/types/public-menu";

function todayInTimezone(timezone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function weekdayInTimezone(timezone: string) {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "long",
  }).format(new Date()).toLowerCase();
  return weekday === "sunday" ? "sunday"
    : weekday === "monday" ? "monday"
    : weekday === "tuesday" ? "tuesday"
    : weekday === "wednesday" ? "wednesday"
    : weekday === "thursday" ? "thursday"
    : weekday === "friday" ? "friday"
    : "saturday";
}

function dateLabel(date: string, timezone: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: timezone,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${date}T12:00:00Z`));
}

function currentTimeInTimezone(timezone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date());
}

export async function getPublicMenu(supabase: SupabaseClient): Promise<PublicMenu> {
  const settings = await supabase
    .from("admin_settings")
    .select("id, whatsapp, timezone")
    .order("created_at")
    .limit(1)
    .maybeSingle();
  if (settings.error) throw new Error("Não foi possível carregar o funcionamento.");

  const timezone = settings.data?.timezone ?? "America/Fortaleza";
  const whatsapp = settings.data?.whatsapp ?? "";
  const date = todayInTimezone(timezone);

  const [hoursResult, menuResult] = await Promise.all([
    supabase
      .from("admin_business_hours")
      .select("day_of_week, is_open, opening_time, closing_time")
      .eq("settings_id", settings.data?.id ?? ""),
    supabase
      .from("daily_menus")
      .select("id")
      .eq("menu_date", date)
      .eq("status", "PUBLICADO")
      .maybeSingle(),
  ]);
  if (hoursResult.error) throw new Error("Não foi possível carregar os horários.");
  if (menuResult.error) throw new Error("Não foi possível carregar o cardápio.");

  const day = weekdayInTimezone(timezone);
  const configuredHour = (hoursResult.data ?? []).find((hour) => hour.day_of_week === day);
  const currentTime = currentTimeInTimezone(timezone).slice(0, 5);
  const isOpen = Boolean(
    configuredHour?.is_open
    && configuredHour.opening_time
    && configuredHour.closing_time
    && currentTime >= configuredHour.opening_time.slice(0, 5)
    && currentTime < configuredHour.closing_time.slice(0, 5),
  );

  const statusMessage = !configuredHour?.is_open
    ? "Fechado para pedidos hoje"
    : isOpen
      ? "Aberto para pedidos"
      : currentTime < (configuredHour.opening_time?.slice(0, 5) ?? "")
        ? "Abre mais tarde"
        : "Fechado para novos pedidos";

  if (!menuResult.data) {
    return {
      date,
      dateLabel: dateLabel(date, timezone),
      timezone,
      whatsapp,
      isOpen,
      statusMessage,
      categories: [],
    };
  }

  const itemsResult = await supabase
    .from("daily_menu_items")
    .select("dish_id, available")
    .eq("menu_id", menuResult.data.id);
  if (itemsResult.error) throw new Error("Não foi possível carregar os pratos do cardápio.");

  const dishIds = (itemsResult.data ?? []).map((item) => item.dish_id);
  if (dishIds.length === 0) {
    return {
      date,
      dateLabel: dateLabel(date, timezone),
      timezone,
      whatsapp,
      isOpen,
      statusMessage,
      categories: [],
    };
  }

  const [dishesResult, categoriesResult] = await Promise.all([
    supabase
      .from("dishes")
      .select("id, category_id, name, description, price, photo_url")
      .in("id", dishIds),
    supabase
      .from("categories")
      .select("id, name")
      .order("name"),
  ]);
  if (dishesResult.error) throw new Error("Não foi possível carregar os pratos.");
  if (categoriesResult.error) throw new Error("Não foi possível carregar as categorias.");

  const availability = new Map(
    (itemsResult.data ?? []).map((item) => [item.dish_id, item.available]),
  );
  const categoryNames = new Map(
    (categoriesResult.data ?? []).map((category) => [category.id, category.name]),
  );

  const publicDishes: PublicDish[] = (dishesResult.data ?? []).map((dish) => ({
    id: dish.id,
    categoryId: dish.category_id,
    categoryName: categoryNames.get(dish.category_id) ?? "Outros",
    name: dish.name,
    description: dish.description ?? "",
    price: Number(dish.price),
    photoUrl: dish.photo_url,
    available: availability.get(dish.id) ?? false,
  }));

  const categories = (categoriesResult.data ?? [])
    .map((category) => ({
      id: category.id,
      name: category.name,
      dishes: publicDishes.filter((dish) => dish.categoryId === category.id),
    }))
    .filter((category) => category.dishes.length > 0);

  return {
    date,
    dateLabel: dateLabel(date, timezone),
    timezone,
    whatsapp,
    isOpen,
    statusMessage,
    categories,
  };
}
