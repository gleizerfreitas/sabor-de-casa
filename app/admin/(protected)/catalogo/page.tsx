import { Suspense } from "react";
import { AdminCatalogLoader } from "@/src/components/admin-catalog-loader";

export default function AdminCatalogPage() {
  return (
    <Suspense fallback={<p className="rounded-2xl bg-white p-6 text-stone-600">Carregando catálogo...</p>}>
      <AdminCatalogLoader />
    </Suspense>
  );
}
