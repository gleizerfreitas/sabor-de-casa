import { Suspense } from "react";
import { AdminMenuFormLoader } from "@/src/components/admin-menu-form-loader";

export const instant = false;

export default function NewMenuPage() {
  return (
    <Suspense fallback={<p className="rounded-2xl bg-white p-6 text-stone-600">Carregando formulário...</p>}>
      <AdminMenuFormLoader />
    </Suspense>
  );
}
