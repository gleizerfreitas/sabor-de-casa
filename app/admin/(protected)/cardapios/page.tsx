import { Suspense } from "react";
import { connection } from "next/server";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";

async function DailyMenusContent() {
  await connection();
  const supabase = await createSupabaseServerClient();
  const result = await supabase
    .from("daily_menus")
    .select("id, menu_date, status")
    .order("menu_date", { ascending: true });

  if (result.error) {
    throw new Error(`Não foi possível carregar os cardápios: ${result.error.message}`);
  }

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">Operação</p>
      <h1 className="mt-2 text-3xl font-bold text-stone-900">Cardápios diários</h1>
      <p className="mt-2 text-stone-500">Consulte os cardápios preparados e publicados.</p>
      <div className="mt-8 grid gap-4">
        {(result.data ?? []).map((menu) => (
          <article className="rounded-3xl bg-white p-6 ring-1 ring-stone-200" key={menu.id}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-bold text-stone-900">{menu.menu_date}</h2>
                <p className="mt-1 text-sm text-stone-500">{menu.status === "PUBLICADO" ? "Publicado" : "Em preparação"}</p>
              </div>
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-600">Cardápio</span>
            </div>
          </article>
        ))}
        {(result.data ?? []).length === 0 && <p className="rounded-2xl bg-white p-6 text-stone-600">Nenhum cardápio cadastrado.</p>}
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
