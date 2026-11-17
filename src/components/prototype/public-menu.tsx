"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DishCard } from "@/src/components/prototype/dish-card";
import {
  categories,
  dishes,
  formatPrice,
  menuDate,
  serializeOrder,
  menuDateIso,
} from "@/src/prototyping/mock-data";
import { DISHES_STORAGE_KEY, readCatalog } from "@/src/prototyping/catalog-storage";
import { readMenus } from "@/src/prototyping/menu-storage";

export function PublicMenu() {
  const [menuDishes, setMenuDishes] = useState(dishes);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  useEffect(() => {
    queueMicrotask(() => {
      const catalog = readCatalog(DISHES_STORAGE_KEY, dishes);
      const menu = readMenus().find((item) => item.date === menuDateIso);
      if (!menu) return;
      const unavailableDishIds = new Set(menu.unavailableDishIds ?? []);
      setMenuDishes(menu.dishIds
        .map((dishId) => catalog.find((dish) => dish.id === dishId))
        .filter((dish): dish is (typeof dishes)[number] => Boolean(dish))
        .map((dish) => ({ ...dish, available: !unavailableDishIds.has(dish.id) })));
    });
  }, []);
  const selected = useMemo(() => menuDishes.filter((dish) => (quantities[dish.id] ?? 0) > 0), [menuDishes, quantities]);
  const total = selected.reduce((sum, dish) => sum + dish.price * (quantities[dish.id] ?? 0), 0);

  return (
    <>
      <section className="rounded-3xl bg-stone-900 px-6 py-8 text-white sm:px-10 sm:py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-300">Cardápio de hoje</p>
        <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><h1 className="text-3xl font-bold sm:text-4xl">{menuDate}</h1><p className="mt-2 text-stone-300">Escolha seus pratos e envie pelo WhatsApp.</p></div>
          <span className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-300">Aberto para pedidos</span>
        </div>
      </section>
      <div className="mt-8 space-y-9">
        {categories.map((category) => {
          const categoryDishes = menuDishes.filter((dish) => dish.categoryId === category.id);
          if (!categoryDishes.length) return null;
          return <section key={category.id}><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold text-stone-900">{category.name}</h2><span className="text-sm text-stone-500">{categoryDishes.length} opções</span></div><div className="grid gap-4 sm:grid-cols-2">{categoryDishes.map((dish) => <DishCard key={dish.id} dish={dish} quantity={quantities[dish.id] ?? 0} onChange={(quantity) => setQuantities((current) => ({ ...current, [dish.id]: quantity }))} />)}</div></section>;
        })}
      </div>
      {selected.length > 0 && <div className="sticky bottom-4 mt-8 flex items-center justify-between gap-4 rounded-2xl bg-orange-600 p-4 text-white shadow-xl"><div><p className="text-sm text-orange-100">{selected.reduce((sum, dish) => sum + (quantities[dish.id] ?? 0), 0)} itens selecionados</p><strong>{formatPrice(total)}</strong></div><Link href={`/prototipo/publico/pedido?itens=${encodeURIComponent(serializeOrder(quantities))}`} className="rounded-xl bg-white px-4 py-3 text-sm font-bold text-orange-700">Revisar pedido</Link></div>}
    </>
  );
}
