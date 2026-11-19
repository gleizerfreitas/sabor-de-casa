import type { SupabaseClient } from "@supabase/supabase-js";
import type { Category, Dish } from "@/src/types/catalog";

export async function removeUploadedPhoto(supabase: SupabaseClient, path: string) {
  const result = await supabase.storage.from("dish-photos").remove([path]);
  if (result.error) {
    throw result.error;
  }
}

export async function listCatalog(supabase: SupabaseClient) {
  const [categories, dishes] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("dishes").select("*").order("name"),
  ]);
  if (categories.error) throw new Error(`Não foi possível carregar categorias: ${categories.error.message}`);
  if (dishes.error) throw new Error(`Não foi possível carregar pratos: ${dishes.error.message}`);
  return { categories: (categories.data ?? []) as Category[], dishes: (dishes.data ?? []) as Dish[] };
}

export async function createCategory(supabase: SupabaseClient, name: string) {
  const result = await supabase.from("categories").insert({ name }).select().single();
  if (result.error) throw new Error(result.error.code === "23505" ? "Já existe uma categoria com esse nome." : "Não foi possível criar a categoria.");
  return result.data as Category;
}

export async function updateCategory(supabase: SupabaseClient, id: string, name: string) {
  const result = await supabase.from("categories").update({ name }).eq("id", id).select().single();
  if (result.error) throw new Error(result.error.code === "23505" ? "Já existe uma categoria com esse nome." : "Não foi possível atualizar a categoria.");
  return result.data as Category;
}

export async function deleteCategory(supabase: SupabaseClient, id: string) {
  const result = await supabase.from("categories").delete().eq("id", id);
  if (result.error) throw new Error(result.error.code === "23503" ? "Não é possível excluir uma categoria que possui pratos." : "Não foi possível excluir a categoria.");
}

export async function deleteDish(supabase: SupabaseClient, id: string) {
  const dish = await supabase
    .from("dishes")
    .select("photo_url")
    .eq("id", id)
    .maybeSingle();

  if (dish.error) throw new Error("Não foi possível localizar o prato.");
  if (!dish.data) throw new Error("Prato não encontrado.");

  const result = await supabase.from("dishes").delete().eq("id", id);
  if (result.error) {
    throw new Error(
      result.error.code === "23503"
        ? "Não é possível excluir um prato associado a cardápios."
        : "Não foi possível excluir o prato.",
    );
  }

  const photoUrl = dish.data.photo_url as string;
  const marker = "/dish-photos/";
  const markerIndex = photoUrl.indexOf(marker);
  if (markerIndex >= 0) {
    const path = decodeURIComponent(photoUrl.slice(markerIndex + marker.length));
    try {
      await removeUploadedPhoto(supabase, path);
    } catch {
      // A exclusão do registro já foi concluída; uma fotografia órfã não pode reverter o prato.
      console.error(`Não foi possível remover a fotografia do prato ${id}.`);
    }
  }
}
