import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { MainLayout } from "../../src/components/layouts/MainLayout";

describe("MainLayout", () => {
  it("renders the header with brand", () => {
    render(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>,
    );
    expect(screen.getByText("🌱 growcult")).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    render(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>,
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Cults")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("renders sign out button", () => {
    render(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>,
    );
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
  });

  it("highlights the active navigation link", () => {
    render(
      <MemoryRouter initialEntries={["/cults"]}>
        <MainLayout />
      </MemoryRouter>,
    );

    const cultsLink = screen.getByRole("link", { name: /cults/i });
    const homeLink = screen.getByRole("link", { name: /home/i });
    const profileLink = screen.getByRole("link", { name: /profile/i });

    // Active link should have bg-accent and font-medium classes
    expect(cultsLink).toHaveClass("bg-accent");
    expect(cultsLink).toHaveClass("font-medium");

    // Inactive links should not have these classes
    expect(homeLink).not.toHaveClass("font-medium");
    expect(profileLink).not.toHaveClass("font-medium");
  });

  it("highlights home link when on home page", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <MainLayout />
      </MemoryRouter>,
    );

    const homeLink = screen.getByRole("link", { name: /home/i });
    expect(homeLink).toHaveClass("bg-accent");
    expect(homeLink).toHaveClass("font-medium");
  });
});
