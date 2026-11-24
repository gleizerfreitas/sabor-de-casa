"use client";

import { useEffect, useState } from "react";
import { apiGetSettings, ApiError } from "@/src/lib/api-client";
import { AdminSettingsForm } from "@/src/components/admin-settings-form";
import type { AdminSettings } from "@/src/types/settings";

export function AdminSettingsFormLoader() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await apiGetSettings();
        setSettings(data as AdminSettings);
      } catch (err) {
        setError(
          err instanceof ApiError ? err.message : "Erro ao carregar configurações."
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <p className="rounded-2xl bg-white p-6 text-stone-600">Carregando configurações...</p>;
  }

  if (error) {
    return <p className="rounded-2xl bg-red-50 p-6 text-red-600">{error}</p>;
  }

  if (!settings) {
    return <p className="rounded-2xl bg-white p-6 text-stone-600">Sem dados disponíveis.</p>;
  }

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">Configuração</p>
      <h1 className="mt-2 text-3xl font-bold text-stone-900">Funcionamento e WhatsApp</h1>
      <p className="mt-2 text-stone-500">Defina quando os pedidos podem ser encaminhados e os dados de identificação da proprietária.</p>
      <div className="mt-8">
        <AdminSettingsForm settings={settings} />
      </div>
    </section>
  );
}
