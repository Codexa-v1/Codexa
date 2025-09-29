import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import LandingNavbar from "@/components/LandingNavbar"; 

// --- Mocks ---
const mockNavigate = vi.fn();
const mockLoginWithRedirect = vi.fn();
const mockLogout = vi.fn();
let mockIsAuthenticated = false;

vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    isAuthenticated: mockIsAuthenticated,
    loginWithRedirect: mockLoginWithRedirect,
    logout: mockLogout,
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// --- Helper to render component ---
const renderNavbar = () => {
  render(
    <MemoryRouter>
      <LandingNavbar />
    </MemoryRouter>
  );
};

// --- Tests ---
describe("LandingNavbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAuthenticated = false;
  });

  it("renders brand title", () => {
    renderNavbar();
    expect(screen.getByText("PlanIt")).toBeInTheDocument();
  });

  it("navigates to / when clicking PlanIt", async () => {
    renderNavbar();
    await userEvent.click(screen.getByText("PlanIt"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("shows Sign In button when not authenticated", () => {
    renderNavbar();
    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.queryByText("Go to Dashboard")).not.toBeInTheDocument();
  });

  it("calls loginWithRedirect when Sign In is clicked", async () => {
    renderNavbar();
    await userEvent.click(screen.getByText("Sign In"));
    expect(mockLoginWithRedirect).toHaveBeenCalled();
  });

  it("shows Go to Dashboard and Sign Out when authenticated", () => {
    mockIsAuthenticated = true;
    renderNavbar();
    expect(screen.getByText("Go to Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
  });

  it("navigates to /about when About is clicked", async () => {
    renderNavbar();
    await userEvent.click(screen.getByText("About"));
    expect(mockNavigate).toHaveBeenCalledWith("/about");
  });

  it("navigates to /home when Go to Dashboard is clicked", async () => {
    mockIsAuthenticated = true;
    renderNavbar();
    await userEvent.click(screen.getByText("Go to Dashboard"));
    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  it("calls logout when Sign Out is clicked", async () => {
    mockIsAuthenticated = true;
    renderNavbar();
    await userEvent.click(screen.getByText("Sign Out"));
    expect(mockLogout).toHaveBeenCalledWith({ returnTo: window.location.origin });
  });

  it("toggles mobile nav menu", async () => {
    renderNavbar();

    const menuBtn = screen.getByLabelText("Open navigation menu");
    await userEvent.click(menuBtn);

    expect(screen.getByText("About")).toBeVisible();
    expect(screen.getByText("Sign In")).toBeVisible();

    await userEvent.click(menuBtn);
    expect(screen.queryByText("About")).not.toBeVisible();
  });

  it("mobile menu calls loginWithRedirect when unauthenticated", async () => {
    renderNavbar();
    await userEvent.click(screen.getByLabelText("Open navigation menu"));
    await userEvent.click(screen.getByText("Sign In"));
    expect(mockLoginWithRedirect).toHaveBeenCalled();
  });

  it("mobile menu shows dashboard/signout when authenticated", async () => {
    mockIsAuthenticated = true;
    renderNavbar();
    await userEvent.click(screen.getByLabelText("Open navigation menu"));
    expect(screen.getByText("Go to Dashboard")).toBeVisible();
    expect(screen.getByText("Sign Out")).toBeVisible();
  });

  it("mobile menu buttons navigate and close menu", async () => {
    mockIsAuthenticated = true;
    renderNavbar();

    await userEvent.click(screen.getByLabelText("Open navigation menu"));
    await userEvent.click(screen.getByText("Go to Dashboard"));
    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });
});
