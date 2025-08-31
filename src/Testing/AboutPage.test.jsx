import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import About from "../pages/AboutPage.jsx";
import React from "react";

// ---- mock child components ----
vi.mock("../components/LandingNavbar", () => ({
  default: () => <div data-testid="navbar">LandingNavbar</div>,
}));
vi.mock("../components/TeamCard", () => ({
  default: (props) => (
    <div data-testid="team-card">
      <p>{props.name}</p>
      <p>{props.role}</p>
    </div>
  ),
}));

describe("About Page", () => {
  it("renders navbar and main heading", () => {
    render(<About />);
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByText("About PlanIt")).toBeInTheDocument();
  });

  it("renders team members correctly", () => {
    render(<About />);
    const cards = screen.getAllByTestId("team-card");
    expect(cards.length).toBe(6); // matches your `team` array length
    expect(screen.getByText("Kutlwano")).toBeInTheDocument();
    expect(screen.getByText("Ntobeko")).toBeInTheDocument();
  });

  it("renders contact section", () => {
    render(<About />);
    expect(screen.getByText(/support@planit.com/i)).toBeInTheDocument();
    expect(
      screen.getByText(/We are committed to making your event planning/i)
    ).toBeInTheDocument();
  });

  it("renders footer with quick links", () => {
    render(<About />);
    expect(screen.getByText("Quick Links")).toBeInTheDocument();
    expect(screen.getByText("About")).toHaveAttribute("href", "/about");
  });

  it("navigates to features when Features button is clicked", () => {
    delete window.location; // cleanup default
    window.location = { href: "" };

    render(<About />);
    const featuresBtn = screen.getByRole("button", { name: "Features" });
    fireEvent.click(featuresBtn);

    expect(window.location.href).toBe("/#hero");
  });

  it("shows footer copyright", () => {
    render(<About />);
    expect(screen.getByText(/© 2025 PlanIt/i)).toBeInTheDocument();
  });
});
