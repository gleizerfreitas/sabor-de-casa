import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { successResponse } from "@/app/api/utils/response-builder";
import { mapErrorToApiResponse } from "@/app/api/errors/api-error";
import { getPublicMenu } from "@/src/server/services/public-menu-service";

/**
 * GET /api/publica/cardapio
 * 
 * Obtém o menu publicado de hoje para visualização pública.
 * Sem autenticação requerida.
 * 
 * Resposta de sucesso (200):
 * { "data": { "menu": {...}, "categories": [...] } }
 */
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const data = await getPublicMenu(supabase);
    return successResponse(data);
  } catch (error) {
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}
