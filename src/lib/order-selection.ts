export function parseOrderSelection(serialized: string) {
  const quantities: Record<string, number> = {};

  serialized.split(",").forEach((entry) => {
    const [dishId, quantityText] = entry.split(":");
    const quantity = Number(quantityText);
    if (dishId && Number.isInteger(quantity) && quantity > 0) {
      quantities[dishId] = quantity;
    }
  });

  return quantities;
}

export function serializeOrderSelection(quantities: Record<string, number>) {
  return Object.entries(quantities)
    .filter(([, quantity]) => quantity > 0)
    .map(([dishId, quantity]) => `${dishId}:${quantity}`)
    .join(",");
}
