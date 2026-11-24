import { Suspense } from "react";
import { PublicMenuLoader } from "@/src/components/public-menu-loader";

export const instant = false;

export default function PublicPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:py-12">
      <Suspense fallback={<p className="py-12 text-stone-500">Carregando cardápio...</p>}>
        <PublicMenuLoader />
      </Suspense>
    </main>
  );
}
