import { NextRequest } from "next/server";
import { setMenuItemAvailability } from "@/src/server/services/menu-service";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { requireApiAdmin } from "@/app/api/middleware/auth";
import { successResponse } from "@/app/api/utils/response-builder";
import { mapErrorToApiResponse } from "@/app/api/errors/api-error";
import { z } from "zod";

const updateAvailabilitySchema = z.object({
  dishId: z.string().uuid(),
  available: z.boolean(),
});

/**
 * PATCH /api/cardapios/{id}/disponibilidade/items
 * 
 * Atualiza a disponibilidade de um prato no cardápio de hoje.
 * Requer autenticação administrativa.
 * Só funciona para o cardápio da data atual e status PUBLICADO.
 * 
 * Request body:
 * { "dishId": "uuid", "available": true }
 * 
 * Resposta de sucesso (200):
 * { "data": null }
 * 
 * Erros possíveis:
 * - 400: Dados inválidos
 * - 401: Não autenticado
 * - 403: Sem permissão
 * - 409: Cardápio não é de hoje ou não foi publicado
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await requireApiAdmin();
    const body = await request.json();
    const { dishId, available } = updateAvailabilitySchema.parse(body);
    
    const supabase = await createSupabaseServerClient();
    await setMenuItemAvailability(supabase, params.id, dishId, available);
    return successResponse(null);
  } catch (error) {
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}
