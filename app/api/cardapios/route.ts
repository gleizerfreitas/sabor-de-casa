import { NextRequest } from "next/server";
import { listDailyMenus } from "@/src/server/services/menu-service";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { requireApiAdmin } from "@/app/api/middleware/auth";
import { successResponse } from "@/app/api/utils/response-builder";
import { mapErrorToApiResponse } from "@/app/api/errors/api-error";

/**
 * GET /api/cardapios
 * 
 * Lista todos os cardápios diários.
 * Requer autenticação administrativa.
 * 
 * Resposta de sucesso (200):
 * { "data": { "activeMenus": [...], "pastMenuCount": 5 } }
 */
export async function GET() {
  try {
    await requireApiAdmin();
    const supabase = await createSupabaseServerClient();
    const data = await listDailyMenus(supabase);
    return successResponse(data);
  } catch (error) {
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}

/**
 * POST /api/cardapios
 * 
 * Cria um novo cardápio diário.
 * Requer autenticação administrativa.
 * 
 * Request body:
 * { "menuDate": "2026-11-23", "dishIds": ["id1", "id2", "id3"] }
 * 
 * Resposta de sucesso (201):
 * { "data": { "id": "...", "menu_date": "...", "status": "RASCUNHO", ... } }
 * 
 * Erros possíveis:
 * - 400: Dados inválidos
 * - 401: Não autenticado
 * - 403: Sem permissão
 * - 409: Já existe cardápio para essa data
 */
export async function POST(request: NextRequest) {
  try {
    await requireApiAdmin();
    // Implementado em Fase 2
    return Response.json(
      { error: { code: "NOT_IMPLEMENTED", message: "POST /api/cardapios será implementado em breve" } },
      { status: 501 },
    );
  } catch (error) {
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}
