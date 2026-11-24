"use client";

import { useEffect, useState } from "react";
import { apiGetCategories, apiGetDishes, ApiError } from "@/src/lib/api-client";
import { AdminCatalog } from "@/src/components/admin-catalog";
import type { CatalogData } from "@/src/types/catalog";

export function AdminCatalogLoader() {
  const [data, setData] = useState<CatalogData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const [categories, dishes] = await Promise.all([
          apiGetCategories(),
          apiGetDishes(),
        ]);
        setData({ categories, dishes });
      } catch (err) {
        setError(
          err instanceof ApiError ? err.message : "Erro ao carregar catálogo."
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <p className="rounded-2xl bg-white p-6 text-stone-600">Carregando catálogo...</p>;
  }

  if (error) {
    return <p className="rounded-2xl bg-red-50 p-6 text-red-600">{error}</p>;
  }

  if (!data) {
    return <p className="rounded-2xl bg-white p-6 text-stone-600">Sem dados disponíveis.</p>;
  }

  return <AdminCatalog data={data} />;
}
