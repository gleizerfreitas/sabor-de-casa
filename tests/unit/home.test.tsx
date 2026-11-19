import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Home from "../../app/page";

vi.mock("next/server", () => ({
  connection: vi.fn(async () => undefined),
}));

vi.mock("../../src/lib/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(async () => ({})),
}));

vi.mock("../../src/server/services/public-menu-service", () => ({
  getPublicMenu: vi.fn(async () => ({
    date: "2026-11-18",
    dateLabel: "quarta-feira, 18 de novembro",
    timezone: "America/Fortaleza",
    whatsapp: "5585999990000",
    isOpen: true,
    statusMessage: "Aberto para pedidos",
    categories: [],
  })),
}));

describe("Página inicial", () => {
  it("apresenta o estado de carregamento do cardápio público", () => {
    render(<Home />);
    expect(screen.getByText("Carregando cardápio...")).toBeInTheDocument();
  });
});
