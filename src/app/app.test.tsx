import { render, screen } from "@testing-library/react";

import App from "./app";

describe("Renders main page correctly", () => {
  it("Should render the page correctly", () => {
    render(<App />);
    const h1 = screen.queryByText("Welcome to TodoList Application");
    expect(h1).toBeInTheDocument();
  });
});
