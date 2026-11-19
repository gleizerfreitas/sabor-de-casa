import { describe, expect, it, vi } from "vitest";
import { deleteDish, removeUploadedPhoto } from "@/src/server/services/catalog-service";

describe("removeUploadedPhoto", () => {
  it("removes exactly the newly uploaded path", async () => {
    const remove = vi.fn().mockResolvedValue({ error: null });
    const supabase = { storage: { from: vi.fn().mockReturnValue({ remove }) } };

    await removeUploadedPhoto(supabase as never, "dish-photo.webp");

    expect(supabase.storage.from).toHaveBeenCalledWith("dish-photos");
    expect(remove).toHaveBeenCalledWith(["dish-photo.webp"]);
  });

  describe("deleteDish", () => {
    it("exclui prato sem referências e remove sua fotografia", async () => {
      const maybeSingle = vi.fn().mockResolvedValue({
        data: { photo_url: "https://example.supabase.co/storage/v1/object/public/dish-photos/feijoada.webp" },
        error: null,
      });
      const deleteEq = vi.fn().mockResolvedValue({ error: null });
      const remove = vi.fn().mockResolvedValue({ error: null });
      const supabase = {
        from: vi.fn()
          .mockReturnValueOnce({
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({ maybeSingle }),
            }),
          })
          .mockReturnValueOnce({
            delete: vi.fn().mockReturnValue({ eq: deleteEq }),
          }),
        storage: { from: vi.fn().mockReturnValue({ remove }) },
      };

      await deleteDish(supabase as never, "11111111-1111-1111-1111-111111111111");

      expect(deleteEq).toHaveBeenCalledWith("id", "11111111-1111-1111-1111-111111111111");
      expect(remove).toHaveBeenCalledWith(["feijoada.webp"]);
    });

    it("impede a exclusão de prato associado a cardápio", async () => {
      const supabase = {
        from: vi.fn()
          .mockReturnValueOnce({
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({
                  data: { photo_url: "https://example.supabase.co/storage/v1/object/public/dish-photos/feijoada.webp" },
                  error: null,
                }),
              }),
            }),
          })
          .mockReturnValueOnce({
            delete: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: { code: "23503", message: "foreign key violation" } }),
            }),
          }),
      };

      await expect(
        deleteDish(supabase as never, "11111111-1111-1111-1111-111111111111"),
      ).rejects.toThrow("Não é possível excluir um prato associado a cardápios.");
    });

    it("rejeita a exclusão de prato inexistente", async () => {
      const supabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
            }),
          }),
        }),
      };

      await expect(
        deleteDish(supabase as never, "11111111-1111-1111-1111-111111111111"),
      ).rejects.toThrow("Prato não encontrado.");
    });
  });

  it("propagates cleanup failures", async () => {
    const error = new Error("storage unavailable");
    const supabase = {
      storage: { from: vi.fn().mockReturnValue({ remove: vi.fn().mockResolvedValue({ error }) }) },
    };

    await expect(removeUploadedPhoto(supabase as never, "dish-photo.webp")).rejects.toBe(error);
  });
});
