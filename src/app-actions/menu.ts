"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { requireAdmin } from "@/src/server/auth/require-admin";
import { deleteDailyMenu, publishDailyMenu, saveDailyMenu } from "@/src/server/services/menu-service";
import { dailyMenuSchema } from "@/src/validations/menu";

const fail = (error: unknown) => ({
  ok: false as const,
  error: error instanceof Error ? error.message : "Não foi possível salvar o cardápio.",
});

export async function saveMenu(id: string | null, formData: FormData) {
  try {
    await requireAdmin();
    const dishIds = formData.getAll("dishIds").map(String);
    const input = dailyMenuSchema.parse({ date: formData.get("date"), dishIds });
    await saveDailyMenu(await createSupabaseServerClient(), id, input.date, input.dishIds);
    revalidatePath("/admin");
    revalidatePath("/admin/cardapios", "page");
    revalidatePath(`/admin/cardapios/${id ?? ""}`);
    return { ok: true as const };
  } catch (error) {
    return fail(error);
  }
}

export async function publishMenu(id: string) {
  try {
    await requireAdmin();
    await publishDailyMenu(await createSupabaseServerClient(), id);
    revalidatePath("/admin");
    revalidatePath("/admin/cardapios", "page");
    return { ok: true as const };
  } catch (error) {
    return fail(error);
  }
}

export async function removeMenu(id: string) {
  try {
    await requireAdmin();
    await deleteDailyMenu(await createSupabaseServerClient(), id);
    revalidatePath("/admin");
    revalidatePath("/admin/cardapios", "page");
    return { ok: true as const };
  } catch (error) {
    return fail(error);
  }
}
