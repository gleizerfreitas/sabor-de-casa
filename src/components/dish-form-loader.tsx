"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { apiGetCategories, apiGetDishes, ApiError } from "@/src/lib/api-client";
import { DishForm } from "@/src/components/dish-form";
import type { Category, Dish } from "@/src/types/catalog";

export function DishFormLoader({ dishId }: { dishId?: string }) {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [dish, setDish] = useState<Dish | null | undefined>(undefined);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const [cats, dishes] = await Promise.all([
          apiGetCategories(),
          apiGetDishes(),
        ]);
        setCategories(cats);
        
        if (dishId) {
          const found = dishes.find((d: Dish) => d.id === dishId);
          if (!found) {
            setDish(null);
          } else {
            setDish(found);
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
  }, [dishId]);

  if (loading) {
    return <p className="rounded-2xl bg-white p-6 text-stone-600">Carregando formulário...</p>;
  }

  if (error) {
    return <p className="rounded-2xl bg-red-50 p-6 text-red-600">{error}</p>;
  }

  if (!categories) {
    return <p className="rounded-2xl bg-white p-6 text-stone-600">Sem categorias disponíveis.</p>;
  }

  if (dishId && dish === null) {
    return notFound();
  }

  return <DishForm categories={categories} dish={dish ?? undefined} />;
}
