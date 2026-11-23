import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { requireAdmin } from "@/src/server/auth/require-admin";
import { AuthenticationRequiredError, AdminAuthorizationError } from "@/src/server/auth/errors";

export async function requireApiAdmin() {
  try {
    return await requireAdmin();
  } catch (error) {
    if (error instanceof AuthenticationRequiredError || error instanceof AdminAuthorizationError) {
      throw error;
    }
    throw new Error("Falha ao verificar autenticação");
  }
}
