"use client";

import Link from "next/link";
import { useState } from "react";

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:w-64 lg:shrink-0">
      <button
        type="button"
        className="flex items-center gap-3 rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white lg:hidden"
        aria-label={isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
        aria-expanded={isOpen}
        aria-controls="admin-navigation"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span aria-hidden="true" className="grid gap-1">
          <span className="h-0.5 w-5 rounded bg-current" />
          <span className="h-0.5 w-5 rounded bg-current" />
          <span className="h-0.5 w-5 rounded bg-current" />
        </span>
        Menu
      </button>
      <aside
        id="admin-navigation"
        className={`${isOpen ? "mt-3 block" : "hidden"} rounded-3xl bg-stone-900 p-5 text-white lg:mt-0 lg:block`}
      >
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">Menu</p>
        <nav className="grid gap-1" aria-label="Navegação administrativa">
          <Link onClick={() => setIsOpen(false)} className="rounded-xl px-4 py-3 text-sm text-stone-300 hover:bg-white/10" href="/admin">Visão Geral</Link>
          <Link onClick={() => setIsOpen(false)} className="rounded-xl px-4 py-3 text-sm text-stone-300 hover:bg-white/10" href="/admin/cardapios">Cardápios Diários</Link>
          <Link onClick={() => setIsOpen(false)} className="rounded-xl px-4 py-3 text-sm text-stone-300 hover:bg-white/10" href="/admin/catalogo">Catálogo</Link>
          <Link onClick={() => setIsOpen(false)} className="rounded-xl px-4 py-3 text-sm text-stone-300 hover:bg-white/10" href="/admin/configuracoes">Configurações</Link>
          <Link onClick={() => setIsOpen(false)} className="rounded-xl px-4 py-3 text-sm text-stone-300 hover:bg-white/10" href="/" target="_blank" rel="noopener noreferrer">Cardápio Público</Link>
        </nav>
      </aside>
    </div>
  );
}
