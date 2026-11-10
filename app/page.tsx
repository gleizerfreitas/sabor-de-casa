import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-orange-50 px-5 py-12">
      <section className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-sm sm:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-700">Sabor de Casa</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">Protótipos navegáveis do MVP</h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-stone-600">Explore os fluxos públicos e administrativos com dados simulados.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link href="/prototipo/publico" className="rounded-2xl bg-orange-600 px-5 py-4 text-center font-bold text-white hover:bg-orange-700">Explorar cardápio público</Link>
          <Link href="/prototipo/admin/login" className="rounded-2xl border border-stone-300 px-5 py-4 text-center font-bold text-stone-800 hover:border-orange-500">Acessar administração</Link>
        </div>
        <p className="mt-6 text-center text-xs text-stone-400">Protótipo acadêmico · sem persistência ou autenticação real</p>
      </section>
    </main>
  );
}
