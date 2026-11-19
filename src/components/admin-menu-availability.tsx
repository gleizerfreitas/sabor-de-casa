"use client";

import { useState } from "react";
import type { TodayMenuAvailabilityItem } from "@/src/server/services/menu-service";
import { setMenuAvailability } from "@/src/app-actions/menu";

export function AdminMenuAvailability({
  menuId,
  initialItems,
}: {
  menuId: string;
  initialItems: TodayMenuAvailabilityItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [savingDishId, setSavingDishId] = useState("");
  const [error, setError] = useState("");

  async function toggle(item: TodayMenuAvailabilityItem) {
    if (savingDishId) return;
    setSavingDishId(item.dish_id);
    setError("");
    const previousAvailable = item.available;
    setItems((current) => current.map((currentItem) => currentItem.dish_id === item.dish_id ? { ...currentItem, available: !previousAvailable } : currentItem));
    const result = await setMenuAvailability(menuId, item.dish_id, !previousAvailable);
    setSavingDishId("");
    if (!result.ok) {
      setItems((current) => current.map((currentItem) => currentItem.dish_id === item.dish_id ? { ...currentItem, available: previousAvailable } : currentItem));
      setError(result.error);
    }
  }

  const availableCount = items.filter((item) => item.available).length;
  const categories = items.reduce<Array<{
    id: string;
    name: string;
    items: TodayMenuAvailabilityItem[];
  }>>((groups, item) => {
    const currentGroup = groups[groups.length - 1];
    if (currentGroup?.id === item.category_id) {
      currentGroup.items.push(item);
    } else {
      groups.push({ id: item.category_id, name: item.category_name, items: [item] });
    }
    return groups;
  }, []);

  return (
    <div>
      {error && <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">{error}</div>}
      <section className="mt-8 overflow-hidden rounded-3xl bg-white ring-1 ring-stone-200">
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-5">
          <div><h2 className="font-bold text-stone-900">Pratos de hoje</h2><p className="mt-1 text-sm text-stone-500">A alteração é salva automaticamente e vale somente para este cardápio.</p></div>
          <span className="shrink-0 rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-600">{availableCount} de {items.length} disponíveis</span>
        </div>
        <div className="divide-y divide-stone-100">
          {categories.map((category) => (
            <section key={category.id} aria-labelledby={`availability-category-${category.id}`}>
              <h3 id={`availability-category-${category.id}`} className="bg-stone-50 px-6 py-3 text-sm font-bold text-stone-700">{category.name}</h3>
              <div className="divide-y divide-stone-100">
                {category.items.map((item) => (
                  <div className="flex items-center justify-between gap-4 px-6 py-5" key={item.dish_id}>
                    <div><p className="font-semibold text-stone-900">{item.name}</p><p className="mt-1 text-sm text-stone-500">{item.available ? "Disponível para pedidos" : "Esgotado"}</p></div>
                    <button type="button" role="switch" aria-checked={item.available} aria-label={`Marcar ${item.name} como ${item.available ? "esgotado" : "disponível"}`} disabled={savingDishId !== ""} onClick={() => toggle(item)} className={`relative h-8 w-14 shrink-0 rounded-full transition ${item.available ? "bg-emerald-500" : "bg-stone-300"} ${savingDishId === item.dish_id ? "opacity-60" : ""}`}>
                      <span className={`absolute top-1 size-6 rounded-full bg-white shadow transition ${item.available ? "left-7" : "left-1"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))}
          {items.length === 0 && <p className="px-6 py-8 text-sm text-stone-500">Este cardápio ainda não possui pratos.</p>}
        </div>
      </section>
    </div>
  );
}
