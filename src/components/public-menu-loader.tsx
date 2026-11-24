"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { apiGetPublicMenu, ApiError } from "@/src/lib/api-client";
import { PublicMenuComponent } from "@/src/components/public-menu";
import type { PublicMenu } from "@/src/types/public-menu";

export function PublicMenuLoader() {
  const [menu, setMenu] = useState<PublicMenu | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await apiGetPublicMenu();
        setMenu(data);
      } catch (err) {
        setError(
          err instanceof ApiError ? err.message : "Erro ao carregar cardápio."
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <p className="py-12 text-stone-500">Carregando cardápio...</p>;
  }

  if (error) {
    return <p className="py-12 text-red-600">{error}</p>;
  }

  if (!menu) {
    return <p className="py-12 text-stone-500">Sem dados disponíveis.</p>;
  }

  return (
    <>
      <div className="mb-8 flex justify-center">
        <Image
          src="/logocolorida.png"
          alt="Sabor de Casa"
          width={420}
          height={154}
          className="h-auto w-64 object-contain sm:w-80 md:w-96"
          priority
        />
      </div>
      <PublicMenuComponent menu={menu} />
    </>
  );
}
