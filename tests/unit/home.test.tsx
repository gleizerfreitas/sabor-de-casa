import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "../../app/page";

describe("Página inicial", () => {
  it("apresenta a área pública", () => {
    render(<Home />);

    expect(screen.getByText("Sabor de Casa")).toBeInTheDocument();
    expect(screen.getByText("Área pública")).toBeInTheDocument();
  });
});
