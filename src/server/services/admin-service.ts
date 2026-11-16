import type { SupabaseClient } from "@supabase/supabase-js";

type AdminProfile = {
  id: string;
  role: "admin";
};

export async function findAdminProfile(
  supabase: SupabaseClient,
  userId: string,
) {
  return supabase
    .from("admin_profiles")
    .select("id, role")
    .eq("id", userId)
    .eq("role", "admin")
    .maybeSingle<AdminProfile>();
}
