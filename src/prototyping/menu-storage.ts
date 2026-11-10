export type MenuStatus = "Rascunho" | "Publicado";

export type DailyMenu = {
  id: string;
  date: string;
  status: MenuStatus;
  dishIds: string[];
  unavailableDishIds?: string[];
};

export const MENUS_STORAGE_KEY = "sabor-de-casa:menus";

const initialMenus: DailyMenu[] = [
  { id: "cardapio-2026-11-12", date: "2026-11-12", status: "Publicado", dishIds: ["feijoada", "frango", "lasanha", "salada", "suco"] },
  { id: "cardapio-2026-11-13", date: "2026-11-13", status: "Rascunho", dishIds: ["feijoada", "frango", "lasanha", "salada"] },
  { id: "cardapio-2026-11-14", date: "2026-11-14", status: "Rascunho", dishIds: [] },
];

export function readMenus(): DailyMenu[] {
  if (typeof window === "undefined") return initialMenus;
  const stored = window.localStorage.getItem(MENUS_STORAGE_KEY);
  if (!stored) return initialMenus;
  try {
    return JSON.parse(stored) as DailyMenu[];
  } catch {
    return initialMenus;
  }
}

export function writeMenus(menus: DailyMenu[]) {
  window.localStorage.setItem(MENUS_STORAGE_KEY, JSON.stringify(menus));
}

export function updateMenuDishAvailability(date: string, dishId: string, available: boolean) {
  const menus = readMenus();
  const menu = menus.find((item) => item.date === date);
  if (!menu || !menu.dishIds.includes(dishId)) {
    throw new Error("O prato não pertence a este cardápio.");
  }

  const unavailableDishIds = new Set(menu.unavailableDishIds ?? []);
  if (available) {
    unavailableDishIds.delete(dishId);
  } else {
    unavailableDishIds.add(dishId);
  }

  writeMenus(menus.map((item) => item.id === menu.id
    ? { ...item, unavailableDishIds: [...unavailableDishIds] }
    : item));
}

export function formatMenuDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).replace(".", "");
}
