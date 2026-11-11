"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { categories as initialCategories, dishes as initialDishes, type Category, type Dish } from "@/src/prototyping/mock-data";
import { CATEGORIES_STORAGE_KEY, DISHES_STORAGE_KEY, readCatalog } from "@/src/prototyping/catalog-storage";
import { type DailyMenu, readMenus, writeMenus } from "@/src/prototyping/menu-storage";

type MenuFormProps = { menu?: DailyMenu };

function todayIso() {
  const date = new Date();
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

export function MenuForm({ menu }: MenuFormProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [dishes, setDishes] = useState<Dish[]>(initialDishes);
  const [date, setDate] = useState(menu?.date ?? "");
  const [selectedDishIds, setSelectedDishIds] = useState<string[]>(menu?.dishIds ?? []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [minimumDate, setMinimumDate] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      setMinimumDate(todayIso());
      setCategories(readCatalog(CATEGORIES_STORAGE_KEY, initialCategories));
      setDishes(readCatalog(DISHES_STORAGE_KEY, initialDishes));
    });
  }, []);

  const groupedDishes = useMemo(
    () => categories.map((category) => ({
      category,
      dishes: dishes.filter((dish) => dish.categoryId === category.id),
    })).filter(({ dishes: categoryDishes }) => categoryDishes.length > 0),
    [categories, dishes],
  );

  function toggleDish(dishId: string) {
    setSelectedDishIds((current) => current.includes(dishId)
      ? current.filter((id) => id !== dishId)
      : [...current, dishId]);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const menus = readMenus();
    const nextErrors: Record<string, string> = {};
    if (!date) nextErrors.date = "Informe a data do cardápio.";
    if (date && date < todayIso()) nextErrors.date = "Escolha uma data de hoje ou futura.";
    if (menus.some((item) => item.date === date && item.id !== menu?.id)) nextErrors.date = "Já existe um cardápio para essa data.";
    if (selectedDishIds.length === 0) nextErrors.dishes = "Selecione pelo menos um prato.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const savedMenu: DailyMenu = {
      id: menu?.id ?? `cardapio-${date}`,
      date,
      status: "Rascunho",
      dishIds: selectedDishIds,
      unavailableDishIds: menu?.unavailableDishIds?.filter((dishId) => selectedDishIds.includes(dishId)) ?? [],
    };
    writeMenus(menu ? menus.map((item) => item.id === menu.id ? savedMenu : item) : [...menus, savedMenu]);
    setSaved(true);
  }

  if (saved) {
    return <div className="rounded-3xl bg-white p-8 ring-1 ring-stone-200" role="status">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Operação concluída</p>
      <h1 className="mt-2 text-3xl font-bold text-stone-900">Cardápio salvo com sucesso</h1>
      <p className="mt-3 text-stone-600">O cardápio foi salvo como rascunho e ainda não está disponível para os clientes.</p>
      <Link href="/prototipo/admin/cardapios" className="mt-6 inline-block rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white">Voltar aos cardápios</Link>
    </div>;
  }

  return <div>
    <Link href="/prototipo/admin/cardapios" className="text-sm font-semibold text-orange-700">← Voltar aos cardápios</Link>
    <div className="mt-4"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">Operação</p><h1 className="mt-2 text-3xl font-bold text-stone-900">{menu ? "Editar cardápio" : "Novo cardápio"}</h1><p className="mt-2 text-stone-500">Escolha a data e os pratos que serão oferecidos nesse dia.</p></div>
    <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
      <section className="rounded-3xl bg-white p-6 ring-1 ring-stone-200">
        <label className="block max-w-sm text-sm font-semibold text-stone-700">Data do cardápio *
          <input type="date" min={minimumDate} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-orange-500" value={date} onChange={(event) => setDate(event.target.value)} aria-invalid={Boolean(errors.date)} />
        </label>
        <p className="mt-2 text-xs text-stone-500">A data não pode ser passada e só pode ter um cardápio.</p>
        {errors.date && <p className="mt-1 text-sm font-medium text-red-600" role="alert">{errors.date}</p>}
      </section>
      <section className="rounded-3xl bg-white p-6 ring-1 ring-stone-200">
        <div className="flex items-end justify-between gap-3"><div><h2 className="text-xl font-bold text-stone-900">Pratos do catálogo</h2><p className="mt-1 text-sm text-stone-500">{selectedDishIds.length} selecionado(s)</p></div></div>
        <div className="mt-6 space-y-6">
          {groupedDishes.map(({ category, dishes: categoryDishes }) => <fieldset key={category.id}><legend className="mb-3 text-base font-bold text-stone-800">{category.name}</legend><div className="grid gap-3 sm:grid-cols-2">{categoryDishes.map((dish) => <label key={dish.id} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 ${selectedDishIds.includes(dish.id) ? "border-orange-500 bg-orange-50" : "border-stone-200"}`}><input type="checkbox" checked={selectedDishIds.includes(dish.id)} onChange={() => toggleDish(dish.id)} className="size-4 accent-orange-600" /><span><span className="block font-semibold text-stone-900">{dish.name}</span><span className="block text-sm text-stone-500">{dish.description || "Sem descrição informada."}</span></span></label>)}</div></fieldset>)}
          {groupedDishes.length === 0 && <p className="rounded-xl bg-stone-50 px-4 py-5 text-sm text-stone-500">Cadastre pratos no catálogo antes de criar um cardápio.</p>}
        </div>
        {errors.dishes && <p className="mt-4 text-sm font-medium text-red-600" role="alert">{errors.dishes}</p>}
      </section>
      <div className="flex flex-wrap justify-end gap-3"><Link href="/prototipo/admin/cardapios" className="rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700">Cancelar</Link><button type="submit" className="rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white">Salvar como rascunho</button></div>
    </form>
  </div>;
}

export default function NewMenuPage() {
  return <MenuForm />;
}
