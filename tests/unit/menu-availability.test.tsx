import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { setMenuAvailability } from "@/src/app-actions/menu";
import { AdminMenuAvailability } from "@/src/components/admin-menu-availability";
import { getTodayMenuAvailability } from "@/src/server/services/menu-service";

vi.mock("@/src/app-actions/menu", () => ({
  setMenuAvailability: vi.fn(),
}));

describe("getTodayMenuAvailability", () => {
  it("inclui as categorias e ordena categorias e pratos de forma determinística", async () => {
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Fortaleza",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
    const settingsQuery = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: { timezone: "America/Fortaleza" }, error: null }),
    };
    const menuQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: { id: "menu-id", menu_date: today, status: "PUBLICADO" },
        error: null,
      }),
    };
    const itemsQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [
          { dish_id: "dish-frango", available: true },
          { dish_id: "dish-arroz", available: false },
          { dish_id: "dish-feijoada", available: true },
        ],
        error: null,
      }),
    };
    const dishesQuery = {
      select: vi.fn().mockReturnThis(),
      in: vi.fn().mockResolvedValue({
        data: [
          { id: "dish-frango", name: "Frango", category_id: "main" },
          { id: "dish-arroz", name: "Arroz", category_id: "sides" },
          { id: "dish-feijoada", name: "Feijoada", category_id: "main" },
        ],
        error: null,
      }),
    };
    const categoriesQuery = {
      select: vi.fn().mockReturnThis(),
      in: vi.fn().mockResolvedValue({
        data: [
          { id: "main", name: "Pratos principais" },
          { id: "sides", name: "Acompanhamentos" },
        ],
        error: null,
      }),
    };
    const supabase = {
      from: vi.fn((table: string) => {
        switch (table) {
          case "admin_settings": return settingsQuery;
          case "daily_menus": return menuQuery;
          case "daily_menu_items": return itemsQuery;
          case "dishes": return dishesQuery;
          case "categories": return categoriesQuery;
          default: throw new Error(`Unexpected table: ${table}`);
        }
      }),
    };

    const result = await getTodayMenuAvailability(supabase as never, "menu-id");

    expect(dishesQuery.select).toHaveBeenCalledWith("id, name, category_id");
    expect(categoriesQuery.in).toHaveBeenCalledWith("id", ["main", "sides"]);
    expect(result?.items.map(({ name, category_name }) => [category_name, name])).toEqual([
      ["Acompanhamentos", "Arroz"],
      ["Pratos principais", "Feijoada"],
      ["Pratos principais", "Frango"],
    ]);
  });
});

describe("AdminMenuAvailability", () => {
  beforeEach(() => {
    vi.mocked(setMenuAvailability).mockReset();
    vi.mocked(setMenuAvailability).mockResolvedValue({ ok: true });
  });

  it("agrupa por categoria e mantém a ordem após alterar a disponibilidade", async () => {
    render(
      <AdminMenuAvailability
        menuId="menu-id"
        initialItems={[
          { dish_id: "dish-rice", name: "Arroz", available: true, category_id: "sides", category_name: "Acompanhamentos" },
          { dish_id: "dish-beans", name: "Feijoada", available: true, category_id: "mains", category_name: "Pratos principais" },
        ]}
      />,
    );

    expect(screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent)).toEqual([
      "Acompanhamentos",
      "Pratos principais",
    ]);
    const switchOrder = () => screen.getAllByRole("switch").map((control) =>
      control.getAttribute("aria-label")?.replace(/ como (esgotado|disponível)$/, ""),
    );
    const initialSwitchOrder = switchOrder();

    fireEvent.click(screen.getByRole("switch", { name: "Marcar Feijoada como esgotado" }));

    await waitFor(() => {
      expect(screen.getByRole("switch", { name: "Marcar Feijoada como disponível" })).toHaveAttribute("aria-checked", "false");
    });
    expect(switchOrder()).toEqual(initialSwitchOrder);
    expect(screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent)).toEqual([
      "Acompanhamentos",
      "Pratos principais",
    ]);
  });
});
