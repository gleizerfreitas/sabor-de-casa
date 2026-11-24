import { Suspense } from "react";
import { AdminMenuFormLoader } from "@/src/components/admin-menu-form-loader";

export const instant = false;

export default async function EditMenuPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<p className="rounded-2xl bg-white p-6 text-stone-600">Carregando cardápio...</p>}>
      <AdminMenuFormLoader menuId={id} />
    </Suspense>
  );
}
