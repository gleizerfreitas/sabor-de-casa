import { beforeEach, describe, expect, it, vi } from "vitest";
import { saveDish } from "@/src/app-actions/catalog";

const mocks = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
  requireAdmin: vi.fn(),
  createSupabaseServerClient: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
  updateEq: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

vi.mock("@/src/server/auth/require-admin", () => ({
  requireAdmin: mocks.requireAdmin,
}));

vi.mock("@/src/lib/supabase/server", () => ({
  createSupabaseServerClient: mocks.createSupabaseServerClient,
}));

vi.mock("@/src/server/services/catalog-service", () => ({
  createCategory: vi.fn(),
  deleteCategory: vi.fn(),
  deleteDish: vi.fn(),
  removeUploadedPhoto: vi.fn(),
  updateCategory: vi.fn(),
}));

describe("saveDish", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAdmin.mockResolvedValue(undefined);
    mocks.insert.mockResolvedValue({ error: null });
    mocks.update.mockReturnValue({ eq: mocks.updateEq });
    mocks.updateEq.mockResolvedValue({ error: null });
    mocks.createSupabaseServerClient.mockResolvedValue({
      from: vi.fn(() => ({
        insert: mocks.insert,
        update: mocks.update,
      })),
    });
  });

  function dishFormData() {
    const formData = new FormData();
    formData.set("name", "Frango");
    formData.set("description", "");
    formData.set("price", "25");
    formData.set("categoryId", "11111111-1111-1111-1111-111111111111");
    formData.set("isActive", "true");
    return formData;
  }

  it("revalida o catálogo após criar um prato", async () => {
    const result = await saveDish(null, dishFormData());

    expect(result).toEqual({ ok: true });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/admin/catalogo");
  });

  it("revalida o catálogo após editar um prato", async () => {
    const dishId = "22222222-2222-2222-2222-222222222222";

    const result = await saveDish(dishId, dishFormData());

    expect(result).toEqual({ ok: true });
    expect(mocks.updateEq).toHaveBeenCalledWith("id", dishId);
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/admin/catalogo");
  });
});
