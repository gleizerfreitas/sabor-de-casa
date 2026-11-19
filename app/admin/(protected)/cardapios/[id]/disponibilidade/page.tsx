import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { connection } from "next/server";
import { AdminMenuAvailability } from "@/src/components/admin-menu-availability";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { getTodayMenuAvailability } from "@/src/server/services/menu-service";

export const instant = false;

async function AvailabilityContent({ id }: { id: string }) {
  await connection();
  const supabase = await createSupabaseServerClient();
  const availability = await getTodayMenuAvailability(supabase, id);
  if (!availability) notFound();

  return (
    <div>
      <Link href="/admin" className="text-sm font-semibold text-orange-700">← Voltar à visão geral</Link>
      <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">Operação rápida</p>
          <h1 className="mt-2 text-3xl font-bold text-stone-900">Gerenciar disponibilidade</h1>
          <p className="mt-2 text-stone-500">{new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(new Date(`${availability.menu.menu_date}T12:00:00Z`))} · marque os pratos esgotados.</p>
        </div>
      </div>
      <AdminMenuAvailability
        key={id}
        menuId={id}
        initialItems={availability.items}
      />
    </div>
  );
}

export default async function MenuAvailabilityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<p className="rounded-2xl bg-white p-6 text-stone-600">Carregando disponibilidade...</p>}>
      <AvailabilityContent id={id} />
    </Suspense>
  );
}
