import { NextRequest } from "next/server";
import { getAdminSettings, updateAdminSettings } from "@/src/server/services/settings-service";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { requireApiAdmin } from "@/app/api/middleware/auth";
import { successResponse } from "@/app/api/utils/response-builder";
import { mapErrorToApiResponse } from "@/app/api/errors/api-error";

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

export async function PUT(request: NextRequest) {
  try {
    await requireApiAdmin();
    const body = await request.json();
    
    const supabase = await createSupabaseServerClient();
    await updateAdminSettings(supabase, {
      ownerName: body.ownerName,
      whatsapp: body.whatsapp,
      timezone: body.timezone,
      hours: body.businessHours.map((hour: { day_of_week: string; is_open: boolean; opening_time: string | null; closing_time: string | null }) => ({
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
