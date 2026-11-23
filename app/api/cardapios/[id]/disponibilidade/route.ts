import { NextRequest } from "next/server";
import { getTodayMenuAvailability } from "@/src/server/services/menu-service";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { requireApiAdmin } from "@/app/api/middleware/auth";
import { successResponse } from "@/app/api/utils/response-builder";
import { mapErrorToApiResponse } from "@/app/api/errors/api-error";

/**
 * GET /api/cardapios/{id}/disponibilidade
 * 
 * Obtém a disponibilidade dos pratos do cardápio de hoje.
 * Requer autenticação administrativa.
 * Só funciona para o cardápio da data atual e status PUBLICADO.
 * 
 * Resposta de sucesso (200):
 * { "data": { "menu": {...}, "items": [{ "dish_id": "...", "available": true, "name": "..." }] } }
 * 
 * Erros possíveis:
 * - 401: Não autenticado
 * - 403: Sem permissão
 * - 409: Cardápio não é de hoje ou não foi publicado
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await requireApiAdmin();
    const supabase = await createSupabaseServerClient();
    const data = await getTodayMenuAvailability(supabase, params.id);
    return successResponse(data);
  } catch (error) {
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}
