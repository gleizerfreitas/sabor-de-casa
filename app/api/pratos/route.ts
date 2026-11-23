import { NextRequest } from "next/server";
import { listCatalog } from "@/src/server/services/catalog-service";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { requireApiAdmin } from "@/app/api/middleware/auth";
import { successResponse } from "@/app/api/utils/response-builder";
import { mapErrorToApiResponse } from "@/app/api/errors/api-error";

/**
 * GET /api/pratos
 * 
 * Lista todos os pratos cadastrados.
 * Requer autenticação administrativa.
 * 
 * Resposta de sucesso (200):
 * { "data": [{ "id": "...", "name": "...", "price": 15.90, "category_id": "...", ... }] }
 */
export async function GET() {
  try {
    await requireApiAdmin();
    const supabase = await createSupabaseServerClient();
    const { dishes } = await listCatalog(supabase);
    return successResponse(dishes);
  } catch (error) {
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}

/**
 * POST /api/pratos
 * 
 * Cria um novo prato.
 * Requer autenticação administrativa.
 * 
 * Request: multipart/form-data
 * - name (string): Nome do prato
 * - description (string, opcional): Descrição
 * - price (number): Preço em reais (> 0)
 * - categoryId (string): ID da categoria
 * - isActive (boolean, default: true): Se está ativo
 * - photo (File): Fotografia do prato
 * 
 * Resposta de sucesso (201):
 * { "data": { "id": "...", "name": "...", "price": 15.90, ... } }
 * 
 * Erros possíveis:
 * - 400: Dados inválidos
 * - 401: Não autenticado
 * - 403: Sem permissão
 * - 404: Categoria não encontrada
 */
export async function POST(request: NextRequest) {
  try {
    await requireApiAdmin();
    // Implementado em Fase 2 junto com refatoração de upload
    // Por enquanto, retornar erro indicando que é preciso usar FormData via fetch
    return Response.json(
      { error: { code: "NOT_IMPLEMENTED", message: "Use POST com FormData multipart/form-data" } },
      { status: 501 },
    );
  } catch (error) {
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}
