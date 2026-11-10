"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { categories as initialCategories, dishes as initialDishes, formatPrice, type Category, type Dish } from "@/src/prototyping/mock-data";
import { CATEGORIES_STORAGE_KEY, DISHES_STORAGE_KEY, readCatalog, writeCatalog } from "@/src/prototyping/catalog-storage";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

export default function NewDishPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [form, setForm] = useState({ name: "", description: "", price: "", categoryId: "", available: true });
  const [photo, setPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedDish, setSavedDish] = useState<Dish | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setCategories(readCatalog(CATEGORIES_STORAGE_KEY, initialCategories));
    });
  }, []);

  async function validatePhoto(file: File | null) {
    if (!file) return "A fotografia do prato é obrigatória.";
    if (!allowedTypes.includes(file.type)) return "A fotografia deve estar em JPEG, PNG ou WebP.";
    if (file.size > 1024 * 1024) return "A fotografia deve ter no máximo 1 MB.";
    try {
      const url = URL.createObjectURL(file);
      const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve({ width: image.width, height: image.height });
        image.onerror = () => reject(new Error("invalid-image"));
        image.src = url;
      });
      URL.revokeObjectURL(url);
      return dimensions.width < 600 || dimensions.height < 600 ? "A fotografia deve ter no mínimo 600 × 600 pixels." : null;
    } catch {
      return "Não foi possível validar o conteúdo da fotografia.";
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = "Informe o nome do prato.";
    const price = Number(form.price.replace(",", "."));
    if (!form.price || !Number.isFinite(price) || price <= 0) nextErrors.price = "Informe um preço maior que zero.";
    if (!form.categoryId || !categories.some((category) => category.id === form.categoryId)) nextErrors.categoryId = "Selecione uma categoria válida.";
    const photoError = await validatePhoto(photo);
    if (photoError) nextErrors.photo = photoError;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const dish: Dish = { id: `prato-${Date.now()}`, categoryId: form.categoryId, name: form.name.trim(), description: form.description.trim(), price, available: form.available, accent: "from-orange-700 to-amber-300" };
    const currentDishes = readCatalog(DISHES_STORAGE_KEY, initialDishes);
    writeCatalog(DISHES_STORAGE_KEY, [...currentDishes, dish]);
    setSavedDish(dish);
  }

  if (savedDish) {
    return <div className="rounded-3xl bg-white p-8 ring-1 ring-stone-200"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Operação concluída</p><h1 className="mt-2 text-3xl font-bold text-stone-900">Prato cadastrado com sucesso</h1><div className="mt-6 rounded-2xl bg-stone-50 p-5"><h2 className="text-xl font-bold text-stone-900">{savedDish.name}</h2><p className="mt-2 text-sm text-stone-600">{savedDish.description || "Sem descrição informada."}</p><p className="mt-3 font-semibold text-orange-700">{formatPrice(savedDish.price)}</p><p className="mt-1 text-sm text-stone-500">{categories.find((category) => category.id === savedDish.categoryId)?.name}</p></div><Link href="/prototipo/admin/pratos" className="mt-6 inline-block rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white">Voltar ao catálogo</Link></div>;
  }

  return <div><Link href="/prototipo/admin/pratos" className="text-sm font-semibold text-orange-700">← Voltar ao catálogo</Link><div className="mt-4"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">Catálogo</p><h1 className="mt-2 text-3xl font-bold text-stone-900">Novo prato</h1><p className="mt-2 text-stone-500">Cadastre os dados do prato para disponibilizá-lo nos cardápios.</p></div><form className="mt-8 max-w-2xl space-y-5 rounded-3xl bg-white p-6 ring-1 ring-stone-200" onSubmit={handleSubmit} noValidate>
    <label className="block text-sm font-semibold text-stone-700">Nome *<input className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />{errors.name && <span className="mt-1 block text-sm font-medium text-red-600">{errors.name}</span>}</label>
    <label className="block text-sm font-semibold text-stone-700">Descrição<textarea className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3" rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
    <div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-semibold text-stone-700">Preço (R$) *<input className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3" inputMode="decimal" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />{errors.price && <span className="mt-1 block text-sm font-medium text-red-600">{errors.price}</span>}</label><label className="block text-sm font-semibold text-stone-700">Categoria *<select className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3" value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}><option value="">Selecione</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>{errors.categoryId && <span className="mt-1 block text-sm font-medium text-red-600">{errors.categoryId}</span>}</label></div>
    <label className="block text-sm font-semibold text-stone-700">Fotografia *<input className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setPhoto(event.target.files?.[0] ?? null)} />{errors.photo && <span className="mt-1 block text-sm font-medium text-red-600">{errors.photo}</span>}<span className="mt-1 block text-xs font-normal text-stone-500">JPEG, PNG ou WebP; até 1 MB; mínimo de 600 × 600 px.</span></label>
    <label className="flex items-center gap-3 text-sm font-semibold text-stone-700"><input type="checkbox" checked={form.available} onChange={(event) => setForm({ ...form, available: event.target.checked })} />Disponível para os cardápios</label>
    <button type="submit" className="rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white">Salvar prato</button>
  </form></div>;
}
