"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  categories as initialCategories,
  dishes as initialDishes,
  formatPrice,
  type Category,
  type Dish,
} from "@/src/prototyping/mock-data";
import {
  CATEGORIES_STORAGE_KEY,
  DISHES_STORAGE_KEY,
  readCatalog,
  writeCatalog,
} from "@/src/prototyping/catalog-storage";
import { readMenus } from "@/src/prototyping/menu-storage";

type CategoryDialogProps = {
  category?: Category;
  onClose: () => void;
  onSave: (name: string) => string | null;
};

function CategoryDialog({ category, onClose, onSave }: CategoryDialogProps) {
  const [name, setName] = useState(category?.name ?? "");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const saveError = onSave(name);
    if (saveError) {
      setError(saveError);
      return;
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-stone-950/40 px-5" role="presentation">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl" role="dialog" aria-modal="true" aria-labelledby="category-dialog-title">
        <h2 id="category-dialog-title" className="text-xl font-bold text-stone-900">
          {category ? "Editar categoria" : "Nova categoria"}
        </h2>
        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-stone-700">
            Nome da categoria
            <input
              autoFocus
              className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-orange-500"
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-invalid={Boolean(error)}
            />
          </label>
          {error && <p className="text-sm font-medium text-red-600" role="alert">{error}</p>}
          <div className="flex justify-end gap-3">
            <button type="button" className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700" onClick={onClose}>Cancelar</button>
            <button type="submit" className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-bold text-white">Salvar categoria</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DishesPrototypePage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [dishes, setDishes] = useState<Dish[]>(initialDishes);
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState<Category | "new" | null>(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      setCategories(readCatalog(CATEGORIES_STORAGE_KEY, initialCategories));
      setDishes(readCatalog(DISHES_STORAGE_KEY, initialDishes));
    });
  }, []);

  const groupedCategories = useMemo(
    () => categories.map((category) => ({
      category,
      dishes: dishes.filter((dish) => dish.categoryId === category.id && dish.name.toLowerCase().includes(search.toLowerCase())),
    })),
    [categories, dishes, search],
  );

  function saveCategory(name: string) {
    const cleanName = name.trim();
    if (!cleanName) return "Informe o nome da categoria.";
    if (categories.some((item) => item.name.toLowerCase() === cleanName.toLowerCase() && item.id !== (dialog !== "new" && dialog ? dialog.id : ""))) {
      return "Já existe uma categoria com esse nome.";
    }

    const nextCategories = dialog !== "new" && dialog
      ? categories.map((item) => item.id === dialog.id ? { ...item, name: cleanName } : item)
      : [...categories, { id: `${cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`, name: cleanName }];
    setCategories(nextCategories);
    writeCatalog(CATEGORIES_STORAGE_KEY, nextCategories);
    setFeedback(dialog !== "new" && dialog ? "Categoria atualizada com sucesso." : "Categoria criada com sucesso.");
    return null;
  }

  function deleteCategory(category: Category) {
    if (dishes.some((dish) => dish.categoryId === category.id)) {
      setFeedback("Não é possível excluir uma categoria que possui pratos.");
      return;
    }
    if (!window.confirm(`Excluir a categoria "${category.name}"?`)) return;
    const nextCategories = categories.filter((item) => item.id !== category.id);
    setCategories(nextCategories);
    writeCatalog(CATEGORIES_STORAGE_KEY, nextCategories);
    setFeedback("Categoria excluída com sucesso.");
  }

  function deleteDish(dish: Dish) {
    if (readMenus().some((menu) => menu.dishIds.includes(dish.id))) {
      setFeedback("Não é possível excluir um prato associado a cardápios.");
      return;
    }
    if (!window.confirm(`Excluir o prato "${dish.name}"?`)) return;
    const nextDishes = dishes.filter((item) => item.id !== dish.id);
    setDishes(nextDishes);
    writeCatalog(DISHES_STORAGE_KEY, nextDishes);
    setFeedback("Prato excluído com sucesso.");
  }

  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">Catálogo</p><h1 className="mt-2 text-3xl font-bold text-stone-900">Pratos e categorias</h1><p className="mt-2 text-stone-500">Gerencie os pratos que podem entrar nos cardápios.</p></div>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-xl border border-orange-600 px-4 py-3 text-sm font-bold text-orange-700" onClick={() => setDialog("new")}>+ Nova categoria</button>
          <Link href="/prototipo/admin/pratos/novo" className="rounded-xl bg-orange-600 px-4 py-3 text-sm font-bold text-white">+ Novo prato</Link>
        </div>
      </div>
      {feedback && <div className="mt-5 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700" role="status"><span>{feedback}</span><button aria-label="Fechar mensagem" onClick={() => setFeedback("")}>×</button></div>}
      <div className="mt-8 overflow-hidden rounded-3xl bg-white ring-1 ring-stone-200">
        <div className="border-b border-stone-200 p-5"><input className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm" placeholder="Buscar prato..." value={search} onChange={(event) => setSearch(event.target.value)} /></div>
        <div className="divide-y divide-stone-100">
          {groupedCategories.map(({ category, dishes: categoryDishes }) => <section key={category.id} className="p-5">
            <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-lg font-bold text-stone-900">{category.name}</h2><div className="flex gap-3"><button className="text-sm font-semibold text-orange-700" onClick={() => setDialog(category)}>Editar</button>{!dishes.some((dish) => dish.categoryId === category.id) && <button className="text-sm font-semibold text-red-600" onClick={() => deleteCategory(category)}>Excluir</button>}</div></div>
            {categoryDishes.length === 0 ? <p className="rounded-xl bg-stone-50 px-4 py-5 text-sm text-stone-500">Nenhum prato cadastrado nesta categoria.</p> : <div className="divide-y divide-stone-100">{categoryDishes.map((dish) => <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0" key={dish.id}><div className="flex items-center gap-4"><div className={`size-12 rounded-xl bg-gradient-to-br ${dish.accent}`} /><div><p className="font-semibold text-stone-900">{dish.name}</p><p className="text-sm text-stone-500">{formatPrice(dish.price)} · {dish.available ? "Ativo" : "Indisponível"}</p></div></div><div className="flex gap-3"><button className="text-sm font-semibold text-orange-700">Editar</button><button className="text-sm font-semibold text-red-600" onClick={() => deleteDish(dish)}>Excluir</button></div></div>)}</div>}
          </section>)}
        </div>
      </div>
      {dialog && <CategoryDialog category={dialog === "new" ? undefined : dialog} onClose={() => setDialog(null)} onSave={saveCategory} />}
    </>
  );
}
