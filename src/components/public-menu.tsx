"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { PublicDish, PublicMenu } from "@/src/types/public-menu";
import {
  parseOrderSelection,
  serializeOrderSelection,
} from "@/src/lib/order-selection";

type PublicMenuProps = {
  menu: PublicMenu;
};

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function PublicMenuComponent({ menu }: PublicMenuProps) {
  const searchParams = useSearchParams();
  const serializedItems = searchParams.get("itens") ?? "";
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    parseOrderSelection(serializedItems),
  );

  useEffect(() => {
    queueMicrotask(() => {
      setQuantities(parseOrderSelection(serializedItems));
    });
  }, [serializedItems]);

  const allDishes = useMemo(
    () => menu.categories.flatMap((category) => category.dishes),
    [menu.categories],
  );
  const selected = allDishes.filter((dish) => (quantities[dish.id] ?? 0) > 0);
  const selectedCount = selected.reduce(
    (sum, dish) => sum + (quantities[dish.id] ?? 0),
    0,
  );
  const total = selected.reduce(
    (sum, dish) => sum + dish.price * (quantities[dish.id] ?? 0),
    0,
  );

  return (
    <>
      <section className="rounded-3xl bg-stone-900 px-6 py-8 text-white sm:px-10 sm:py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-300">Cardápio de hoje</p>
        <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-bold capitalize sm:text-4xl">{menu.dateLabel}</h1>
            <p className="mt-2 text-stone-300">Escolha seus pratos e envie pelo WhatsApp.</p>
          </div>
          <span className={`rounded-full px-4 py-2 text-sm font-semibold ${
            menu.isOpen
              ? "bg-emerald-500/20 text-emerald-300"
              : "bg-amber-500/20 text-amber-200"
          }`}>
            {menu.statusMessage}
          </span>
        </div>
      </section>

      {menu.categories.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-8 text-center ring-1 ring-stone-200">
          <p className="text-lg font-bold text-stone-900">Nenhum cardápio publicado para hoje</p>
          <p className="mt-2 text-sm text-stone-500">Volte mais tarde. As opções podem ser atualizadas pela proprietária.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-9">
          {menu.categories.map((category) => (
            <section key={category.id}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-stone-900">{category.name}</h2>
                <span className="text-sm text-stone-500">{category.dishes.length} opções</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {category.dishes.map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    quantity={quantities[dish.id] ?? 0}
                    onChange={(quantity) => setQuantities((current) => ({
                      ...current,
                      [dish.id]: quantity,
                    }))}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {selected.length > 0 && (
        <div className="sticky bottom-4 mt-8 flex items-center justify-between gap-4 rounded-2xl bg-orange-600 p-4 text-white shadow-xl">
          <div>
            <p className="text-sm text-orange-100">{selectedCount} itens selecionados</p>
            <strong>{formatPrice(total)}</strong>
          </div>
          {menu.isOpen ? (
            <Link
              href={`/pedido?itens=${encodeURIComponent(serializeOrderSelection(quantities))}`}
              className="rounded-xl bg-white px-4 py-3 text-sm font-bold text-orange-700"
            >
              Revisar pedido
            </Link>
          ) : (
            <span className="rounded-xl bg-orange-800/40 px-4 py-3 text-sm font-bold">Pedidos fechados</span>
          )}
        </div>
      )}
    </>
  );
}

function DishCard({
  dish,
  quantity,
  onChange,
}: {
  dish: PublicDish;
  quantity: number;
  onChange: (quantity: number) => void;
}) {
  return (
    <article className={`overflow-hidden rounded-3xl border bg-white shadow-sm ${
      dish.available ? "border-stone-200" : "border-stone-200 opacity-75"
    }`}>
      <img
        src={dish.photoUrl}
        alt={dish.name}
        className="aspect-square w-full object-cover"
      />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-bold text-stone-900">{dish.name}</h3>
            {dish.description && (
              <p className="mt-1 text-sm leading-5 text-stone-500">{dish.description}</p>
            )}
          </div>
          <strong className="whitespace-nowrap text-sm text-orange-700">{formatPrice(dish.price)}</strong>
        </div>
        {dish.available ? (
          <div className="mt-5 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Disponível</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label={`Diminuir ${dish.name}`}
                onClick={() => onChange(Math.max(0, quantity - 1))}
                className="flex size-9 items-center justify-center rounded-full border border-stone-300 text-lg text-stone-700 hover:border-orange-500"
              >
                −
              </button>
              <span className="w-4 text-center font-bold text-stone-900">{quantity}</span>
              <button
                type="button"
                aria-label={`Aumentar ${dish.name}`}
                onClick={() => onChange(quantity + 1)}
                className="flex size-9 items-center justify-center rounded-full bg-orange-600 text-lg text-white hover:bg-orange-700"
              >
                +
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-stone-500">Indisponível hoje</p>
        )}
      </div>
    </article>
  );
}
