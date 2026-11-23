import { NextRequest } from "next/server";
import { getDailyMenu, deleteDailyMenu, publishDailyMenu } from "@/src/server/services/menu-service";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { requireApiAdmin } from "@/app/api/middleware/auth";
import { successResponse } from "@/app/api/utils/response-builder";
import { mapErrorToApiResponse } from "@/app/api/errors/api-error";

/**
 * GET /api/cardapios/{id}
 * Obtém um cardápio específico com seus itens.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireApiAdmin();
    const { id } = await params;
    const supabase = await createSupabaseServerClient();
    const menu = await getDailyMenu(supabase, id);
    return successResponse(menu);
  } catch (error) {
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}

/**
 * PUT /api/cardapios/{id}
 * Atualiza um cardápio (data, itens, status).
 * Request: { menuDate: "...", dishIds: [...], status: "RASCUNHO" | "PUBLICADO" }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireApiAdmin();
    // Implementação completa em Fase 3 final
    return Response.json(
      { error: { code: "NOT_IMPLEMENTED", message: "PUT /api/cardapios será implementado" } },
      { status: 501 },
    );
  } catch (error) {
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}

/**
 * DELETE /api/cardapios/{id}
 * Deleta um cardápio.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireApiAdmin();
    const { id } = await params;
    const supabase = await createSupabaseServerClient();
    await deleteDailyMenu(supabase, id);
    return new Response(null, { status: 204 });
  } catch (error) {
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}
