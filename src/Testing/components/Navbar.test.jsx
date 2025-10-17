import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, beforeEach, expect } from "vitest";
import Navbar from "@/components/Navbar";
import { useAuth0 } from "@auth0/auth0-react";

// Mock useAuth0
vi.mock("@auth0/auth0-react", () => ({
  useAuth0: vi.fn(),
}));

// Mock navigation and location
const mockNavigate = vi.fn();
let mockLocation = { pathname: "/" };

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

const renderNavbar = ({ user, isAuthenticated = false, logout = vi.fn() }) => {
  useAuth0.mockReturnValue({ user, logout, isAuthenticated });
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );
};

describe("Navbar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation = { pathname: "/" };
  });

  it("renders title and desktop nav links", () => {
    renderNavbar({
      user: { name: "Tester", picture: "avatar.jpg" },
      isAuthenticated: true,
    });

    expect(screen.getByText("PlanIt")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Events")).toBeInTheDocument();
  });

  it("renders 'Guest' when not authenticated", () => {
    renderNavbar({ user: null, isAuthenticated: false });
    expect(screen.getByText("Guest")).toBeInTheDocument();
  });

  it("renders user image and name when authenticated", () => {
    renderNavbar({
      user: { name: "John Doe", picture: "avatar.jpg" },
      isAuthenticated: true,
    });
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "avatar.jpg");
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders fallback icon if user has no picture", () => {
    renderNavbar({
      user: { name: "NoPic User" },
      isAuthenticated: true,
    });
    expect(screen.getByTestId("fallback-user-icon")).toBeInTheDocument();
    expect(screen.getByText("NoPic User")).toBeInTheDocument();
  });

  it("navigates home when clicking PlanIt title", async () => {
    const user = userEvent.setup();
    renderNavbar({
      user: { name: "Tester", picture: "avatar.jpg" },
      isAuthenticated: true,
    });

    await user.click(screen.getByText("PlanIt"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("applies active link style based on pathname", () => {
    mockLocation.pathname = "/events";
    renderNavbar({
      user: { name: "Tester", picture: "avatar.jpg" },
      isAuthenticated: true,
    });

    const events = screen.getByText("Events");
    expect(events).toHaveClass("bg-teal-700", "text-white");
    expect(screen.getByText("Dashboard")).toHaveClass("text-gray-700");
  });

  it("toggles dropdown when clicking profile area", async () => {
    const user = userEvent.setup();
    renderNavbar({
      user: { name: "Test User", picture: "avatar.jpg" },
      isAuthenticated: true,
    });

    const profile = screen.getByText("Test User");

    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
    await user.click(profile);
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Sign Out")).toBeInTheDocument();

    await user.click(profile);
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
  });

  it("closes dropdown when clicking outside", async () => {
    const user = userEvent.setup();
    renderNavbar({
      user: { name: "Outside Click", picture: "pic.jpg" },
      isAuthenticated: true,
    });

    await user.click(screen.getByText("Outside Click"));
    expect(screen.getByText("Settings")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
  });

  it("calls logout when clicking Sign Out", async () => {
    const mockLogout = vi.fn();
    const user = userEvent.setup();

    renderNavbar({
      user: { name: "Tester", picture: "pic.jpg" },
      isAuthenticated: true,
      logout: mockLogout,
    });

    await user.click(screen.getByText("Tester"));
    await user.click(screen.getByText("Sign Out"));

    expect(mockLogout).toHaveBeenCalledWith({ returnTo: window.location.origin });
  });

    it("toggles mobile nav menu", async () => {
    const user = userEvent.setup();
    renderNavbar({
      user: { name: "Tester", picture: "pic.jpg" },
      isAuthenticated: true,
    });

    const menuButton = screen.getByLabelText(/Open navigation menu/i);

    // Open mobile nav
    await user.click(menuButton);
    const dashboards = screen.getAllByText("Dashboard");
    // At least one of them (the mobile one) should be visible
    expect(dashboards.some((el) => el.offsetParent !== null)).toBe(true);

    // Close mobile nav
    await user.click(menuButton);
    expect(
      screen.getAllByText("Dashboard").every((el) => el.offsetParent === null)
    ).toBe(true);
  });

});
