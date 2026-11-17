import { describe, expect, it } from "vitest";
import { dishSchema } from "@/src/validations/catalog";

describe("validação do catálogo", () => {
  it("aceita IDs UUID persistidos pelo PostgreSQL mesmo sem versão RFC", () => {
    const result = dishSchema.safeParse({
      name: "Feijoada",
      description: "",
      price: "32.90",
      categoryId: "11111111-1111-1111-1111-111111111111",
      isActive: true,
    });

    expect(result.success).toBe(true);
  });

  it("rejeita identificadores que não são UUIDs", () => {
    const result = dishSchema.safeParse({
      name: "Feijoada",
      description: "",
      price: "32.90",
      categoryId: "executivos",
      isActive: true,
    });

    expect(result.success).toBe(false);
  });
});
