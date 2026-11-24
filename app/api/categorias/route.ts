import { NextRequest } from "next/server";
import { listCatalog, createCategory } from "@/src/server/services/catalog-service";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { requireApiAdmin } from "@/app/api/middleware/auth";
import { successResponse } from "@/app/api/utils/response-builder";
import { mapErrorToApiResponse } from "@/app/api/errors/api-error";
import { categorySchema } from "@/src/validations/catalog";

/**
 * GET /api/categorias
 * 
 * Lista todas as categorias cadastradas.
 * Requer autenticação administrativa.
 * 
 * Resposta de sucesso (200):
 * { "data": [{ "id": "...", "name": "...", "created_at": "...", "updated_at": "..." }] }
 */
export async function GET() {
  try {
    await requireApiAdmin();
    const supabase = await createSupabaseServerClient();
    const { categories } = await listCatalog(supabase);
    return successResponse(categories);
  } catch (error) {
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}

/**
 * POST /api/categorias
 * 
 * Cria uma nova categoria.
 * Requer autenticação administrativa.
 * 
 * Request body:
 * { "name": "Bebidas" }
 * 
 * Resposta de sucesso (201):
 * { "data": { "id": "...", "name": "Bebidas", "created_at": "...", "updated_at": "..." } }
 * 
 * Erros possíveis:
 * - 400: Dados inválidos
 * - 401: Não autenticado
 * - 403: Sem permissão
 * - 409: Categoria com esse nome já existe
 */
export async function POST(request: NextRequest) {
  try {
    await requireApiAdmin();
    const body = await request.json();
    const { name } = categorySchema.parse(body);
    
    const supabase = await createSupabaseServerClient();
    const category = await createCategory(supabase, name);
    return successResponse(category, 201);
  } catch (error) {
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}
