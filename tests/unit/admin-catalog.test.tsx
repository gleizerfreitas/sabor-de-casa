import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AdminCatalog } from "@/src/components/admin-catalog";
import type { CatalogData } from "@/src/types/catalog";

vi.mock("@/src/app-actions/catalog", () => ({
  removeCategory: vi.fn(),
  removeDish: vi.fn(),
  saveCategory: vi.fn(),
}));

const category = {
  id: "11111111-1111-1111-1111-111111111111",
  name: "Pratos principais",
  created_at: "",
  updated_at: "",
};

function catalogWithDish(name: string): CatalogData {
  return {
    categories: [category],
    dishes: [{
      id: "22222222-2222-2222-2222-222222222222",
      category_id: category.id,
      name,
      description: "",
      price: 25,
      photo_url: "/dish.jpg",
      is_active: true,
      created_at: "",
      updated_at: name,
    }],
  };
}

describe("AdminCatalog", () => {
  it("aplica pratos recebidos em novos dados do servidor", async () => {
    const { rerender } = render(<AdminCatalog data={catalogWithDish("Frango")} />);
    expect(screen.getByText("Frango")).toBeInTheDocument();

    rerender(<AdminCatalog data={catalogWithDish("Frango assado")} />);

    await waitFor(() => {
      expect(screen.getByText("Frango assado")).toBeInTheDocument();
      expect(screen.queryByText("Frango")).not.toBeInTheDocument();
    });
  });
});
