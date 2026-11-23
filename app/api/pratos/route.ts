import { NextRequest } from "next/server";
import { listCatalog, createCategory } from "@/src/server/services/catalog-service";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { requireApiAdmin } from "@/app/api/middleware/auth";
import { successResponse } from "@/app/api/utils/response-builder";
import { mapErrorToApiResponse } from "@/app/api/errors/api-error";

/**
 * GET /api/pratos
 * Lista todos os pratos cadastrados.
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
  try {
    await requireApiAdmin();
    // Parsing de FormData será feito em Fase 3 completa
    // Por enquanto, retornar placeholder
    return Response.json(
      { error: { code: "NOT_IMPLEMENTED", message: "POST /api/pratos com upload será implementado em breve" } },
      { status: 501 },
    );
  } catch (error) {
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}
