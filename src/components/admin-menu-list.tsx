"use client";

import Link from "next/link";
import { useState } from "react";
import type { DailyMenu } from "@/src/types/menu";
import { AdminMenuActions } from "@/src/components/admin-menu-actions";
import { apiRemovePastMenus, ApiError } from "@/src/lib/api-client";

function formatMenuDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`)).replace(".", "");
}

export function AdminMenuList({ initialMenus, initialPastMenuCount }: { initialMenus: DailyMenu[]; initialPastMenuCount: number }) {
  const [menus, setMenus] = useState(initialMenus);
  const [pastMenuCount, setPastMenuCount] = useState(initialPastMenuCount);
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);


  function updateMenu(id: string, changes: Partial<DailyMenu>) {
    setMenus((current) => current.map((menu) => menu.id === id ? { ...menu, ...changes } : menu));
  }

  function removeMenu(id: string) {
    setMenus((current) => current.filter((menu) => menu.id !== id));
  }

  async function removePast() {
    if (!window.confirm(`Excluir os ${pastMenuCount} cardápios passados? Essa operação não pode ser desfeita.`)) return;
    setWorking(true);
    setError("");
    try {
      await apiRemovePastMenus();
      setPastMenuCount(0);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Não foi possível excluir os cardápios passados."
      );
    } finally {
      setWorking(false);
    }
  }

  return (
    <><div className="mt-8 grid gap-4">
      {menus.map((menu) => (
        <article className="rounded-3xl bg-white p-6 ring-1 ring-stone-200" key={menu.id}>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-bold text-stone-900">{formatMenuDate(menu.menu_date)}</h2>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${menu.status === "PUBLICADO" ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-600"}`}>
                  {menu.status === "PUBLICADO" ? "Publicado" : "Rascunho"}
                </span>
              </div>
              <p className="mt-2 text-sm text-stone-500">{menu.items.length ? `${menu.items.length} pratos selecionados` : "Nenhum prato selecionado"}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href={`/admin/cardapios/${menu.id}`} className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700">Editar</Link>
              {menu.status === "RASCUNHO" && (
                <AdminMenuActions
                  id={menu.id}
                  onPublished={() => updateMenu(menu.id, { status: "PUBLICADO", published_at: new Date().toISOString() })}
                  onRemoved={() => removeMenu(menu.id)}
                />
              )}
              {menu.status === "PUBLICADO" && (
                <AdminMenuActions
                  id={menu.id}
                  onRemoved={() => removeMenu(menu.id)}
                />
              )}
            </div>
          </div>
        </article>
      ))}
      {menus.length === 0 && <p className="rounded-2xl bg-white p-6 text-stone-600">Nenhum cardápio cadastrado.</p>}
    </div>
    <section className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-sm font-bold uppercase tracking-[0.12em] text-amber-700">Cardápios passados</p><h2 className="mt-2 text-xl font-bold text-stone-900">{pastMenuCount} {pastMenuCount === 1 ? "cardápio passado" : "cardápios passados"}</h2><p className="mt-1 text-sm text-stone-600">Os cardápios anteriores não aparecem na listagem principal.</p></div><button type="button" disabled={working || pastMenuCount === 0} onClick={removePast} className="rounded-xl border border-red-300 bg-white px-4 py-3 text-sm font-bold text-red-700 disabled:cursor-not-allowed disabled:opacity-50">Excluir cardápios passados</button></div>{error && <p role="alert" className="mt-3 text-sm font-semibold text-red-700">{error}</p>}</section></>
  );
}
