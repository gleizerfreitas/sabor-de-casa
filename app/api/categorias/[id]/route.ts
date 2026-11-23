import { NextRequest } from "next/server";
import { updateCategory, deleteCategory } from "@/src/server/services/catalog-service";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { requireApiAdmin } from "@/app/api/middleware/auth";
import { successResponse } from "@/app/api/utils/response-builder";
import { mapErrorToApiResponse } from "@/app/api/errors/api-error";
import { categorySchema } from "@/src/validations/catalog";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireApiAdmin();
    const body = await request.json();
    const { name } = categorySchema.parse(body);
    const { id } = await params;
    
    const supabase = await createSupabaseServerClient();
    const category = await updateCategory(supabase, id, name);
    return successResponse(category);
  } catch (error) {
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireApiAdmin();
    const { id } = await params;
    const supabase = await createSupabaseServerClient();
    await deleteCategory(supabase, id);
    return new Response(null, { status: 204 });
  } catch (error) {
    const { status, body } = mapErrorToApiResponse(error);
    return Response.json(body, { status });
  }
}
