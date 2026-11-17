import type { ReactNode } from "react";
import { PrototypeHeader } from "@/src/components/prototype/prototype-header";
import { AdminSidebar } from "@/src/components/prototype/admin-sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <><PrototypeHeader area="admin" /><main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-8 lg:flex-row lg:py-12"><AdminSidebar /><section className="min-w-0 flex-1">{children}</section></main></>;
}
