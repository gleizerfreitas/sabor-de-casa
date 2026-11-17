import { notFound } from "next/navigation";
import { Suspense } from "react";
import { connection } from "next/server";
import { AdminMenuForm } from "@/src/components/admin-menu-form";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { listCatalog } from "@/src/server/services/catalog-service";
import { getDailyMenu } from "@/src/server/services/menu-service";
import { getAdminSettings } from "@/src/server/services/settings-service";

export const instant = false;

async function EditMenuContent({ id }: { id: string }) {
  await connection();
  const supabase = await createSupabaseServerClient();
  const [catalog, menu, settings] = await Promise.all([listCatalog(supabase), getDailyMenu(supabase, id), getAdminSettings(supabase)]);
  if (!menu) notFound();
  return <AdminMenuForm categories={catalog.categories} dishes={catalog.dishes} menu={menu} openDays={settings.business_hours.filter((hour) => hour.is_open).map((hour) => hour.day_of_week)} />;
}

export default async function EditMenuPage({ params }: PageProps<"/admin/cardapios/[id]">) {
  const { id } = await params;
  return <Suspense fallback={<p className="rounded-2xl bg-white p-6 text-stone-600">Carregando cardápio...</p>}><EditMenuContent id={id} /></Suspense>;
}
