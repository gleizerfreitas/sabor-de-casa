import { Suspense } from "react";
import { AdminDashboardLoader } from "@/src/components/admin-dashboard-loader";

export default function AdminPage() {
  return (
    <Suspense fallback={<p className="rounded-2xl bg-white p-6 text-stone-600">Carregando visão geral...</p>}>
      <AdminDashboardLoader />
    </Suspense>
  );
}
