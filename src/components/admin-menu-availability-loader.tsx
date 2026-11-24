"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { apiGetTodayMenuAvailability, ApiError } from "@/src/lib/api-client";
import { AdminMenuAvailability } from "@/src/components/admin-menu-availability";
import type { TodayMenuAvailabilityItem } from "@/src/server/services/menu-service";

type MenuAvailability = {
  menu: {
    id: string;
    menu_date: string;
  };
  items: TodayMenuAvailabilityItem[];
};

export function AdminMenuAvailabilityLoader({ menuId }: { menuId: string }) {
  const [availability, setAvailability] = useState<MenuAvailability | null | undefined>(undefined);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await apiGetTodayMenuAvailability(menuId);
        setAvailability(data as MenuAvailability);
      } catch (err) {
        setAvailability(null);
        setError(
          err instanceof ApiError ? err.message : "Erro ao carregar disponibilidade."
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [menuId]);

  if (loading) {
    return <p className="rounded-2xl bg-white p-6 text-stone-600">Carregando disponibilidade...</p>;
  }

  if (error && availability === null) {
    return notFound();
  }

  if (error) {
    return <p className="rounded-2xl bg-red-50 p-6 text-red-600">{error}</p>;
  }

  if (!availability) {
    return <p className="rounded-2xl bg-white p-6 text-stone-600">Sem dados disponíveis.</p>;
  }

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
        key={menuId}
        menuId={menuId}
        initialItems={availability.items}
      />
    </div>
  );
}
