import { Suspense } from "react";
import Image from "next/image";
import { connection } from "next/server";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { getPublicMenu } from "@/src/server/services/public-menu-service";
import { PublicMenuComponent } from "@/src/components/public-menu";

export const instant = false;

async function PublicMenuContent() {
  await connection();
  const menu = await getPublicMenu(await createSupabaseServerClient());

  return (
    <>
      <div className="mb-8 flex justify-center">
        <Image
          src="/logocolorida.png"
          alt="Sabor de Casa"
          width={420}
          height={154}
          className="h-auto w-64 object-contain sm:w-80 md:w-96"
          priority
        />
      </div>
      <PublicMenuComponent menu={menu} />
    </>
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
