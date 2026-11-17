"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { requireAdmin } from "@/src/server/auth/require-admin";
import { updateAdminSettings } from "@/src/server/services/settings-service";
import { adminSettingsSchema, normalizeBrazilianWhatsapp } from "@/src/validations/settings";

const fail = (error: unknown) => ({
  ok: false as const,
  error: error instanceof Error ? error.message : "Não foi possível salvar as configurações.",
});

export async function saveAdminSettings(formData: FormData) {
  try {
    await requireAdmin();
    const rawHours = formData.get("hours");
    const parsedHours = typeof rawHours === "string" ? JSON.parse(rawHours) : null;
    const input = adminSettingsSchema.parse({
      ownerName: formData.get("ownerName"),
      whatsapp: formData.get("whatsapp"),
      timezone: formData.get("timezone") || "America/Fortaleza",
      hours: parsedHours,
    });

    await updateAdminSettings(await createSupabaseServerClient(), {
      ownerName: input.ownerName,
      whatsapp: normalizeBrazilianWhatsapp(input.whatsapp),
      timezone: input.timezone,
      hours: input.hours,
    });
    revalidatePath("/admin/configuracoes");
    revalidatePath("/");
    return { ok: true as const };
  } catch (error) {
    return fail(error);
  }
}
