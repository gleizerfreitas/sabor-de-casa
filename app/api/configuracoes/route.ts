import { NextRequest } from "next/server";
import { getAdminSettings, updateAdminSettings } from "@/src/server/services/settings-service";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { requireApiAdmin } from "@/app/api/middleware/auth";
import { successResponse } from "@/app/api/utils/response-builder";
import { mapErrorToApiResponse } from "@/app/api/errors/api-error";
import { settingsSchema } from "@/src/validations/settings";

/**
 * GET /api/configuracoes
 * 
 * Obtém as configurações administrativas.
 * Requer autenticação administrativa.
 * 
 * Resposta de sucesso (200):
 * { "data": { "id": "...", "owner_name": "...", "whatsapp": "...", "timezone": "...", "business_hours": [...] } }
 */
export async function GET() {
  try {
    await requireApiAdmin();
    const supabase = await createSupabaseServerClient();
    const settings = await getAdminSettings(supabase);
    return successResponse(settings);
  } catch (error) {
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}

/**
 * PUT /api/configuracoes
 * 
 * Atualiza as configurações administrativas.
 * Requer autenticação administrativa.
 * 
 * Request body:
 * {
 *   "ownerName": "Maria",
 *   "whatsapp": "5585987654321",
 *   "timezone": "America/Fortaleza",
 *   "businessHours": [
 *     { "day_of_week": "MON", "is_open": true, "opening_time": "11:00", "closing_time": "14:00" },
 *     ...
 *   ]
 * }
 * 
 * Resposta de sucesso (200):
 * { "data": null }
 * 
 * Erros possíveis:
 * - 400: Dados inválidos
 * - 401: Não autenticado
 * - 403: Sem permissão
 */
export async function PUT(request: NextRequest) {
  try {
    await requireApiAdmin();
    const body = await request.json();
    const input = settingsSchema.parse(body);
    
    const supabase = await createSupabaseServerClient();
    await updateAdminSettings(supabase, {
      ownerName: input.ownerName,
      whatsapp: input.whatsapp,
      timezone: input.timezone,
      hours: input.businessHours.map((hour) => ({
        dayOfWeek: hour.day_of_week,
        isOpen: hour.is_open,
        openingTime: hour.opening_time,
        closingTime: hour.closing_time,
      })),
    });
    return successResponse(null);
  } catch (error) {
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}
