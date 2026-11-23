import { describe, it, expect, beforeEach } from "vitest";
import { createCategory, deleteCategory, updateCategory } from "@/src/server/services/catalog-service";
import { DuplicateResourceError, InvalidOperationError, ResourceNotFoundError } from "@/src/server/services/domain-errors";
import { vi } from "vitest";

describe("API Categorias - Exceções de Domínio", () => {
  describe("createCategory", () => {
    it("lança DuplicateResourceError ao tentar criar categoria duplicada", async () => {
      const supabase = {
        from: vi.fn().mockReturnValue({
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                error: { code: "23505", message: "duplicate" },
              }),
            }),
          }),
        }),
      };

      await expect(createCategory(supabase as never, "Bebidas")).rejects.toThrow(DuplicateResourceError);
    });

    it("cria categoria com sucesso", async () => {
      const mockCategory = { id: "uuid-1", name: "Bebidas", created_at: "2026-11-23T00:00:00", updated_at: "2026-11-23T00:00:00" };
      const supabase = {
        from: vi.fn().mockReturnValue({
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: mockCategory,
                error: null,
              }),
            }),
          }),
        }),
      };

      const result = await createCategory(supabase as never, "Bebidas");
      expect(result).toEqual(mockCategory);
    });
  });

  describe("updateCategory", () => {
    it("lança DuplicateResourceError ao atualizar para nome duplicado", async () => {
      const supabase = {
        from: vi.fn().mockReturnValue({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  error: { code: "23505", message: "duplicate" },
                }),
              }),
            }),
          }),
        }),
      };

      await expect(updateCategory(supabase as never, "uuid-1", "Bebidas")).rejects.toThrow(DuplicateResourceError);
    });
  });

  describe("deleteCategory", () => {
    it("lança InvalidOperationError ao tentar deletar categoria com pratos", async () => {
      const supabase = {
        from: vi.fn().mockReturnValue({
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              error: { code: "23503", message: "foreign key" },
            }),
          }),
        }),
      };

      await expect(deleteCategory(supabase as never, "uuid-1")).rejects.toThrow(InvalidOperationError);
    });

    it("deleta categoria com sucesso", async () => {
      const supabase = {
        from: vi.fn().mockReturnValue({
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              error: null,
            }),
          }),
        }),
      };

      await expect(deleteCategory(supabase as never, "uuid-1")).resolves.not.toThrow();
    });
  });
});
