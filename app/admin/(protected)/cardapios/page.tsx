import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { listDailyMenus } from "@/src/server/services/menu-service";
import { AdminMenuActions } from "@/src/components/admin-menu-actions";

async function DailyMenusContent() {
  await connection();
  const menus = await listDailyMenus(await createSupabaseServerClient());

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">Operação</p>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="mt-2 text-3xl font-bold text-stone-900">Cardápios diários</h1><p className="mt-2 text-stone-500">Prepare e publique opções para cada data.</p></div><Link href="/admin/cardapios/novo" className="rounded-xl bg-orange-600 px-4 py-3 text-center text-sm font-bold text-white">+ Novo cardápio</Link></div>
      <div className="mt-8 grid gap-4">
        {menus.map((menu) => (
          <article className="rounded-3xl bg-white p-6 ring-1 ring-stone-200" key={menu.id}>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-3"><h2 className="font-bold text-stone-900">{new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${menu.menu_date}T12:00:00Z`)).replace(".", "")}</h2><span className={`rounded-full px-3 py-1 text-xs font-bold ${menu.status === "PUBLICADO" ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-600"}`}>{menu.status === "PUBLICADO" ? "Publicado" : "Rascunho"}</span></div>
                <p className="mt-2 text-sm text-stone-500">{menu.items.length ? `${menu.items.length} pratos selecionados` : "Nenhum prato selecionado"}</p>
              </div>
              <div className="flex flex-wrap gap-2"><Link href={`/admin/cardapios/${menu.id}`} className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700">Editar</Link>{menu.status === "RASCUNHO" && <AdminMenuActions id={menu.id} />}</div>
            </div>
          </article>
        ))}
        {menus.length === 0 && <p className="rounded-2xl bg-white p-6 text-stone-600">Nenhum cardápio cadastrado.</p>}
      </div>
    </div>
  );
}

export default function DailyMenusPage() {
  return (
    <Suspense fallback={<p className="rounded-2xl bg-white p-6 text-stone-600">Carregando cardápios...</p>}>
      <DailyMenusContent />
    </Suspense>
  );
}
