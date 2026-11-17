import { Suspense } from "react";
import { DishForm } from "@/src/components/dish-form";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { listCatalog } from "@/src/server/services/catalog-service";
import { connection } from "next/server";

async function NewDishContent() {
  await connection();
  const data = await listCatalog(await createSupabaseServerClient());
  return <DishForm categories={data.categories} />;
}

export default function NewDishPage() {
  return (
    <Suspense fallback={<p className="rounded-2xl bg-white p-6 text-stone-600">Carregando formulário...</p>}>
      <NewDishContent />
    </Suspense>
  );
}
