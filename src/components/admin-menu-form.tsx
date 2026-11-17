"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Category, Dish } from "@/src/types/catalog";
import type { DailyMenu } from "@/src/types/menu";
import type { BusinessDay } from "@/src/types/settings";
import { saveMenu } from "@/src/app-actions/menu";

function todayIso() {
  const date = new Date();
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

export function AdminMenuForm({
  categories,
  dishes,
  menu,
  openDays,
}: {
  categories: Category[];
  dishes: Dish[];
  menu?: DailyMenu;
  openDays: BusinessDay[];
}) {
  const pathname = usePathname();
  return <AdminMenuFormState key={pathname} categories={categories} dishes={dishes} menu={menu} openDays={openDays} />;
}

function AdminMenuFormState({
  categories,
  dishes,
  menu,
  openDays,
}: {
  categories: Category[];
  dishes: Dish[];
  menu?: DailyMenu;
  openDays: BusinessDay[];
}) {
  const [date, setDate] = useState(menu?.menu_date ?? "");
  const [selectedDishIds, setSelectedDishIds] = useState<string[]>(menu?.items.map((item) => item.dish_id) ?? []);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [minimumDate, setMinimumDate] = useState("");
  const selected = useMemo(() => new Set(selectedDishIds), [selectedDishIds]);
  const openDaySet = useMemo(() => new Set(openDays), [openDays]);

  useEffect(() => {
    queueMicrotask(() => setMinimumDate(todayIso()));
  }, []);

  const groupedDishes = useMemo(
    () => categories
      .map((category) => ({
        category,
        dishes: dishes.filter((dish) => dish.category_id === category.id && (dish.is_active || selected.has(dish.id))),
      }))
      .filter(({ dishes: categoryDishes }) => categoryDishes.length > 0),
    [categories, dishes, selected],
  );

  function toggleDish(dishId: string) {
    setSelectedDishIds((current) => current.includes(dishId)
      ? current.filter((id) => id !== dishId)
      : [...current, dishId]);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!date) {
      setError("Informe a data do cardápio.");
      return;
    }
    const weekday = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][new Date(`${date}T12:00:00Z`).getUTCDay()] as BusinessDay;
    if (!openDaySet.has(weekday)) {
      setError("A data escolhida está em um dia sem funcionamento configurado.");
      return;
    }
    const result = await saveMenu(menu?.id ?? null, new FormData(event.currentTarget));
    if (!result.ok) setError(result.error);
    else setSaved(true);
  }

  if (saved) {
    return (
      <div className="rounded-3xl bg-white p-8 ring-1 ring-stone-200" role="status">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Operação concluída</p>
        <h1 className="mt-2 text-3xl font-bold text-stone-900">Cardápio salvo com sucesso</h1>
        <p className="mt-3 text-stone-600">O cardápio foi salvo como rascunho e ainda não está disponível para os clientes.</p>
        <Link href="/admin/cardapios" className="mt-6 inline-block rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white">Voltar aos cardápios</Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/admin/cardapios" className="text-sm font-semibold text-orange-700">← Voltar aos cardápios</Link>
      <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">Operação</p>
      <h1 className="mt-2 text-3xl font-bold text-stone-900">{menu ? "Editar cardápio" : "Novo cardápio"}</h1>
      <p className="mt-2 text-stone-500">Escolha a data e os pratos que serão oferecidos nesse dia.</p>

      <form className="mt-8 space-y-6" onSubmit={submit} noValidate>
        <section className="rounded-3xl bg-white p-6 ring-1 ring-stone-200">
          <label className="block max-w-sm text-sm font-semibold text-stone-700">
            Data do cardápio *
            <input name="date" type="date" min={minimumDate} required value={date} onChange={(event) => setDate(event.target.value)} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-orange-500" />
          </label>
          <p className="mt-2 text-xs text-stone-500">A data não pode ser passada, só pode ter um cardápio e deve corresponder a um dia de funcionamento.</p>
        </section>

        <section className="rounded-3xl bg-white p-6 ring-1 ring-stone-200">
          <div className="flex items-end justify-between gap-3">
            <div><h2 className="text-xl font-bold text-stone-900">Pratos do catálogo</h2><p className="mt-1 text-sm text-stone-500">{selectedDishIds.length} selecionado(s)</p></div>
          </div>
          <div className="mt-6 space-y-6">
            {groupedDishes.map(({ category, dishes: categoryDishes }) => (
              <fieldset key={category.id}>
                <legend className="mb-3 text-base font-bold text-stone-800">{category.name}</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {categoryDishes.map((dish) => (
                    <label key={dish.id} className={`flex items-center gap-3 rounded-2xl border p-4 ${selected.has(dish.id) ? "border-orange-500 bg-orange-50" : "border-stone-200"}`}>
                      <input name="dishIds" value={dish.id} type="checkbox" checked={selected.has(dish.id)} onChange={() => toggleDish(dish.id)} className="size-4 accent-orange-600" />
                      <span>
                        <span className="block font-semibold text-stone-900">{dish.name}</span>
                        <span className="block text-sm text-stone-500">{dish.description || "Sem descrição informada."}{!dish.is_active && <span className="ml-2 font-semibold text-amber-700">Inativo</span>}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
            {groupedDishes.length === 0 && <p className="rounded-xl bg-stone-50 px-4 py-5 text-sm text-stone-500">Cadastre pratos ativos no catálogo antes de criar um cardápio.</p>}
          </div>
          {error && <p className="mt-4 text-sm font-medium text-red-600" role="alert">{error}</p>}
        </section>

        <div className="flex flex-wrap justify-end gap-3">
          <Link href="/admin/cardapios" className="rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700">Cancelar</Link>
          <button type="submit" className="rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white">Salvar como rascunho</button>
        </div>
      </form>
    </div>
  );
}
