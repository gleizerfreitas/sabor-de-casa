"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiGetTodayMenuSummary, ApiError } from "@/src/lib/api-client";
import { AdminTodayMenuActions } from "@/src/components/admin-today-menu-actions";

type TodayMenuSummary = {
  ownerName: string;
  today: string;
  menu?: {
    id: string;
    status: "PUBLICADO" | "RASCUNHO";
    item_count: number;
  };
  upcomingMenus: Array<{
    id: string;
    menu_date: string;
    status: "PUBLICADO" | "RASCUNHO";
    item_count: number;
  }>;
};

function formatMenuDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}

function formatTodayDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}

function DashboardIcon({ name }: { name: "catalog" | "menus" }) {
  const paths = {
    catalog: <><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-13Z" /><path d="M8 8h8M8 12h8M8 16h4" /></>,
    menus: <><path d="M5 4v16M19 4v16M5 7h14M5 17h14" /><path d="M9 10h6M9 14h6" /></>,
  };
  return <svg aria-hidden="true" className="size-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">{paths[name]}</svg>;
}

export function AdminDashboardLoader() {
  const [data, setData] = useState<TodayMenuSummary | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const summary = await apiGetTodayMenuSummary();
        setData(summary);
      } catch (err) {
        setError(
          err instanceof ApiError ? err.message : "Erro ao carregar visão geral."
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <p className="rounded-2xl bg-white p-6 text-stone-600">Carregando visão geral...</p>;
  }

  if (error) {
    return <p className="rounded-2xl bg-red-50 p-6 text-red-600">{error}</p>;
  }

  if (!data) {
    return <p className="rounded-2xl bg-white p-6 text-stone-600">Sem dados disponíveis.</p>;
  }

  const greeting = data.ownerName ? `Bom dia, ${data.ownerName}` : "Visão geral";

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">Visão geral</p>
      <h1 className="mt-2 text-3xl font-bold text-stone-900">{greeting}</h1>
      <p className="mt-2 text-stone-500">Acompanhe o cardápio do dia e acesse rapidamente as operações da Sabor de Casa.</p>

      <section className="mt-8 rounded-3xl bg-orange-600 p-6 text-white">
        <p className="text-sm text-orange-100">Cardápio de hoje · {formatTodayDate(data.today)}</p>
        {data.menu ? (
          <>
            <h2 className="mt-1 text-2xl font-bold">{data.menu.status === "PUBLICADO" ? "Publicado" : "Em preparação"}</h2>
            <p className="mt-1 text-sm text-orange-100">{data.menu.item_count} {data.menu.item_count === 1 ? "item selecionado" : "itens selecionados"}</p>
            <AdminTodayMenuActions menuId={data.menu.id} status={data.menu.status} />
          </>
        ) : (
          <>
            <h2 className="mt-1 text-2xl font-bold">Nenhum cardápio cadastrado</h2>
            <p className="mt-2 text-sm text-orange-100">Prepare o cardápio de hoje para definir as opções oferecidas.</p>
            <Link href="/admin/cardapios/novo" className="mt-5 inline-block rounded-xl bg-white px-4 py-3 text-center text-sm font-bold text-orange-700">Criar cardápio</Link>
          </>
        )}
      </section>

      <section className="mt-8 rounded-3xl bg-white p-6 ring-1 ring-stone-200">
        <h2 className="text-xl font-bold text-stone-900">Ações rápidas</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link href="/admin/catalogo" className="flex items-center gap-3 rounded-2xl border border-stone-200 p-4 font-semibold text-stone-800 hover:border-orange-500"><span className="rounded-xl bg-orange-100 p-3 text-orange-700"><DashboardIcon name="catalog" /></span><span>Acessar catálogo</span></Link>
          <Link href="/admin/cardapios" className="flex items-center gap-3 rounded-2xl border border-stone-200 p-4 font-semibold text-stone-800 hover:border-orange-500"><span className="rounded-xl bg-orange-100 p-3 text-orange-700"><DashboardIcon name="menus" /></span><span>Consultar cardápios diários</span></Link>
        </div>
      </section>
      <section className="mt-8 rounded-3xl bg-white p-6 ring-1 ring-stone-200">
        <div className="flex items-center justify-between gap-4"><div><h2 className="text-xl font-bold text-stone-900">Próximos cardápios</h2><p className="mt-1 text-sm text-stone-500">Acompanhe os cardápios preparados para os próximos dias.</p></div><Link href="/admin/cardapios" className="text-sm font-semibold text-orange-700">Ver todos</Link></div>
        <div className="mt-4 divide-y divide-stone-100">
          {data.upcomingMenus.map((menu) => <div className="flex items-center justify-between gap-4 py-4" key={menu.id}><div><p className="font-semibold text-stone-800">{formatMenuDate(menu.menu_date)}</p><p className="text-sm text-stone-500">{menu.item_count} {menu.item_count === 1 ? "item selecionado" : "itens selecionados"}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${menu.status === "PUBLICADO" ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-600"}`}>{menu.status === "PUBLICADO" ? "Publicado" : "Em preparação"}</span></div>)}
          {data.upcomingMenus.length === 0 && <p className="py-4 text-sm text-stone-500">Nenhum cardápio futuro preparado.</p>}
        </div>
      </section>
    </div>
  );
}
