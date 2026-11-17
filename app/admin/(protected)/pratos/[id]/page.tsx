import { Suspense } from "react";
import { notFound } from "next/navigation";
import { DishForm } from "@/src/components/dish-form";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { listCatalog } from "@/src/server/services/catalog-service";
import { connection } from "next/server";

async function EditDishContent({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const data = await listCatalog(await createSupabaseServerClient());
  const { id } = await params;
  const dish = data.dishes.find((item) => item.id === id);
  if (!dish) notFound();
  return <DishForm categories={data.categories} dish={dish} />;
}

export default function EditDishPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="rounded-2xl bg-white p-6 text-stone-600">Carregando formulário...</p>}>
      <EditDishContent params={params} />
    </Suspense>
  );
}
