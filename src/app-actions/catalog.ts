"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { requireAdmin } from "@/src/server/auth/require-admin";
import { createCategory, deleteCategory, deleteDish, removeUploadedPhoto, updateCategory } from "@/src/server/services/catalog-service";
import { categorySchema, dishSchema } from "@/src/validations/catalog";
import { inspectImage, validatePhoto } from "@/src/server/catalog/photo-validation";

const fail = (error: unknown) => ({ ok: false as const, error: error instanceof Error ? error.message : "Não foi possível concluir a operação." });

export async function saveCategory(id: string | null, formData: FormData) {
  try {
    await requireAdmin();
    const { name } = categorySchema.parse({ name: formData.get("name") });
    const supabase = await createSupabaseServerClient();
    const category = id ? await updateCategory(supabase, id, name) : await createCategory(supabase, name);
    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/pedido");
    return { ok: true as const, category };
  } catch (error) { return fail(error); }
}

export async function removeCategory(id: string) {
  try { await requireAdmin(); await deleteCategory(await createSupabaseServerClient(), id); revalidatePath("/admin"); revalidatePath("/"); revalidatePath("/pedido"); return { ok: true as const }; }
  catch (error) { return fail(error); }
}

export async function removeDish(id: string) {
  try {
    await requireAdmin();
    await deleteDish(await createSupabaseServerClient(), id);
    revalidatePath("/admin");
    revalidatePath("/admin/catalogo");
    revalidatePath("/");
    revalidatePath("/pedido");
    return { ok: true as const };
  } catch (error) {
    return fail(error);
  }
}

export async function saveDish(id: string | null, formData: FormData) {
  let supabase: Awaited<ReturnType<typeof createSupabaseServerClient>> | undefined;
  let uploadedPath: string | undefined;
  let persisted = false;
  try {
    await requireAdmin();
    const input = dishSchema.parse({ name: formData.get("name"), description: formData.get("description") ?? "", price: formData.get("price"), categoryId: formData.get("categoryId"), isActive: formData.get("isActive") === "true" });
    const file = formData.get("photo"); const photo = file instanceof File && file.size ? await validatePhoto(file) : null;
    supabase = await createSupabaseServerClient();
    let photoUrl: string | undefined;
    if (photo) {
      const detected = inspectImage(photo);
      if (!detected) throw new Error("A fotografia possui conteúdo inválido.");
      const extension = detected.mime === "image/png" ? "png" : detected.mime === "image/webp" ? "webp" : "jpg";
      uploadedPath = `${crypto.randomUUID()}.${extension}`;
      const upload = await supabase.storage.from("dish-photos").upload(uploadedPath, photo, { contentType: detected.mime, upsert: false });
      if (upload.error) throw new Error("Não foi possível enviar a fotografia.");
      photoUrl = supabase.storage.from("dish-photos").getPublicUrl(uploadedPath).data.publicUrl;
    }
    const values = { name: input.name, description: input.description, price: input.price, category_id: input.categoryId, is_active: input.isActive, ...(photoUrl ? { photo_url: photoUrl } : {}) };
    const result = id ? await supabase.from("dishes").update(values).eq("id", id) : await supabase.from("dishes").insert({ ...values, photo_url: photoUrl ?? "" });
    if (result.error) throw result.error;
    persisted = true;
    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/pedido");
    return { ok: true as const };
  } catch (error) {
    if (uploadedPath && !persisted && supabase) {
      try {
        await removeUploadedPhoto(supabase, uploadedPath);
      } catch {
        // Keep the database/upload error as the action result.
      }
    }
    return fail(error);
  }
}
