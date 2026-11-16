"use client";

import { signOut } from "./actions";

export function AdminLogoutButton() {
  return (
    <form action={signOut}>
      <button className="text-sm font-semibold text-stone-600 hover:text-orange-700" type="submit">
        Sair
      </button>
    </form>
  );
}
