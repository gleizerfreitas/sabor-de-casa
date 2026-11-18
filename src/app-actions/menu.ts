"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { requireAdmin } from "@/src/server/auth/require-admin";
import { deleteDailyMenu, deletePastDailyMenus, publishDailyMenu, saveDailyMenu, setMenuItemAvailability } from "@/src/server/services/menu-service";
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
    const savedMenu = await saveDailyMenu(await createSupabaseServerClient(), id, input.date, input.dishIds);
    revalidatePath("/admin");
    revalidatePath("/admin/cardapios", "layout");
    revalidatePath("/");
    revalidatePath("/pedido");
    revalidatePath(`/admin/cardapios/${id ?? ""}`);
    if (savedMenu && typeof savedMenu === "object" && "id" in savedMenu) {
      revalidatePath(`/admin/cardapios/${String(savedMenu.id)}/disponibilidade`, "layout");
    }
    if (id) {
      revalidatePath(`/admin/cardapios/${id}/disponibilidade`, "layout");
    }
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
    revalidatePath("/admin/cardapios", "layout");
    revalidatePath("/");
    revalidatePath("/pedido");
    revalidatePath(`/admin/cardapios/${id}/disponibilidade`, "layout");
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
    revalidatePath("/admin/cardapios", "layout");
    revalidatePath("/");
    revalidatePath("/pedido");
    return { ok: true as const };
  } catch (error) {
    return fail(error);
  }
}

export async function removePastMenus() {
  try {
    await requireAdmin();
    const deletedCount = await deletePastDailyMenus(await createSupabaseServerClient());
    revalidatePath("/admin");
    revalidatePath("/admin/cardapios", "layout");
    revalidatePath("/");
    revalidatePath("/pedido");
    return { ok: true as const, deletedCount };
  } catch (error) {
    return fail(error);
  }
}

export async function setMenuAvailability(menuId: string, dishId: string, available: boolean) {
  try {
    await requireAdmin();
    await setMenuItemAvailability(await createSupabaseServerClient(), menuId, dishId, available);
    revalidatePath("/admin");
    revalidatePath("/admin/cardapios");
    revalidatePath("/");
    revalidatePath("/pedido");
    revalidatePath(`/admin/cardapios/${menuId}/disponibilidade`);
    return { ok: true as const };
  } catch (error) {
    return fail(error);
  }
}
