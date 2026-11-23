import { NextRequest } from "next/server";
import { deleteDish } from "@/src/server/services/catalog-service";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { requireApiAdmin } from "@/app/api/middleware/auth";
import { mapErrorToApiResponse } from "@/app/api/errors/api-error";

/**
 * DELETE /api/pratos/{id}
 * 
 * Exclui um prato e sua fotografia.
 * Requer autenticação administrativa.
 * Um prato só pode ser excluído se não está associado a nenhum cardápio.
 * 
 * Resposta de sucesso (204):
 * (sem corpo)
 * 
 * Erros possíveis:
 * - 401: Não autenticado
 * - 403: Sem permissão
 * - 404: Prato não encontrado
 * - 409: Prato associado a cardápio
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await requireApiAdmin();
    const supabase = await createSupabaseServerClient();
    await deleteDish(supabase, params.id);
    return new Response(null, { status: 204 });
  } catch (error) {
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}
