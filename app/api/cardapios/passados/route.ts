import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { requireApiAdmin } from "@/app/api/middleware/auth";
import { successResponse } from "@/app/api/utils/response-builder";
import { mapErrorToApiResponse } from "@/app/api/errors/api-error";
import { deletePastDailyMenus } from "@/src/server/services/menu-service";

/**
 * DELETE /api/cardapios/passados
 * 
 * Remove todos os cardápios de datas passadas.
 * Requer autenticação administrativa.
 * 
 * Resposta de sucesso (200):
 * { "data": { "deletedCount": number } }
 */
export async function DELETE() {
  try {
    await requireApiAdmin();
    const supabase = await createSupabaseServerClient();
    const deletedCount = await deletePastDailyMenus(supabase);
    return successResponse({ deletedCount });
  } catch (error) {
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}
