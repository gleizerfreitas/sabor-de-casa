import { Suspense } from "react";
import { AdminMenuAvailabilityLoader } from "@/src/components/admin-menu-availability-loader";

export const instant = false;

export default async function MenuAvailabilityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<p className="rounded-2xl bg-white p-6 text-stone-600">Carregando disponibilidade...</p>}>
      <AdminMenuAvailabilityLoader menuId={id} />
    </Suspense>
  );
}
