"use client";

import { useState } from "react";
import { publishMenu, removeMenu } from "@/src/app-actions/menu";

export function AdminMenuActions({
  id,
  onPublished,
  onRemoved,
}: {
  id: string;
  onPublished?: () => void;
  onRemoved: () => void;
}) {
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);

  async function publish() {
    setWorking(true);
    setError("");
    const result = await publishMenu(id);
    if (!result.ok) setError(result.error);
    setWorking(false);
    if (result.ok && onPublished) onPublished();
  }

  async function remove() {
    if (!window.confirm("Excluir este cardápio? Essa operação não pode ser desfeita.")) return;
    setWorking(true);
    setError("");
    const result = await removeMenu(id);
    setWorking(false);
    if (!result.ok) setError(result.error);
    else onRemoved();
  }

  return (
    <>
      {onPublished && <button type="button" disabled={working} onClick={publish} className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">Publicar</button>}
      <button type="button" disabled={working} onClick={remove} className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-60">Excluir</button>
      {error && <span role="alert" className="basis-full text-sm font-semibold text-red-700">{error}</span>}
    </>
  );
}
