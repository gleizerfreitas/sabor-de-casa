"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  dishes,
  formatPrice,
  menuDate,
  parseOrder,
  whatsappNumber,
  type OrderItem,
} from "@/src/prototyping/mock-data";

export function OrderContent() {
  const searchParams = useSearchParams();
  const parsedOrder = parseOrder(searchParams.get("itens"));
  const selected: OrderItem[] = parsedOrder.length
    ? parsedOrder
    : dishes
        .filter((dish) => dish.available)
        .slice(0, 2)
        .map((dish) => ({ dish, quantity: 1 }));
  const total = selected.reduce(
    (sum, item) => sum + item.dish.price * item.quantity,
    0,
  );

  return <main className="mx-auto max-w-3xl px-5 py-8 sm:py-12"><Link href="/prototipo/publico" className="text-sm font-semibold text-orange-700">← Voltar ao cardápio</Link><div className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200 sm:p-8"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">Revisão do pedido</p><h1 className="mt-2 text-3xl font-bold text-stone-900">Tudo certo por aqui?</h1><p className="mt-2 text-stone-500">{menuDate} · total estimado</p><div className="my-8 divide-y divide-stone-200">{selected.map(({ dish, quantity }) => <div className="flex items-center justify-between py-4" key={dish.id}><div><p className="font-semibold text-stone-900">{dish.name}</p><p className="text-sm text-stone-500">{quantity} unidade(s) · {formatPrice(dish.price)} cada</p></div><strong>{formatPrice(dish.price * quantity)}</strong></div>)}</div><div className="flex items-center justify-between border-t border-stone-200 pt-5 text-lg"><span className="font-semibold text-stone-600">Total estimado</span><strong className="text-orange-700">{formatPrice(total)}</strong></div><div className="mt-8 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">Os valores serão revalidados antes de abrir o WhatsApp. A abertura não confirma o pedido.</div><button className="mt-5 w-full rounded-xl bg-emerald-600 px-5 py-4 font-bold text-white hover:bg-emerald-700">Abrir WhatsApp · {whatsappNumber}</button></div></main>;
}
