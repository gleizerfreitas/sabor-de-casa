import { NextRequest } from "next/server";
import { updateCategory, deleteCategory } from "@/src/server/services/catalog-service";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { requireApiAdmin } from "@/app/api/middleware/auth";
import { successResponse } from "@/app/api/utils/response-builder";
import { mapErrorToApiResponse } from "@/app/api/errors/api-error";
import { categorySchema } from "@/src/validations/catalog";

/**
 * PUT /api/categorias/{id}
 * 
 * Atualiza uma categoria existente.
 * Requer autenticação administrativa.
 * 
 * Request body:
 * { "name": "Bebidas" }
 * 
 * Resposta de sucesso (200):
 * { "data": { "id": "...", "name": "Bebidas", "created_at": "...", "updated_at": "..." } }
 * 
 * Erros possíveis:
 * - 400: Dados inválidos
 * - 401: Não autenticado
 * - 403: Sem permissão
 * - 404: Categoria não encontrada
 * - 409: Categoria com esse nome já existe
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await requireApiAdmin();
    const body = await request.json();
    const { name } = categorySchema.parse(body);
    
    const supabase = await createSupabaseServerClient();
    const category = await updateCategory(supabase, params.id, name);
    return successResponse(category);
  } catch (error) {
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}

/**
 * DELETE /api/categorias/{id}
 * 
 * Exclui uma categoria.
 * Requer autenticação administrativa.
 * Uma categoria só pode ser excluída se não possui pratos vinculados.
 * 
 * Resposta de sucesso (204):
 * (sem corpo)
 * 
 * Erros possíveis:
 * - 401: Não autenticado
 * - 403: Sem permissão
 * - 404: Categoria não encontrada
 * - 409: Categoria possui pratos vinculados
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await requireApiAdmin();
    const supabase = await createSupabaseServerClient();
    await deleteCategory(supabase, params.id);
    return new Response(null, { status: 204 });
  } catch (error) {
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}
