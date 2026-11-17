"use client";

import { formatPrice, type MenuItem } from "@/src/prototyping/mock-data";

type DishCardProps = {
  dish: MenuItem;
  quantity: number;
  onChange: (quantity: number) => void;
};

export function DishCard({ dish, quantity, onChange }: DishCardProps) {
  return (
    <article className={`overflow-hidden rounded-3xl border bg-white shadow-sm ${dish.available ? "border-stone-200" : "border-stone-200 opacity-75"}`}>
      <div
        className={`flex aspect-square items-end bg-gradient-to-br ${dish.accent} p-4`}
        role="img"
        aria-label={`Fotografia ilustrativa de ${dish.name}`}
      >
        <span className="rounded-full bg-black/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">Foto do prato</span>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-bold text-stone-900">{dish.name}</h3>
            <p className="mt-1 text-sm leading-5 text-stone-500">{dish.description}</p>
          </div>
          <strong className="whitespace-nowrap text-sm text-orange-700">{formatPrice(dish.price)}</strong>
        </div>
        {dish.available ? (
          <div className="mt-5 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Disponível</span>
            <div className="flex items-center gap-3">
              <button aria-label={`Diminuir ${dish.name}`} onClick={() => onChange(Math.max(0, quantity - 1))} className="flex size-9 items-center justify-center rounded-full border border-stone-300 text-lg text-stone-700 hover:border-orange-500">−</button>
              <span className="w-4 text-center font-bold text-stone-900">{quantity}</span>
              <button aria-label={`Aumentar ${dish.name}`} onClick={() => onChange(quantity + 1)} className="flex size-9 items-center justify-center rounded-full bg-orange-600 text-lg text-white hover:bg-orange-700">+</button>
            </div>
          </div>
        ) : (
          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-stone-500">Indisponível hoje</p>
        )}
      </div>
    </article>
  );
}
