import { Suspense } from "react";
import { DishFormLoader } from "@/src/components/dish-form-loader";

export default function EditDishPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="rounded-2xl bg-white p-6 text-stone-600">Carregando formulário...</p>}>
      <DishFormLoaderWrapper params={params} />
    </Suspense>
  );
}

async function DishFormLoaderWrapper({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DishFormLoader dishId={id} />;
}
