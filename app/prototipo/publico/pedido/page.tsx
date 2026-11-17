import { Suspense } from "react";
import { PrototypeHeader } from "@/src/components/prototype/prototype-header";
import { OrderContent } from "@/src/components/prototype/order-content";

export default function OrderPrototypePage() {
  return <><PrototypeHeader /><Suspense fallback={<main className="mx-auto max-w-3xl px-5 py-12 text-stone-500">Carregando pedido...</main>}><OrderContent /></Suspense></>;
}
