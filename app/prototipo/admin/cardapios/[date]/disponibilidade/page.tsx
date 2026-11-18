"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { type Dish, dishes as initialDishes } from "@/src/prototyping/mock-data";
import { DISHES_STORAGE_KEY, readCatalog } from "@/src/prototyping/catalog-storage";
import {
  formatMenuDate,
  type DailyMenu,
  readMenus,
  updateMenuDishAvailability,
} from "@/src/prototyping/menu-storage";

function MenuAvailabilityContent() {
  const params = useParams<{ date: string }>();
  const [menu, setMenu] = useState<DailyMenu>();
  const [dishes, setDishes] = useState<Dish[]>(initialDishes);
  const [savingDishId, setSavingDishId] = useState<string>();
  const [error, setError] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      const currentDate = new Date();
      const today = [currentDate.getFullYear(), String(currentDate.getMonth() + 1).padStart(2, "0"), String(currentDate.getDate()).padStart(2, "0")].join("-");
      if (params.date !== today) {
        setError("A disponibilidade só pode ser gerenciada para o cardápio do dia.");
        return;
      }
      const currentMenu = readMenus().find((item) => item.date === params.date);
      setMenu(currentMenu);
      setDishes(readCatalog(DISHES_STORAGE_KEY, initialDishes));
    });
  }, [params.date]);

  function toggleAvailability(dishId: string) {
    if (!menu || savingDishId) return;
    const currentlyAvailable = !(menu.unavailableDishIds ?? []).includes(dishId);
    const nextUnavailableDishIds = currentlyAvailable
      ? [...(menu.unavailableDishIds ?? []), dishId]
      : (menu.unavailableDishIds ?? []).filter((id) => id !== dishId);

    setError("");
    setSavingDishId(dishId);
    setMenu({ ...menu, unavailableDishIds: nextUnavailableDishIds });
    try {
      updateMenuDishAvailability(menu.date, dishId, !currentlyAvailable);
    } catch {
      setMenu(menu);
      setError("Não foi possível atualizar a disponibilidade. Tente novamente.");
    } finally {
      setSavingDishId(undefined);
    }
  }

  if (!menu) {
    return <p className="rounded-2xl bg-white p-6 text-stone-600" role="alert">{error || "Cardápio não encontrado."}</p>;
  }

  const menuDishes = menu.dishIds
    .map((dishId) => dishes.find((dish) => dish.id === dishId))
    .filter((dish): dish is Dish => Boolean(dish));
  const availableCount = menuDishes.filter((dish) => !(menu.unavailableDishIds ?? []).includes(dish.id)).length;

  return <div>
    <Link href="/prototipo/admin" className="text-sm font-semibold text-orange-700">← Voltar à visão geral</Link>
    <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">Operação rápida</p><h1 className="mt-2 text-3xl font-bold text-stone-900">Gerenciar cardápio</h1><p className="mt-2 text-stone-500">{formatMenuDate(menu.date)} · marque os pratos esgotados para impedir novos pedidos.</p></div>
      <span className="rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-600">{availableCount} de {menuDishes.length} disponíveis</span>
    </div>
    {error && <div className="fixed bottom-5 right-5 z-50 max-w-sm rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 shadow-xl" role="alert">{error}</div>}
    <section className="mt-8 overflow-hidden rounded-3xl bg-white ring-1 ring-stone-200">
      <div className="border-b border-stone-100 px-6 py-5"><h2 className="font-bold text-stone-900">Pratos de hoje</h2><p className="mt-1 text-sm text-stone-500">A alteração é salva automaticamente e vale somente para este cardápio.</p></div>
      <div className="divide-y divide-stone-100">
        {menuDishes.map((dish) => {
          const available = !(menu.unavailableDishIds ?? []).includes(dish.id);
          const saving = savingDishId === dish.id;
          return <div className="flex items-center justify-between gap-4 px-6 py-5" key={dish.id}><div><p className="font-semibold text-stone-900">{dish.name}</p><p className="mt-1 text-sm text-stone-500">{available ? "Disponível para pedidos" : "Esgotado e oculto para pedidos"}</p></div><button type="button" role="switch" aria-checked={available} aria-label={`${available ? "Marcar" : "Tornar"} ${dish.name} como ${available ? "esgotado" : "disponível"}`} disabled={savingDishId !== undefined} onClick={() => toggleAvailability(dish.id)} className={`relative h-8 w-14 shrink-0 rounded-full transition ${available ? "bg-emerald-500" : "bg-stone-300"} ${saving ? "opacity-60" : ""}`}><span className={`absolute top-1 size-6 rounded-full bg-white shadow transition ${available ? "left-7" : "left-1"}`} /><span className="sr-only">{saving ? "Salvando" : available ? "Disponível" : "Esgotado"}</span></button></div>;
        })}
        {menuDishes.length === 0 && <p className="px-6 py-8 text-sm text-stone-500">Este cardápio ainda não possui pratos.</p>}
      </div>
    </section>
  </div>;
}

export default function MenuAvailabilityPage() {
  return <Suspense fallback={<p className="rounded-2xl bg-white p-6 text-stone-600">Carregando disponibilidade...</p>}><MenuAvailabilityContent /></Suspense>;
}
