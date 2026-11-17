import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { getTodayMenuSummary } from "@/src/server/services/menu-service";

function DashboardIcon({ name }: { name: "catalog" | "menus" }) {
  const paths = {
    catalog: <><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-13Z" /><path d="M8 8h8M8 12h8M8 16h4" /></>,
    menus: <><path d="M5 4v16M19 4v16M5 7h14M5 17h14" /><path d="M9 10h6M9 14h6" /></>,
  };
  return <svg aria-hidden="true" className="size-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">{paths[name]}</svg>;
}

function formatMenuDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`)).replace(".", "");
}

async function AdminOverviewContent() {
  await connection();
  const overview = await getTodayMenuSummary(await createSupabaseServerClient());
  const greeting = overview.ownerName ? `Bom dia, ${overview.ownerName}` : "Visão geral";

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">Visão geral</p>
      <h1 className="mt-2 text-3xl font-bold text-stone-900">{greeting}</h1>
      <p className="mt-2 text-stone-500">Acompanhe o cardápio do dia e acesse rapidamente as operações da Sabor de Casa.</p>

      <section className="mt-8 rounded-3xl bg-orange-600 p-6 text-white">
        <p className="text-sm text-orange-100">Cardápio de hoje · {overview.today}</p>
        {overview.menu ? (
          <>
            <h2 className="mt-1 text-2xl font-bold">{overview.menu.status === "PUBLICADO" ? "Publicado" : "Em preparação"}</h2>
            <p className="mt-1 text-sm text-orange-100">{overview.menu.item_count} {overview.menu.item_count === 1 ? "item selecionado" : "itens selecionados"}</p>
            <Link href={`/admin/cardapios/${overview.menu.id}/disponibilidade`} className="mt-5 inline-block rounded-xl bg-white px-4 py-3 text-center text-sm font-bold text-orange-700">Gerenciar disponibilidade</Link>
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
          {overview.upcomingMenus.map((menu) => <div className="flex items-center justify-between gap-4 py-4" key={menu.id}><div><p className="font-semibold text-stone-800">{formatMenuDate(menu.menu_date)}</p><p className="text-sm text-stone-500">{menu.item_count} {menu.item_count === 1 ? "item selecionado" : "itens selecionados"}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${menu.status === "PUBLICADO" ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-600"}`}>{menu.status === "PUBLICADO" ? "Publicado" : "Em preparação"}</span></div>)}
          {overview.upcomingMenus.length === 0 && <p className="py-4 text-sm text-stone-500">Nenhum cardápio futuro preparado.</p>}
        </div>
      </section>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<p className="rounded-2xl bg-white p-6 text-stone-600">Carregando visão geral...</p>}>
      <AdminOverviewContent />
    </Suspense>
  );
}
