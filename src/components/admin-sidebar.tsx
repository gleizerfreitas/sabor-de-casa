import Link from "next/link";

export function AdminSidebar() {
  return (
    <aside className="rounded-3xl bg-stone-900 p-5 text-white lg:w-64 lg:shrink-0">
      <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">Menu</p>
      <nav className="grid gap-1">
        <Link className="rounded-xl px-4 py-3 text-sm text-stone-300 hover:bg-white/10" href="/admin">Visão geral</Link>
        <Link className="rounded-xl px-4 py-3 text-sm text-stone-300 hover:bg-white/10" href="/admin/catalogo">Catálogo</Link>
        <Link className="rounded-xl px-4 py-3 text-sm text-stone-300 hover:bg-white/10" href="/admin/cardapios">Cardápios diários</Link>
        <Link className="rounded-xl px-4 py-3 text-sm text-stone-300 hover:bg-white/10" href="/admin/configuracoes">Funcionamento e WhatsApp</Link>
      </nav>
    </aside>
  );
}
