"use client";

import { useEffect, useState } from "react";
import { apiGetPublicMenu, ApiError } from "@/src/lib/api-client";
import { OrderReview } from "@/src/components/order-review";
import type { PublicMenu } from "@/src/types/public-menu";

export function OrderReviewLoader({ serializedOrder }: { serializedOrder: string }) {
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
          err instanceof ApiError ? err.message : "Erro ao carregar pedido."
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <p className="py-12 text-stone-500">Carregando pedido...</p>;
  }

  if (error) {
    return <p className="py-12 text-red-600">{error}</p>;
  }

  if (!menu) {
    return <p className="py-12 text-stone-500">Sem dados disponíveis.</p>;
  }

  return (
    <OrderReview
      key={serializedOrder}
      menu={menu}
      serializedOrder={serializedOrder}
    />
  );
}
