import { Suspense } from "react";
import { AdminSettingsFormLoader } from "@/src/components/admin-settings-form-loader";

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<p className="rounded-2xl bg-white p-6 text-stone-600">Carregando configurações...</p>}>
      <AdminSettingsFormLoader />
    </Suspense>
  );
}
