import { Suspense } from "react";
import { connection } from "next/server";
import { AdminMenuForm } from "@/src/components/admin-menu-form";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { listCatalog } from "@/src/server/services/catalog-service";
import { getAdminSettings } from "@/src/server/services/settings-service";

export const instant = false;

async function NewMenuContent() {
  await connection();
  const supabase = await createSupabaseServerClient();
  const [catalog, settings] = await Promise.all([listCatalog(supabase), getAdminSettings(supabase)]);
  return <AdminMenuForm categories={catalog.categories} dishes={catalog.dishes} openDays={settings.business_hours.filter((hour) => hour.is_open).map((hour) => hour.day_of_week)} />;
}

export default function NewMenuPage() {
  return <Suspense fallback={<p className="rounded-2xl bg-white p-6 text-stone-600">Carregando formulário...</p>}><NewMenuContent /></Suspense>;
}
