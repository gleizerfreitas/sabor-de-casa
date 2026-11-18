"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PublicMenu } from "@/src/types/public-menu";
import { createWhatsAppLink } from "@/src/app-actions/public-order";
import {
  parseOrderSelection,
  serializeOrderSelection,
} from "@/src/lib/order-selection";

type OrderReviewProps = {
  menu: PublicMenu;
  serializedOrder: string;
};

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function OrderReview({ menu, serializedOrder }: OrderReviewProps) {
  const initialQuantities = useMemo(() => {
    return parseOrderSelection(serializedOrder);
  }, [serializedOrder]);

  const [quantities, setQuantities] = useState(initialQuantities);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const allDishes = useMemo(
    () => menu.categories.flatMap((category) => category.dishes),
    [menu.categories],
  );
  const selected = allDishes
    .filter((dish) => (quantities[dish.id] ?? 0) > 0)
    .map((dish) => ({ dish, quantity: quantities[dish.id] }));
  const total = selected.reduce(
    (sum, item) => sum + item.dish.price * item.quantity,
    0,
  );
  const unavailable = selected.filter(({ dish }) => !dish.available);

  const serializedSelection = serializeOrderSelection(quantities);

  async function handleWhatsApp() {
    setSubmitting(true);
    setError("");

    const result = await createWhatsAppLink({
      items: selected.map(({ dish, quantity }) => ({
        dishId: dish.id,
        quantity,
      })),
    });

    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    window.location.assign(result.url);
  }

  return (
    <>
      <Link
        href={serializedSelection ? `/?itens=${encodeURIComponent(serializedSelection)}` : "/"}
        className="text-sm font-semibold text-orange-700"
      >
        ← Voltar ao cardápio
      </Link>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">Revisão do pedido</p>
        <h1 className="mt-2 text-3xl font-bold text-stone-900">Tudo certo por aqui?</h1>
        <p className="mt-2 text-stone-500">{menu.dateLabel} · total estimado</p>

        {selected.length === 0 ? (
          <div className="my-8 rounded-2xl bg-stone-50 p-5 text-sm text-stone-600">
            Nenhum prato selecionado. Volte ao cardápio para montar seu pedido.
          </div>
        ) : (
          <div className="my-8 divide-y divide-stone-200">
            {selected.map(({ dish, quantity }) => (
              <div className="py-4" key={dish.id}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-stone-900">{dish.name}</p>
                    <p className="text-sm text-stone-500">
                      {quantity} unidade(s) · {formatPrice(dish.price)} cada
                    </p>
                  </div>
                  <strong>{formatPrice(dish.price * quantity)}</strong>
                </div>
                {dish.available ? (
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      type="button"
                      aria-label={`Diminuir ${dish.name}`}
                      onClick={() => setQuantities((current) => ({
                        ...current,
                        [dish.id]: Math.max(0, (current[dish.id] ?? 0) - 1),
                      }))}
                      className="flex size-8 items-center justify-center rounded-full border border-stone-300"
                    >
                      −
                    </button>
                    <span className="w-5 text-center font-bold">{quantity}</span>
                    <button
                      type="button"
                      aria-label={`Aumentar ${dish.name}`}
                      onClick={() => setQuantities((current) => ({
                        ...current,
                        [dish.id]: (current[dish.id] ?? 0) + 1,
                      }))}
                      className="flex size-8 items-center justify-center rounded-full bg-orange-600 text-white"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <p className="mt-3 text-sm font-bold text-red-700">Indisponível · remova este prato para continuar</p>
                )}
              </div>
            ))}
          </div>
        )}

        {selected.length > 0 && (
          <div className="flex items-center justify-between border-t border-stone-200 pt-5 text-lg">
            <span className="font-semibold text-stone-600">Total estimado</span>
            <strong className="text-orange-700">{formatPrice(total)}</strong>
          </div>
        )}

        {unavailable.length > 0 && (
          <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800" role="alert">
            Remova os pratos indisponíveis antes de encaminhar o pedido.
          </div>
        )}
        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800" role="alert">
            {error}
          </div>
        )}

        <div className="mt-8 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          Os valores serão revalidados antes de abrir o WhatsApp. A abertura não confirma o pedido.
        </div>
        <button
          type="button"
          disabled={submitting || selected.length === 0 || unavailable.length > 0 || !menu.isOpen}
          onClick={handleWhatsApp}
          className="mt-5 w-full rounded-xl bg-emerald-600 px-5 py-4 font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {submitting
            ? "Validando pedido..."
            : !menu.isOpen
              ? "Pedidos fechados"
              : `Abrir WhatsApp · ${menu.whatsapp || "número não configurado"}`}
        </button>
        <p className="mt-3 text-center text-xs text-stone-500">
          Você precisa enviar a mensagem no WhatsApp. A proprietária confirmará o pedido pela conversa.
        </p>
      </div>
    </>
  );
}
