import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import About from "../../pages/AboutPage.jsx";

// ---- mock child components ----
vi.mock("../../components/Header", () => ({
  Header: () => <div data-testid="header">Header</div>,
}));
vi.mock("../../components/Footer", () => ({
  Footer: () => <div data-testid="footer">Footer</div>,
}));
vi.mock("../../components/TeamCard", () => ({
  default: (props) => (
    <div data-testid="team-card">
      <p>{props.name}</p>
      <p>{props.role}</p>
    </div>
  ),
}));

describe("About Page", () => {
  it("renders header and main heading", () => {
    render(<About />);
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByText("About PlanIt")).toBeInTheDocument();
  });

  it("renders features grid", () => {
    render(<About />);
    // Check for some features
    expect(screen.getByText("Vendor & Venue Management")).toBeInTheDocument();
    expect(screen.getByText("Budget Management")).toBeInTheDocument();
    expect(screen.getByText("Floor Plan Upload")).toBeInTheDocument();
  });

  it("renders team members correctly", () => {
    render(<About />);
    const cards = screen.getAllByTestId("team-card");
    expect(cards.length).toBe(5); // matches your `team` array length
    expect(screen.getByText("Kutlwano")).toBeInTheDocument();
    expect(screen.getByText("Ntobeko")).toBeInTheDocument();
    expect(screen.getByText("Given")).toBeInTheDocument();
  });

  it("renders contact section", () => {
    render(<About />);
    expect(screen.getByText(/codexa3@gmail.com/i)).toBeInTheDocument();
    expect(
      screen.getByText(/We are committed to making your event planning/i)
    ).toBeInTheDocument();
  });

  it("renders footer", () => {
    render(<About />);
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });
});