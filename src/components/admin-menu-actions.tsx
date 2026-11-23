"use client";

import { useState } from "react";
import { apiPublishDailyMenu, apiDeleteDailyMenu, ApiError } from "@/src/lib/api-client";

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
    try {
      await apiPublishDailyMenu(id);
      if (onPublished) onPublished();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Não foi possível publicar o cardápio."
      );
    } finally {
      setWorking(false);
    }
  }

  async function remove() {
    if (!window.confirm("Excluir este cardápio? Essa operação não pode ser desfeita.")) return;
    setWorking(true);
    setError("");
    try {
      await apiDeleteDailyMenu(id);
      onRemoved();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Não foi possível excluir o cardápio."
      );
      setWorking(false);
    }
  }

  return (
    <>
      {onPublished && <button type="button" disabled={working} onClick={publish} className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">Publicar</button>}
      <button type="button" disabled={working} onClick={remove} className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-60">Excluir</button>
      {error && <span role="alert" className="basis-full text-sm font-semibold text-red-700">{error}</span>}
    </>
  );
}
