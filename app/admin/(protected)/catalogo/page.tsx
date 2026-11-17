import { Suspense } from "react";
import { AdminCatalog } from "@/src/components/admin-catalog";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { listCatalog } from "@/src/server/services/catalog-service";
import { connection } from "next/server";

async function AdminCatalogContent() {
  await connection();
  const data = await listCatalog(await createSupabaseServerClient());
  return <AdminCatalog data={data} />;
}

export default function AdminCatalogPage() {
  return (
    <Suspense fallback={<p className="rounded-2xl bg-white p-6 text-stone-600">Carregando catálogo...</p>}>
      <AdminCatalogContent />
    </Suspense>
  );
}
