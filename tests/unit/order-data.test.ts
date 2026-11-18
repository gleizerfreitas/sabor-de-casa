import { describe, expect, it } from "vitest";

import {
  dishes,
  parseOrder,
  serializeOrder,
} from "@/src/prototyping/mock-data";
import {
  parseOrderSelection,
  serializeOrderSelection,
} from "@/src/lib/order-selection";

describe("dados do pedido", () => {
  it("preserva as quantidades ao serializar e ler a seleção", () => {
    const serialized = serializeOrder({ feijoada: 2, frango: 1 });
    const order = parseOrder(serialized);

    expect(order).toEqual([
      { dish: dishes[0], quantity: 2 },
      { dish: dishes[1], quantity: 1 },
    ]);
  });

  it("ignora itens inválidos ou com quantidade não positiva", () => {
    expect(parseOrder("inexistente:2,feijoada:0,frango:abc")).toEqual([]);
  });

  it("preserva quantidades usando identificadores UUID das sementes", () => {
    const dishId = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
    const serialized = serializeOrderSelection({ [dishId]: 3 });

    expect(serialized).toBe(`${dishId}:3`);
    expect(parseOrderSelection(serialized)).toEqual({ [dishId]: 3 });
  });
});
