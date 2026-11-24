"use client";

import { useEffect, useState } from "react";
import { apiGetDailyMenus, ApiError } from "@/src/lib/api-client";
import { AdminMenuList } from "@/src/components/admin-menu-list";
import type { DailyMenu } from "@/src/types/menu";

type MenusListing = {
  activeMenus: DailyMenu[];
  pastMenuCount: number;
};

export function AdminMenusListLoader() {
  const [data, setData] = useState<MenusListing | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const result = await apiGetDailyMenus();
        setData(result);
      } catch (err) {
        setError(
          err instanceof ApiError ? err.message : "Erro ao carregar cardápios."
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <p className="rounded-2xl bg-white p-6 text-stone-600">Carregando cardápios...</p>;
  }

  if (error) {
    return <p className="rounded-2xl bg-red-50 p-6 text-red-600">{error}</p>;
  }

  if (!data) {
    return <p className="rounded-2xl bg-white p-6 text-stone-600">Sem dados disponíveis.</p>;
  }

  return (
    <AdminMenuList
      initialMenus={data.activeMenus}
      initialPastMenuCount={data.pastMenuCount}
    />
  );
}
