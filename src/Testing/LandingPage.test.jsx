import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import LandingPage from "../pages/LandingPage.jsx";
import React from "react";

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

// Mock auth0
const loginWithRedirect = vi.fn();
const logout = vi.fn();

vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    isAuthenticated: false,
    loginWithRedirect,
    logout,
  }),
}));

describe("LandingPage", () => {
  it("renders PlanIt header", () => {
    render(<LandingPage />);
    expect(screen.getAllByText("PlanIt")).toHaveLength(2); // header + footer

  });

  it("shows Sign In button when not authenticated", () => {
    render(<LandingPage />);
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("calls loginWithRedirect when Sign In is clicked", () => {
    render(<LandingPage />);
    const signInButton = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(signInButton);
    expect(loginWithRedirect).toHaveBeenCalled();
  });

  it("opens mobile menu when menu button clicked", () => {
    render(<LandingPage />);
    const menuButton = screen.getByRole("button", { name: /open navigation menu/i });
    fireEvent.click(menuButton);
    expect(screen.getAllByRole("button", { name: /about/i })).toHaveLength(2); // desktop + mobile navq
    
  });
});
