"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { publishMenu } from "@/src/app-actions/menu";

export function AdminTodayMenuActions({
  menuId,
  status,
}: {
  menuId: string;
  status: "RASCUNHO" | "PUBLICADO";
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [publishing, setPublishing] = useState(false);

  async function publish() {
    setPublishing(true);
    setError("");
    const result = await publishMenu(menuId);
    setPublishing(false);
    if (!result.ok) setError(result.error);
    else {
      router.refresh();
    }
  }

  if (status === "PUBLICADO") {
    return <Link prefetch={false} href={`/admin/cardapios/${menuId}/disponibilidade`} className="mt-5 inline-block rounded-xl bg-white px-4 py-3 text-center text-sm font-bold text-orange-700">Gerenciar disponibilidade</Link>;
  }

  return (
    <div className="mt-5">
      <button type="button" disabled={publishing} onClick={publish} className="rounded-xl bg-white px-4 py-3 text-center text-sm font-bold text-orange-700 disabled:opacity-60">{publishing ? "Publicando..." : "Publicar"}</button>
      {error && <p role="alert" className="mt-3 text-sm font-semibold text-red-100">{error}</p>}
    </div>
  );
}
