import { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { requireApiAdmin } from "@/app/api/middleware/auth";
import { successResponse } from "@/app/api/utils/response-builder";
import { mapErrorToApiResponse } from "@/app/api/errors/api-error";
import { inspectImage, validatePhoto } from "@/src/server/catalog/photo-validation";

/**
 * PUT /api/pratos/{id}
 * Atualiza um prato existente.
 * Request: multipart/form-data (photo é opcional)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  let supabase: Awaited<ReturnType<typeof createSupabaseServerClient>> | undefined;
  let uploadedPath: string | undefined;

  try {
    await requireApiAdmin();
    const { id } = await params;

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = (formData.get("description") as string) ?? "";
    const price = formData.get("price");
    const categoryId = formData.get("categoryId") as string;
    const isActive = formData.get("isActive") === "true";
    const photoFile = formData.get("photo") as File | null;

    if (!name || !price || !categoryId) {
      return Response.json(
        { error: { code: "VALIDATION_ERROR", message: "Campos obrigatórios faltando: name, price, categoryId" } },
        { status: 400 },
      );
    }

    supabase = await createSupabaseServerClient();
    const values: Record<string, unknown> = {
      name,
      description,
      price: parseFloat(price as string),
      category_id: categoryId,
      is_active: isActive,
    };

    if (photoFile && photoFile.size > 0) {
      await validatePhoto(photoFile);
      const buffer = await photoFile.arrayBuffer();
      const photoBuffer = Buffer.from(buffer);
      const detected = inspectImage(photoBuffer);

      if (!detected) {
        return Response.json(
          { error: { code: "VALIDATION_ERROR", message: "A fotografia possui conteúdo inválido." } },
          { status: 400 },
        );
      }

      const extension = detected.mime === "image/png" ? "png" : detected.mime === "image/webp" ? "webp" : "jpg";
      uploadedPath = `${crypto.randomUUID()}.${extension}`;

      const upload = await supabase.storage.from("dish-photos").upload(uploadedPath, photoBuffer, { contentType: detected.mime });
      if (upload.error) {
        return Response.json(
          { error: { code: "UPLOAD_ERROR", message: "Não foi possível enviar a fotografia." } },
          { status: 500 },
        );
      }

      values.photo_url = supabase.storage.from("dish-photos").getPublicUrl(uploadedPath).data.publicUrl;
    }

    const result = await supabase.from("dishes").update(values).eq("id", id).select().single();

    if (result.error) {
      throw result.error;
    }

    return successResponse(result.data);
  } catch (error) {
    if (uploadedPath && supabase) {
      try {
        await supabase.storage.from("dish-photos").remove([uploadedPath]);
      } catch {
        console.error(`Falha ao remover foto órfã: ${uploadedPath}`);
      }
    }
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}

/**
 * DELETE /api/pratos/{id}
 * Deleta um prato e sua fotografia.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireApiAdmin();
    const { id } = await params;
    
    const supabase = await createSupabaseServerClient();
    const dish = await supabase
      .from("dishes")
      .select("photo_url")
      .eq("id", id)
      .maybeSingle();

    if (dish.error) {
      return Response.json(
        { error: { code: "NOT_FOUND", message: "Prato não encontrado." } },
        { status: 404 },
      );
    }

    if (!dish.data) {
      return Response.json(
        { error: { code: "NOT_FOUND", message: "Prato não encontrado." } },
        { status: 404 },
      );
    }

    const result = await supabase.from("dishes").delete().eq("id", id);
    if (result.error) {
      throw result.error;
    }

    const photoUrl = dish.data.photo_url as string;
    const marker = "/dish-photos/";
    const markerIndex = photoUrl.indexOf(marker);
    if (markerIndex >= 0) {
      const path = decodeURIComponent(photoUrl.slice(markerIndex + marker.length));
      try {
        await supabase.storage.from("dish-photos").remove([path]);
      } catch {
        console.error(`Falha ao remover foto do prato ${id}.`);
      }
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}
