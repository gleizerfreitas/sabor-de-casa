import { PrototypeHeader } from "@/src/components/prototype-header";
import { PublicMenu } from "@/src/components/public-menu";

export default function PublicPrototypePage() {
  return <><PrototypeHeader /><main className="mx-auto max-w-6xl px-5 py-8 sm:py-12"><div className="mb-6 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900"><strong>Protótipo navegável:</strong> os dados são simulados e ainda não são persistidos.</div><PublicMenu /></main></>;
}
