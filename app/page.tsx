import { Suspense } from "react";
import { connection } from "next/server";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { getPublicMenu } from "@/src/server/services/public-menu-service";
import { PublicMenuComponent } from "@/src/components/public-menu";

export const instant = false;

async function PublicMenuContent() {
  await connection();
  const menu = await getPublicMenu(await createSupabaseServerClient());

  return (
    <PublicMenuComponent menu={menu} />
  );
}

export default function PublicPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:py-12">
      <Suspense fallback={<p className="py-12 text-stone-500">Carregando cardápio...</p>}>
        <PublicMenuContent />
      </Suspense>
    </main>
  );
}
