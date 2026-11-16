import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { AdminLogoutButton } from "../logout-button";
import { requireAdmin } from "@/src/server/auth/require-admin";
import {
  AdminAuthorizationError,
  AuthenticationRequiredError,
} from "@/src/server/auth/errors";

export const instant = false;

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await connection();

  try {
    await requireAdmin();
  } catch (error) {
    if (
      error instanceof AuthenticationRequiredError ||
      error instanceof AdminAuthorizationError
    ) {
      redirect("/admin/login");
    }
    throw error;
  }

  return (
    <div className="min-h-full flex-1 bg-stone-100">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <strong className="text-orange-700">Sabor de Casa</strong>
          <AdminLogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-12">{children}</main>
    </div>
  );
}
