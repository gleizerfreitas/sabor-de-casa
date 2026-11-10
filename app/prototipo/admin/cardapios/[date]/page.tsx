"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { type DailyMenu, readMenus } from "@/src/prototyping/menu-storage";
import { MenuForm } from "../novo/page";

function EditMenuContent() {
  const params = useParams<{ date: string }>();
  const [menu, setMenu] = useState<DailyMenu | undefined>();
  useEffect(() => {
    queueMicrotask(() => setMenu(readMenus().find((item) => item.date === params.date)));
  }, [params.date]);
  return menu ? <MenuForm menu={menu} /> : <p className="rounded-2xl bg-white p-6 text-stone-600">Cardápio não encontrado.</p>;
}

export default function EditMenuPage() {
  return <Suspense fallback={<p className="rounded-2xl bg-white p-6 text-stone-600">Carregando cardápio...</p>}><EditMenuContent /></Suspense>;
}
