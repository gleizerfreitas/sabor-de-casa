import { Suspense } from "react";
import { DishFormLoader } from "@/src/components/dish-form-loader";

export default function NewDishPage() {
  return (
    <Suspense fallback={<p className="rounded-2xl bg-white p-6 text-stone-600">Carregando formulário...</p>}>
      <DishFormLoader />
    </Suspense>
  );
}
