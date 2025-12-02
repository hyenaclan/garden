import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

function TestComponent() {
  return <h1>Garden App Ready</h1>;
}

describe("app test harness", () => {
  it("renders a simple component", () => {
    render(<TestComponent />);
    expect(screen.getByText("Garden App Ready")).toBeInTheDocument();
  });
});
