"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Category, Dish } from "@/src/types/catalog";
import { apiCreateDish, apiUpdateDish, ApiError } from "@/src/lib/api-client";

export function DishForm({ categories, dish }: { categories: Category[]; dish?: Dish }) {
  const pathname = usePathname();
  return <DishFormState key={pathname} categories={categories} dish={dish} />;
}

function DishFormState({ categories, dish }: { categories: Category[]; dish?: Dish }) {
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const formData = new FormData(event.currentTarget);
      formData.set("isActive", formData.get("isActive") ? "true" : "false");

      if (dish) {
        await apiUpdateDish(dish.id, formData);
      } else {
        await apiCreateDish(formData);
      }

      setSaved(true);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Não foi possível salvar o prato."
      );
    } finally {
      setSaving(false);
    }
  }

  if (saved) {
    return (
      <div className="rounded-3xl bg-white p-8 ring-1 ring-stone-200">
        <p className="font-semibold text-emerald-700">Prato salvo com sucesso.</p>
        <Link className="mt-5 inline-block rounded-xl bg-orange-600 px-5 py-3 font-bold text-white" href="/admin/catalogo">
          Voltar ao catálogo
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/admin/catalogo" className="text-sm font-semibold text-orange-700">
        ← Voltar ao catálogo
      </Link>
      <h1 className="mt-4 text-3xl font-bold">{dish ? "Editar prato" : "Novo prato"}</h1>
      <form onSubmit={submit} className="mt-8 max-w-2xl space-y-5 rounded-3xl bg-white p-6 ring-1 ring-stone-200">
        <label className="block text-sm font-semibold">
          Nome *
          <input name="name" required defaultValue={dish?.name} className="mt-2 w-full rounded-xl border px-4 py-3" />
        </label>
        <label className="block text-sm font-semibold">
          Descrição
          <textarea
            name="description"
            defaultValue={dish?.description}
            className="mt-2 w-full rounded-xl border px-4 py-3"
            rows={3}
          />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold">
            Preço (R$) *
            <input
              name="price"
              required
              type="number"
              step="0.01"
              min="0.01"
              defaultValue={dish?.price}
              className="mt-2 w-full rounded-xl border px-4 py-3"
            />
          </label>
          <label className="block text-sm font-semibold">
            Categoria *
            <select
              name="categoryId"
              required
              defaultValue={dish?.category_id ?? ""}
              className="mt-2 w-full rounded-xl border px-4 py-3"
            >
              <option value="">Selecione</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block text-sm font-semibold">
          Fotografia {dish ? "(opcional para manter a atual)" : "*"}
          <input
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required={!dish}
            className="mt-2 w-full rounded-xl border px-4 py-3 text-sm"
          />
          <span className="mt-1 block text-xs font-normal text-stone-500">
            JPEG, PNG ou WebP; até 1 MB; mínimo de 600 × 600 px.
          </span>
        </label>
        <label className="flex gap-2">
          <input name="isActive" type="checkbox" defaultChecked={dish?.is_active ?? true} /> Ativo
        </label>
        {error && (
          <p role="alert" className="text-sm font-semibold text-red-600">
            {error}
          </p>
        )}
        <button disabled={saving} className="rounded-xl bg-orange-600 px-5 py-3 font-bold text-white disabled:opacity-60">
          {saving ? "Salvando..." : "Salvar prato"}
        </button>
      </form>
    </div>
  );
}
