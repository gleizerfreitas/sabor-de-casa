export type Category = {
  id: string;
  name: string;
};

export type Dish = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  accent: string;
};

export type MenuItem = Dish & {
  available: boolean;
};

export type OrderItem = {
  dish: Dish;
  quantity: number;
};

export const categories: Category[] = [
  { id: "executivos", name: "Pratos executivos" },
  { id: "massas", name: "Massas" },
  { id: "acompanhamentos", name: "Acompanhamentos" },
  { id: "bebidas", name: "Bebidas" },
];

export const dishes: Dish[] = [
  {
    id: "feijoada",
    categoryId: "executivos",
    name: "Feijoada da casa",
    description: "Feijão preto, carnes selecionadas, arroz, farofa e couve.",
    price: 28.9,
    available: true,
    accent: "from-amber-700 to-orange-400",
  },
  {
    id: "frango",
    categoryId: "executivos",
    name: "Frango grelhado",
    description: "Filé de frango, arroz, feijão e salada fresca.",
    price: 23.9,
    available: true,
    accent: "from-lime-700 to-yellow-400",
  },
  {
    id: "lasanha",
    categoryId: "massas",
    name: "Lasanha à bolonhesa",
    description: "Massa artesanal, molho de tomate e queijo gratinado.",
    price: 26.5,
    available: true,
    accent: "from-red-800 to-orange-400",
  },
  {
    id: "nhoque",
    categoryId: "massas",
    name: "Nhoque de batata",
    description: "Nhoque macio ao molho sugo da casa.",
    price: 24.9,
    available: false,
    accent: "from-yellow-700 to-amber-300",
  },
  {
    id: "salada",
    categoryId: "acompanhamentos",
    name: "Salada tropical",
    description: "Folhas, tomate, manga e molho cítrico.",
    price: 9.9,
    available: true,
    accent: "from-emerald-700 to-lime-300",
  },
  {
    id: "suco",
    categoryId: "bebidas",
    name: "Suco natural",
    description: "Consulte os sabores disponíveis no dia.",
    price: 7.5,
    available: true,
    accent: "from-pink-700 to-orange-300",
  },
];

export const menuDate = "Quarta-feira, 12 de novembro";
export const menuDateIso = "2026-11-12";
export const whatsappNumber = "(85) 99999-0000";
export const ownerName = "Maria";

export const adminMenuRows = [
  { date: "12 nov 2026", status: "Publicado", dishes: 5 },
  { date: "13 nov 2026", status: "Rascunho", dishes: 4 },
  { date: "14 nov 2026", status: "Rascunho", dishes: 0 },
];

export function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function serializeOrder(quantities: Record<string, number>) {
  return Object.entries(quantities)
    .filter(([, quantity]) => quantity > 0)
    .map(([dishId, quantity]) => `${dishId}:${quantity}`)
    .join(",");
}

export function parseOrder(value: string | null): OrderItem[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((entry) => {
      const [dishId, quantityText] = entry.split(":");
      const quantity = Number(quantityText);
      const dish = dishes.find((item) => item.id === dishId);

      return dish && Number.isInteger(quantity) && quantity > 0
        ? { dish, quantity }
        : null;
    })
    .filter((item): item is OrderItem => item !== null);
}
