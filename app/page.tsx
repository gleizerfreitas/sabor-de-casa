export default function Home() {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-orange-50 px-6 py-16">
      <section className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-700">
          Sabor de Casa
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
          Cardápio feito com carinho
        </h1>
        <p className="mt-5 text-lg leading-8 text-stone-600">
          A fundação do cardápio digital está pronta. Em breve, você poderá
          consultar nossas opções e preparar seu pedido pelo WhatsApp.
        </p>
      </section>
    </main>
  );
}
