import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Navbar from "@/components/Navbar";
import { useAuth0 } from "@auth0/auth0-react";

// Mock useAuth0
vi.mock("@auth0/auth0-react", async () => {
  return {
    useAuth0: vi.fn(),
  };
});

// Mock useNavigate and useLocation from react-router-dom
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

// Helper to render Navbar with auth states
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

  it("renders the title and navigation links", () => {
    renderNavbar({
      user: { name: "Test User", picture: "test-pic.jpg" },
      isAuthenticated: true,
    });

    expect(screen.getByText("PlanIt")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Events")).toBeInTheDocument();
  });

  it("renders 'Guest' when user is not authenticated", () => {
    renderNavbar({ user: null, isAuthenticated: false });

    expect(screen.getByText("Guest")).toBeInTheDocument();
  });

  it("renders user name and picture when authenticated", () => {
    renderNavbar({
      user: { name: "John Doe", picture: "avatar.jpg" },
      isAuthenticated: true,
    });

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "avatar.jpg");
    expect(img).toHaveAttribute("alt", "John Doe");
  });

  it("renders fallback icon and user name if no picture provided", () => {
    renderNavbar({
      user: { name: "NoPic User" },
      isAuthenticated: true,
    });

    expect(screen.getByText("NoPic User")).toBeInTheDocument();
    expect(screen.getByTestId("fallback-user-icon")).toBeInTheDocument(); // Make sure this test ID exists in your component
  });

  it("navigates to '/' when clicking the title", async () => {
    renderNavbar({
      user: { name: "Test User", picture: "test-pic.jpg" },
      isAuthenticated: true,
    });

    await userEvent.click(screen.getByText("PlanIt"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("highlights active navigation link based on current pathname", () => {
    mockLocation.pathname = "/events";
    renderNavbar({
      user: { name: "Test User", picture: "test-pic.jpg" },
      isAuthenticated: true,
    });

    const eventsLink = screen.getByText("Events");
    expect(eventsLink).toHaveClass("bg-green-800 text-white");

    const dashboardLink = screen.getByText("Dashboard");
    expect(dashboardLink).toHaveClass("text-gray-700 hover:text-green-800");
  });

  it("navigates to /home when clicking Dashboard and /events when clicking Events", async () => {
    renderNavbar({
      user: { name: "Test User", picture: "test-pic.jpg" },
      isAuthenticated: true,
    });

    await userEvent.click(screen.getByText("Dashboard"));
    expect(mockNavigate).toHaveBeenCalledWith("/home");

    await userEvent.click(screen.getByText("Events"));
    expect(mockNavigate).toHaveBeenCalledWith("/events");
  });

  it("toggles dropdown on profile icon click", async () => {
    renderNavbar({
      user: { name: "Test User", picture: "test-pic.jpg" },
      isAuthenticated: true,
    });

    const profileTrigger = screen.getByText("Test User");
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();

    await userEvent.click(profileTrigger);
    expect(screen.getByText("Settings")).toBeVisible();
    expect(screen.getByText("Sign Out")).toBeVisible();

    await userEvent.click(profileTrigger);
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
  });

  it("closes dropdown when clicking outside", async () => {
    renderNavbar({
      user: { name: "Test User", picture: "test-pic.jpg" },
      isAuthenticated: true,
    });

    const profileTrigger = screen.getByText("Test User");
    await userEvent.click(profileTrigger);
    expect(screen.getByText("Settings")).toBeVisible();

    await userEvent.click(document.body);
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
  });

  it("calls logout on Sign Out button click", async () => {
    const mockLogout = vi.fn();
    renderNavbar({
      user: { name: "Test User", picture: "test-pic.jpg" },
      isAuthenticated: true,
      logout: mockLogout,
    });

    await userEvent.click(screen.getByText("Test User"));
    await userEvent.click(screen.getByText("Sign Out"));

    expect(mockLogout).toHaveBeenCalledWith({ returnTo: window.location.origin });
  });

  it("handles keyboard interaction for dropdown toggle", async () => {
    renderNavbar({
      user: { name: "Test User", picture: "test-pic.jpg" },
      isAuthenticated: true,
    });

    const profileTrigger = screen.getByText("Test User");

    profileTrigger.focus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByText("Settings")).toBeVisible();

    await userEvent.keyboard("{Escape}");
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
  });
});
