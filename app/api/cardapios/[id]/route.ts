import { NextRequest } from "next/server";
import { getDailyMenu, saveDailyMenu, deleteDailyMenu } from "@/src/server/services/menu-service";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { requireApiAdmin } from "@/app/api/middleware/auth";
import { successResponse } from "@/app/api/utils/response-builder";
import { mapErrorToApiResponse } from "@/app/api/errors/api-error";
import { dailyMenuSchema } from "@/src/validations/menu";

/**
 * GET /api/cardapios/{id}
 * Obtém um cardápio específico com seus itens.
 * Requer autenticação administrativa.
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
    if (!menu) {
      return Response.json(
        { error: { code: "NOT_FOUND", message: "Cardápio não encontrado." } },
        { status: 404 },
      );
    }
    return successResponse(menu);
  } catch (error) {
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}

/**
 * PUT /api/cardapios/{id}
 * Atualiza um cardápio (data, itens).
 * Requer autenticação administrativa.
 * 
 * Request body:
 * { "menuDate": "2026-11-23", "dishIds": ["id1", "id2", "id3"] }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireApiAdmin();
    const { id } = await params;
    const body = await request.json();
    const { date, dishIds } = dailyMenuSchema.parse(body);

    const supabase = await createSupabaseServerClient();
    await saveDailyMenu(supabase, id, date, dishIds);

    return successResponse({ id, menu_date: date, dishIds });
  } catch (error) {
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}

/**
 * DELETE /api/cardapios/{id}
 * Deleta um cardápio.
 * Requer autenticação administrativa.
 * 
 * Resposta de sucesso (204):
 * (sem corpo)
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
