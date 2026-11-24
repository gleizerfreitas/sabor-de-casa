import type { Category, Dish } from "@/src/types/catalog";
import type { DailyMenu } from "@/src/types/menu";
import type { BusinessDay } from "@/src/types/settings";
import type { PublicMenu, PublicDish } from "@/src/types/public-menu";

export type AdminSettings = {
  id: string;
  owner_name: string;
  whatsapp: string;
  timezone: string;
  business_hours: Array<{
    day_of_week: BusinessDay;
    is_open: boolean;
    opening_time: string | null;
    closing_time: string | null;
  }>;
};

export type TodayMenuSummary = {
  ownerName: string;
  today: string;
  menu?: {
    id: string;
    status: "PUBLICADO" | "RASCUNHO";
    item_count: number;
  };
  upcomingMenus: Array<{
    id: string;
    menu_date: string;
    status: "PUBLICADO" | "RASCUNHO";
    item_count: number;
  }>;
};

export type TodayMenuAvailabilityItem = {
  dish_id: string;
  available: boolean;
  name: string;
  category_id: string;
  category_name: string;
};

export type TodayMenuAvailability = {
  menu: {
    id: string;
    menu_date: string;
  };
  items: TodayMenuAvailabilityItem[];
};

export type MenusListing = {
  activeMenus: DailyMenu[];
  pastMenuCount: number;
};

// Re-export public menu type from public-menu types
export type { PublicMenu, PublicDish };
