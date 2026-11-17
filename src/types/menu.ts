export type MenuStatus = "RASCUNHO" | "PUBLICADO";

export type DailyMenu = {
  id: string;
  menu_date: string;
  status: MenuStatus;
  published_at: string | null;
  items: Array<{
    id: string;
    dish_id: string;
    available: boolean;
  }>;
};
