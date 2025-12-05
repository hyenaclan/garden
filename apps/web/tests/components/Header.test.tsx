import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Header,
  HeaderContainer,
  HeaderBrand,
  HeaderNav,
  HeaderActions,
} from "../../src/components/shared/Header";

describe("Header Components", () => {
  it("renders Header with children", () => {
    render(<Header>Test Content</Header>);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders HeaderContainer with children", () => {
    render(<HeaderContainer>Container Content</HeaderContainer>);
    expect(screen.getByText("Container Content")).toBeInTheDocument();
  });

  it("renders HeaderBrand with children", () => {
    render(<HeaderBrand>Brand Content</HeaderBrand>);
    expect(screen.getByText("Brand Content")).toBeInTheDocument();
  });

  it("renders HeaderNav with children", () => {
    render(<HeaderNav>Nav Content</HeaderNav>);
    expect(screen.getByText("Nav Content")).toBeInTheDocument();
  });

  it("renders HeaderActions with children", () => {
    render(<HeaderActions>Actions Content</HeaderActions>);
    expect(screen.getByText("Actions Content")).toBeInTheDocument();
  });

  it("renders nested header structure", () => {
    render(
      <Header>
        <HeaderContainer>
          <HeaderBrand>Brand</HeaderBrand>
          <HeaderNav>Navigation</HeaderNav>
          <HeaderActions>Actions</HeaderActions>
        </HeaderContainer>
      </Header>,
    );
    expect(screen.getByText("Brand")).toBeInTheDocument();
    expect(screen.getByText("Navigation")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });
});
