import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import {
  AdminAuthorizationError,
  AuthenticationRequiredError,
} from "./errors";
import { findAdminProfile } from "@/src/server/services/admin-service";

export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new AuthenticationRequiredError();
  }

  const { data: profile, error: profileError } = await findAdminProfile(supabase, user.id);

  if (profileError || !profile) {
    throw new AdminAuthorizationError();
  }

  return { user, profile };
}
