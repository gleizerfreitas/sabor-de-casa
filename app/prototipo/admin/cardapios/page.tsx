"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { dishes as initialDishes } from "@/src/prototyping/mock-data";
import { DISHES_STORAGE_KEY, readCatalog } from "@/src/prototyping/catalog-storage";
import { formatMenuDate, type DailyMenu, readMenus } from "@/src/prototyping/menu-storage";

export default function MenusPrototypePage() {
  const [menus, setMenus] = useState<DailyMenu[]>([]);
  const [dishes, setDishes] = useState(initialDishes);

  useEffect(() => {
    queueMicrotask(() => {
      setMenus(readMenus());
      setDishes(readCatalog(DISHES_STORAGE_KEY, initialDishes));
    });
  }, []);

  return <><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">Operação</p><h1 className="mt-2 text-3xl font-bold text-stone-900">Cardápios diários</h1><p className="mt-2 text-stone-500">Prepare e publique opções para cada data.</p></div><Link href="/prototipo/admin/cardapios/novo" className="rounded-xl bg-orange-600 px-4 py-3 text-center text-sm font-bold text-white">+ Novo cardápio</Link></div><div className="mt-8 grid gap-4">{menus.map((menu) => <article className="rounded-3xl bg-white p-6 ring-1 ring-stone-200" key={menu.id}><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><div className="flex items-center gap-3"><h2 className="text-lg font-bold text-stone-900">{formatMenuDate(menu.date)}</h2><span className={`rounded-full px-3 py-1 text-xs font-bold ${menu.status === "Publicado" ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-600"}`}>{menu.status}</span></div><p className="mt-2 text-sm text-stone-500">{menu.dishIds.length ? `${menu.dishIds.filter((id) => dishes.some((dish) => dish.id === id)).length} pratos selecionados` : "Nenhum prato selecionado"}</p></div><div className="flex flex-wrap gap-2"><Link href={`/prototipo/admin/cardapios/${menu.date}/disponibilidade`} className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white">Gerenciar disponibilidade</Link><Link href={`/prototipo/admin/cardapios/${menu.date}`} className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700">Editar</Link>{menu.status === "Rascunho" && <button className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white" type="button">Publicar</button>}</div></div></article>)}</div></>;
}
