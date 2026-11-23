import { NextRequest } from "next/server";
import { deleteDish } from "@/src/server/services/catalog-service";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { requireApiAdmin } from "@/app/api/middleware/auth";
import { mapErrorToApiResponse } from "@/app/api/errors/api-error";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireApiAdmin();
    const { id } = await params;
    const supabase = await createSupabaseServerClient();
    await deleteDish(supabase, id);
    return new Response(null, { status: 204 });
  } catch (error) {
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}
