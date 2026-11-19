"use client";

import Link from "next/link";
import { useState } from "react";
import type { CatalogData, Category, Dish } from "@/src/types/catalog";
import { removeCategory, removeDish, saveCategory } from "@/src/app-actions/catalog";

export function AdminCatalog({ data }: { data: CatalogData }) {
  const catalogRevision = JSON.stringify([
    data.categories.map(({ id, updated_at }) => [id, updated_at]),
    data.dishes.map(({ id, updated_at }) => [id, updated_at]),
  ]);
  return <AdminCatalogContent key={catalogRevision} data={data} />;
}

function AdminCatalogContent({ data }: { data: CatalogData }) {
  const [categories, setCategories] = useState(data.categories);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Category | "new" | null>(null);
  const [feedback, setFeedback] = useState("");
  const [dishes, setDishes] = useState(data.dishes);
  const visible = (category: Category) => dishes.filter((dish) => dish.category_id === category.id && dish.name.toLowerCase().includes(search.toLowerCase()));
  async function categorySubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await saveCategory(editing !== "new" && editing ? editing.id : null, new FormData(event.currentTarget));
    if (!result.ok) { setFeedback(result.error); return; }
    setCategories((current) => editing === "new" ? [...current, result.category] : current.map((item) => item.id === (editing as Category).id ? result.category : item));
    setEditing(null); setFeedback("Categoria salva com sucesso.");
  }
  async function remove(category: Category) {
    if (!window.confirm(`Excluir a categoria "${category.name}"?`)) return;
    const result = await removeCategory(category.id);
    setFeedback(result.ok ? "Categoria excluída com sucesso." : result.error);
    if (result.ok) setCategories((current) => current.filter((item) => item.id !== category.id));
  }
  async function removeSelectedDish(dish: Dish) {
    if (!window.confirm(`Excluir o prato "${dish.name}"?`)) return;
    const result = await removeDish(dish.id);
    setFeedback(result.ok ? "Prato excluído com sucesso." : result.error);
    if (result.ok) setDishes((current) => current.filter((item) => item.id !== dish.id));
  }
  return <div>
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">Catálogo</p><h1 className="mt-2 text-3xl font-bold text-stone-900">Pratos e categorias</h1><p className="mt-2 text-stone-500">Gerencie os pratos que podem entrar nos cardápios.</p></div><div className="flex flex-wrap gap-2"><button onClick={() => setEditing("new")} className="rounded-xl border border-orange-600 px-4 py-3 text-sm font-bold text-orange-700">+ Nova categoria</button><Link href="/admin/pratos/novo" className="rounded-xl bg-orange-600 px-4 py-3 text-sm font-bold text-white">+ Novo prato</Link></div></div>
    {feedback && <p role="status" className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{feedback}</p>}
    <div className="mt-8 overflow-hidden rounded-3xl bg-white ring-1 ring-stone-200">
      <div className="border-b border-stone-200 p-5">
        <input aria-label="Buscar prato" className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm" placeholder="Buscar prato..." value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>
      <div className="divide-y divide-stone-100">
        {categories.map((category) => (
          <section key={category.id} className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-900">{category.name}</h2>
              <div className="flex gap-3">
                <button className="text-sm font-semibold text-orange-700" onClick={() => setEditing(category)}>Editar</button>
                {!dishes.some((dish) => dish.category_id === category.id) && <button className="text-sm font-semibold text-red-600" onClick={() => remove(category)}>Excluir</button>}
              </div>
            </div>
            {visible(category).length ? (
              <div className="divide-y divide-stone-100">
                {visible(category).map((dish) => (
                  <div key={dish.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={dish.photo_url} alt="" className="size-12 rounded-xl object-cover" />
                      <div>
                        <p className="font-semibold">{dish.name}</p>
                        <p className="text-sm text-stone-500">R$ {dish.price.toFixed(2).replace(".", ",")} · {dish.is_active ? "Ativo" : "Inativo"}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Link href={`/admin/pratos/${dish.id}`} className="text-sm font-semibold text-orange-700">Editar</Link>
                      <button className="text-sm font-semibold text-red-600" onClick={() => removeSelectedDish(dish)}>Excluir</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-xl bg-stone-50 px-4 py-5 text-sm text-stone-500">{search ? "Nenhum prato encontrado para essa busca." : "Nenhum prato cadastrado nesta categoria."}</p>
            )}
          </section>
        ))}
      </div>
    </div>
    {editing && <div className="fixed inset-0 z-10 flex items-center justify-center bg-stone-950/40 px-5"><form onSubmit={categorySubmit} className="w-full max-w-md rounded-3xl bg-white p-6" role="dialog"><h2 className="text-xl font-bold">{editing === "new" ? "Nova categoria" : "Editar categoria"}</h2><input name="name" required defaultValue={editing === "new" ? "" : editing.name} autoFocus className="mt-5 w-full rounded-xl border border-stone-300 px-4 py-3" /><div className="mt-5 flex justify-end gap-3"><button type="button" onClick={() => setEditing(null)} className="rounded-xl border px-4 py-2">Cancelar</button><button className="rounded-xl bg-orange-600 px-4 py-2 font-bold text-white">Salvar</button></div></form></div>}
  </div>;
}
