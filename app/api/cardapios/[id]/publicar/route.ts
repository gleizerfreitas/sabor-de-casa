import { NextRequest } from "next/server";
import { publishDailyMenu } from "@/src/server/services/menu-service";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { requireApiAdmin } from "@/app/api/middleware/auth";
import { successResponse } from "@/app/api/utils/response-builder";
import { mapErrorToApiResponse } from "@/app/api/errors/api-error";

/**
 * PATCH /api/cardapios/{id}/publicar
 * Publica um cardápio (muda status de RASCUNHO para PUBLICADO).
 */
export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireApiAdmin();
    const { id } = await params;
    const supabase = await createSupabaseServerClient();
    await publishDailyMenu(supabase, id);
    return successResponse(null);
  } catch (error) {
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}
