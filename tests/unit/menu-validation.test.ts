import { describe, expect, it } from "vitest";
import { dailyMenuSchema } from "@/src/validations/menu";

const dishId = "11111111-1111-1111-1111-111111111111";

describe("validação de cardápios", () => {
  it("aceita uma data válida com pelo menos um prato", () => {
    const result = dailyMenuSchema.safeParse({
      date: "2026-11-18",
      dishIds: [dishId],
    });

    expect(result.success).toBe(true);
  });

  it("rejeita cardápio sem pratos", () => {
    const result = dailyMenuSchema.safeParse({
      date: "2026-11-18",
      dishIds: [],
    });

    expect(result.success).toBe(false);
  });

  it("rejeita identificadores de pratos inválidos", () => {
    const result = dailyMenuSchema.safeParse({
      date: "2026-11-18",
      dishIds: ["feijoada"],
    });

    expect(result.success).toBe(false);
  });
});
