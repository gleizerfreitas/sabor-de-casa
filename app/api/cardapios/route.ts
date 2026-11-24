import { NextRequest } from "next/server";
import { listDailyMenus, saveDailyMenu } from "@/src/server/services/menu-service";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { requireApiAdmin } from "@/app/api/middleware/auth";
import { successResponse } from "@/app/api/utils/response-builder";
import { mapErrorToApiResponse } from "@/app/api/errors/api-error";
import { dailyMenuSchema } from "@/src/validations/menu";

/**
 * GET /api/cardapios
 * Lista todos os cardápios diários.
 * Requer autenticação administrativa.
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
 * Cria um novo cardápio diário.
 * Requer autenticação administrativa.
 * 
 * Request body:
 * { "menuDate": "2026-11-23", "dishIds": ["id1", "id2", "id3"] }
 * 
 * Resposta de sucesso (201):
 * { "data": { "id": "...", "menu_date": "2026-11-23", "status": "RASCUNHO", ... } }
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
    const body = await request.json();
    const { date, dishIds } = dailyMenuSchema.parse(body);

    const supabase = await createSupabaseServerClient();
    await saveDailyMenu(supabase, null, date, dishIds);

    return successResponse({ id: null, menu_date: date, dishIds }, 201);
  } catch (error) {
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}
