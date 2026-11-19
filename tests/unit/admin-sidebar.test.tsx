import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdminSidebar } from "@/src/components/admin-sidebar";

describe("AdminSidebar", () => {
  it("recolhe o menu móvel e expõe os links administrativos na ordem solicitada", () => {
    render(<AdminSidebar />);

    const toggle = screen.getByRole("button", { name: "Abrir menu de navegação" });
    const sidebar = document.getElementById("admin-navigation");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(sidebar).toHaveClass("hidden");

    fireEvent.click(toggle);

    expect(screen.getByRole("button", { name: "Fechar menu de navegação" })).toHaveAttribute("aria-expanded", "true");
    expect(sidebar).toHaveClass("block");
    const links = within(screen.getByRole("navigation", { name: "Navegação administrativa" })).getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual([
      "Visão Geral",
      "Cardápios Diários",
      "Catálogo",
      "Configurações",
      "Cardápio Público",
    ]);
    expect(links[4]).toHaveAttribute("href", "/");
    expect(links[4]).toHaveAttribute("target", "_blank");
    expect(links[4]).toHaveAttribute("rel", "noopener noreferrer");
  });
});
