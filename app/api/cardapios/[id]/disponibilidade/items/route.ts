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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireApiAdmin();
    const body = await request.json();
    const { dishId, available } = updateAvailabilitySchema.parse(body);
    const { id } = await params;
    
    const supabase = await createSupabaseServerClient();
    await setMenuItemAvailability(supabase, id, dishId, available);
    return successResponse(null);
  } catch (error) {
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}
