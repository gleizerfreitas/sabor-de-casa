import { Suspense } from "react";
import { connection } from "next/server";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { getPublicMenu } from "@/src/server/services/public-menu-service";
import { OrderReview } from "@/src/components/order-review";

type PedidoPageProps = {
  searchParams: Promise<{ itens?: string }>;
};

export const instant = false;

async function PedidoContent({ searchParams }: PedidoPageProps) {
  await connection();
  const params = await searchParams;
  const menu = await getPublicMenu(await createSupabaseServerClient());

  return (
    <OrderReview
      key={params.itens ?? ""}
      menu={menu}
      serializedOrder={params.itens ?? ""}
    />
  );
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
