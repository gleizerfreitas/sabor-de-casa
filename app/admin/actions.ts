"use server";

import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error("Não foi possível encerrar a sessão.");
  }

  redirect("/admin/login");
}
