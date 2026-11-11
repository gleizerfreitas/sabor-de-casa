import Link from "next/link";

type PrototypeHeaderProps = {
  area?: "public" | "admin";
};

export function PrototypeHeader({ area = "public" }: PrototypeHeaderProps) {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href={area === "admin" ? "/prototipo/admin" : "/prototipo/publico"} className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-orange-600 text-lg font-bold text-white">S</span>
          <span>
            <span className="block text-sm font-bold text-stone-900">Sabor de Casa</span>
            <span className="block text-xs text-stone-500">{area === "admin" ? "Área administrativa" : "Comida afetiva todos os dias"}</span>
          </span>
        </Link>
        {area === "admin" ? (
          <Link href="/prototipo/publico" className="text-sm font-semibold text-orange-700 hover:text-orange-800">Ver cardápio público</Link>
        ) : (
          <Link href="/prototipo/admin" className="text-sm font-semibold text-stone-600 hover:text-orange-700">Acesso da proprietária</Link>
        )}
      </div>
    </header>
  );
}
