import { Suspense } from "react";
import { AdminSettingsForm } from "@/src/components/admin-settings-form";
import { AdminSidebar } from "@/src/components/admin-sidebar";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { getAdminSettings } from "@/src/server/services/settings-service";
import { connection } from "next/server";

async function AdminSettingsContent() {
  await connection();
  const settings = await getAdminSettings(await createSupabaseServerClient());
  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <AdminSidebar />
      <section className="min-w-0 flex-1">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">Configuração</p>
        <h1 className="mt-2 text-3xl font-bold text-stone-900">Funcionamento e WhatsApp</h1>
        <p className="mt-2 text-stone-500">Defina quando os pedidos podem ser encaminhados e os dados de identificação da proprietária.</p>
        <div className="mt-8">
          <AdminSettingsForm settings={settings} />
        </div>
      </section>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<p className="rounded-2xl bg-white p-6 text-stone-600">Carregando configurações...</p>}>
      <AdminSettingsContent />
    </Suspense>
  );
}
