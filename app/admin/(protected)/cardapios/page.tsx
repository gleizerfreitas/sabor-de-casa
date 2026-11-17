import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { listDailyMenus } from "@/src/server/services/menu-service";
import { AdminMenuList } from "@/src/components/admin-menu-list";

async function DailyMenusContent() {
  await connection();
  const menus = await listDailyMenus(await createSupabaseServerClient());

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">Operação</p>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="mt-2 text-3xl font-bold text-stone-900">Cardápios diários</h1><p className="mt-2 text-stone-500">Prepare e publique opções para cada data.</p></div><Link href="/admin/cardapios/novo" className="rounded-xl bg-orange-600 px-4 py-3 text-center text-sm font-bold text-white">+ Novo cardápio</Link></div>
      <AdminMenuList initialMenus={menus} />
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
