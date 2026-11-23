import { getTodayMenuSummary } from "@/src/server/services/menu-service";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { requireApiAdmin } from "@/app/api/middleware/auth";
import { successResponse } from "@/app/api/utils/response-builder";
import { mapErrorToApiResponse } from "@/app/api/errors/api-error";

/**
 * GET /api/cardapios/hoje-resumo
 * 
 * Obtém um resumo do cardápio de hoje e próximos cardápios.
 * Requer autenticação administrativa.
 * 
 * Resposta de sucesso (200):
 * { "data": { "ownerName": "...", "today": "2026-11-23", "menu": {...}, "upcomingMenus": [...] } }
 */
export async function GET() {
  try {
    await requireApiAdmin();
    const supabase = await createSupabaseServerClient();
    const data = await getTodayMenuSummary(supabase);
    return successResponse(data);
  } catch (error) {
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}
