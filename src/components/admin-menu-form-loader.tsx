"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { apiGetCategories, apiGetDishes, apiGetSettings, apiGetDailyMenu, ApiError } from "@/src/lib/api-client";
import { AdminMenuForm } from "@/src/components/admin-menu-form";
import type { Category, Dish } from "@/src/types/catalog";
import type { DailyMenu } from "@/src/types/menu";
import type { BusinessDay } from "@/src/types/settings";

type FormData = {
  categories: Category[];
  dishes: Dish[];
  openDays: BusinessDay[];
};

export function AdminMenuFormLoader({ menuId }: { menuId?: string }) {
  const [data, setData] = useState<FormData | null>(null);
  const [menu, setMenu] = useState<DailyMenu | null | undefined>(undefined);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const [categories, dishes, settings] = await Promise.all([
          apiGetCategories(),
          apiGetDishes(),
          apiGetSettings(),
        ]);
        
        const openDays = settings.business_hours
          .filter((hour: any) => hour.is_open)
          .map((hour: any) => hour.day_of_week) as BusinessDay[];
        
        setData({ categories, dishes, openDays });
        
        if (menuId) {
          try {
            const foundMenu = await apiGetDailyMenu(menuId);
            setMenu(foundMenu);
          } catch (err) {
            setMenu(null);
          }
        }
      } catch (err) {
        setError(
          err instanceof ApiError ? err.message : "Erro ao carregar formulário."
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [menuId]);

  if (loading) {
    return <p className="rounded-2xl bg-white p-6 text-stone-600">Carregando formulário...</p>;
  }

  if (error) {
    return <p className="rounded-2xl bg-red-50 p-6 text-red-600">{error}</p>;
  }

  if (!data) {
    return <p className="rounded-2xl bg-white p-6 text-stone-600">Sem dados disponíveis.</p>;
  }

  if (menuId && menu === null) {
    return notFound();
  }

  return (
    <AdminMenuForm
      categories={data.categories}
      dishes={data.dishes}
      menu={menu ?? undefined}
      openDays={data.openDays}
    />
  );
}
