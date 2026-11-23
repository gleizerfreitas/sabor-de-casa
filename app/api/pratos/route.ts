import { NextRequest } from "next/server";
import { listCatalog } from "@/src/server/services/catalog-service";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { requireApiAdmin } from "@/app/api/middleware/auth";
import { successResponse } from "@/app/api/utils/response-builder";
import { mapErrorToApiResponse } from "@/app/api/errors/api-error";
import { inspectImage, validatePhoto } from "@/src/server/catalog/photo-validation";

/**
 * GET /api/pratos
 * Lista todos os pratos cadastrados.
 * Requer autenticação administrativa.
 */
export async function GET() {
  try {
    await requireApiAdmin();
    const supabase = await createSupabaseServerClient();
    const { dishes } = await listCatalog(supabase);
    return successResponse(dishes);
  } catch (error) {
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}

/**
 * POST /api/pratos
 * Cria um novo prato com foto.
 * Request: multipart/form-data
 * - name, description, price, categoryId, isActive, photo
 */
export async function POST(request: NextRequest) {
  let supabase: Awaited<ReturnType<typeof createSupabaseServerClient>> | undefined;
  let uploadedPath: string | undefined;
  
  try {
    await requireApiAdmin();
    
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = (formData.get("description") as string) ?? "";
    const price = formData.get("price");
    const categoryId = formData.get("categoryId") as string;
    const isActive = formData.get("isActive") === "true";
    const photoFile = formData.get("photo") as File | null;

    if (!name || !price || !categoryId || !photoFile) {
      return Response.json(
        { error: { code: "VALIDATION_ERROR", message: "Campos obrigatórios faltando: name, price, categoryId, photo" } },
        { status: 400 },
      );
    }

    const buffer = await photoFile.arrayBuffer();
    const photoBuffer = Buffer.from(buffer);
    const validated = await validatePhoto(photoFile);

    supabase = await createSupabaseServerClient();
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

    const photoUrl = supabase.storage.from("dish-photos").getPublicUrl(uploadedPath).data.publicUrl;

    const result = await supabase.from("dishes").insert({
      name,
      description,
      price: parseFloat(price as string),
      category_id: categoryId,
      is_active: isActive,
      photo_url: photoUrl,
    }).select().single();

    if (result.error) {
      throw result.error;
    }

    return successResponse(result.data, 201);
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
