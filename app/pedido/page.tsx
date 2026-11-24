import { Suspense } from "react";
import { OrderReviewLoader } from "@/src/components/order-review-loader";

type PedidoPageProps = {
  searchParams: Promise<{ itens?: string }>;
};

export const instant = false;

async function PedidoContent({ searchParams }: PedidoPageProps) {
  const params = await searchParams;
  return <OrderReviewLoader serializedOrder={params.itens ?? ""} />;
}

export default function PedidoPage({ searchParams }: PedidoPageProps) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-8 sm:py-12">
      <Suspense fallback={<p className="py-12 text-stone-500">Carregando pedido...</p>}>
        <PedidoContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
