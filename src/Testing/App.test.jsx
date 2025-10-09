import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock Auth0 BEFORE importing App
const mockUseAuth0 = vi.fn();
vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => mockUseAuth0(),
}));

// Mock all page components BEFORE importing App
vi.mock("../pages/LandingPage", () => ({
  default: () => <div data-testid="landing-page">Landing Page</div>,
}));
vi.mock("../pages/HomePage", () => ({
  default: () => <div data-testid="home-page">Home Page</div>,
}));
vi.mock("../pages/ErrorPage", () => ({
  default: () => <div data-testid="error-page">Error Page</div>,
}));
vi.mock("../pages/AboutPage", () => ({
  default: () => <div data-testid="about-page">About Page</div>,
}));
vi.mock("../pages/EventsPage", () => ({
  default: () => <div data-testid="events-page">Events Page</div>,
}));
vi.mock("../pages/EventDetails", () => ({
  default: () => <div data-testid="event-details-page">Event Details Page</div>,
}));
vi.mock("../pages/RSVPPage", () => ({
  default: () => <div data-testid="rsvp-page">RSVP Page</div>,
}));
vi.mock("../pages/InvitePage", () => ({
  default: () => <div data-testid="invite-page">Invite Page</div>,
}));
vi.mock("../pages/SettingsPage", () => ({
  default: () => <div data-testid="settings-page">Settings Page</div>,
}));

// Mock react-router-dom to use MemoryRouter instead of BrowserRouter
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    BrowserRouter: ({ children }) => {
      const { MemoryRouter } = actual;
      const initialRoute = window.__TEST_INITIAL_ROUTE__ || "/";
      return <MemoryRouter initialEntries={[initialRoute]}>{children}</MemoryRouter>;
    },
  };
});

// NOW import App after all mocks are set up
import App from "../App";

describe("App Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete window.__TEST_INITIAL_ROUTE__;
  });

  describe("Public Routes", () => {
    beforeEach(() => {
      mockUseAuth0.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
      });
    });

    it("should render LandingPage on root path", () => {
      window.__TEST_INITIAL_ROUTE__ = "/";
      render(<App />);
      expect(screen.getByTestId("landing-page")).toBeInTheDocument();
    });

    it("should render Error page on /error path", () => {
      window.__TEST_INITIAL_ROUTE__ = "/error";
      render(<App />);
      expect(screen.getByTestId("error-page")).toBeInTheDocument();
    });

    it("should render About page on /about path", () => {
      window.__TEST_INITIAL_ROUTE__ = "/about";
      render(<App />);
      expect(screen.getByTestId("about-page")).toBeInTheDocument();
    });

    it("should render RSVP page with eventId and guestId params", () => {
      window.__TEST_INITIAL_ROUTE__ = "/rsvp/event123/guest456";
      render(<App />);
      expect(screen.getByTestId("rsvp-page")).toBeInTheDocument();
    });

    it("should render Invite page with eventId param", () => {
      window.__TEST_INITIAL_ROUTE__ = "/invite/event789";
      render(<App />);
      expect(screen.getByTestId("invite-page")).toBeInTheDocument();
    });
  });

  describe("Protected Routes - Authenticated User", () => {
    beforeEach(() => {
      mockUseAuth0.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
      });
    });

    it("should render Home page when authenticated", () => {
      window.__TEST_INITIAL_ROUTE__ = "/home";
      render(<App />);
      expect(screen.getByTestId("home-page")).toBeInTheDocument();
    });

    it("should render Events page when authenticated", () => {
      window.__TEST_INITIAL_ROUTE__ = "/events";
      render(<App />);
      expect(screen.getByTestId("events-page")).toBeInTheDocument();
    });

    it("should render EventDetails page with id param when authenticated", () => {
      window.__TEST_INITIAL_ROUTE__ = "/events/123";
      render(<App />);
      expect(screen.getByTestId("event-details-page")).toBeInTheDocument();
    });

    it("should render Settings page when authenticated", () => {
      window.__TEST_INITIAL_ROUTE__ = "/settings";
      render(<App />);
      expect(screen.getByTestId("settings-page")).toBeInTheDocument();
    });
  });

  describe("Protected Routes - Unauthenticated User", () => {
    beforeEach(() => {
      mockUseAuth0.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
      });
    });

    it("should redirect to /error when accessing /home unauthenticated", async () => {
      window.__TEST_INITIAL_ROUTE__ = "/home";
      render(<App />);
      await waitFor(() => {
        expect(screen.getByTestId("error-page")).toBeInTheDocument();
      });
    });

    it("should redirect to /error when accessing /events unauthenticated", async () => {
      window.__TEST_INITIAL_ROUTE__ = "/events";
      render(<App />);
      await waitFor(() => {
        expect(screen.getByTestId("error-page")).toBeInTheDocument();
      });
    });

    it("should redirect to /error when accessing /events/:id unauthenticated", async () => {
      window.__TEST_INITIAL_ROUTE__ = "/events/123";
      render(<App />);
      await waitFor(() => {
        expect(screen.getByTestId("error-page")).toBeInTheDocument();
      });
    });

    it("should redirect to /error when accessing /settings unauthenticated", async () => {
      window.__TEST_INITIAL_ROUTE__ = "/settings";
      render(<App />);
      await waitFor(() => {
        expect(screen.getByTestId("error-page")).toBeInTheDocument();
      });
    });
  });

  describe("Loading State", () => {
    it("should render nothing while auth is loading", () => {
      mockUseAuth0.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
      });

      window.__TEST_INITIAL_ROUTE__ = "/home";
      render(<App />);
      expect(screen.queryByTestId("home-page")).not.toBeInTheDocument();
      expect(screen.queryByTestId("error-page")).not.toBeInTheDocument();
    });

    it("should render page after loading completes", async () => {
      mockUseAuth0.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
      });

      window.__TEST_INITIAL_ROUTE__ = "/home";
      render(<App />);
      await waitFor(() => {
        expect(screen.getByTestId("home-page")).toBeInTheDocument();
      });
    });
  });

  describe("Route Parameters", () => {
    beforeEach(() => {
      mockUseAuth0.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
      });
    });

    it("should handle event details with numeric id", () => {
      window.__TEST_INITIAL_ROUTE__ = "/events/12345";
      render(<App />);
      expect(screen.getByTestId("event-details-page")).toBeInTheDocument();
    });

    it("should handle event details with alphanumeric id", () => {
      window.__TEST_INITIAL_ROUTE__ = "/events/abc-123-xyz";
      render(<App />);
      expect(screen.getByTestId("event-details-page")).toBeInTheDocument();
    });

    it("should handle RSVP with multiple parameters", () => {
      mockUseAuth0.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
      });

      window.__TEST_INITIAL_ROUTE__ = "/rsvp/event-abc/guest-xyz";
      render(<App />);
      expect(screen.getByTestId("rsvp-page")).toBeInTheDocument();
    });

    it("should handle invite with event id parameter", () => {
      mockUseAuth0.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
      });

      window.__TEST_INITIAL_ROUTE__ = "/invite/event-123";
      render(<App />);
      expect(screen.getByTestId("invite-page")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined authentication state gracefully", async () => {
      mockUseAuth0.mockReturnValue({
        isAuthenticated: undefined,
        isLoading: false,
      });

      window.__TEST_INITIAL_ROUTE__ = "/home";
      render(<App />);
      await waitFor(() => {
        expect(screen.getByTestId("error-page")).toBeInTheDocument();
      });
    });

    it("should handle null authentication state gracefully", async () => {
      mockUseAuth0.mockReturnValue({
        isAuthenticated: null,
        isLoading: false,
      });

      window.__TEST_INITIAL_ROUTE__ = "/home";
      render(<App />);
      await waitFor(() => {
        expect(screen.getByTestId("error-page")).toBeInTheDocument();
      });
    });

    it("should render App component successfully", () => {
      mockUseAuth0.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
      });

      window.__TEST_INITIAL_ROUTE__ = "/";
      const { container } = render(<App />);
      expect(container).toBeTruthy();
    });
  });

  describe("Multiple Protected Routes", () => {
    it("should protect all designated routes when unauthenticated", async () => {
      mockUseAuth0.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
      });

      const protectedRoutes = ["/home", "/events", "/events/123", "/settings"];

      for (const route of protectedRoutes) {
        window.__TEST_INITIAL_ROUTE__ = route;
        const { unmount } = render(<App />);
        await waitFor(() => {
          expect(screen.getByTestId("error-page")).toBeInTheDocument();
        });
        unmount();
      }
    });

    it("should allow access to all protected routes when authenticated", () => {
      mockUseAuth0.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
      });

      const tests = [
        { route: "/home", testId: "home-page" },
        { route: "/events", testId: "events-page" },
        { route: "/events/123", testId: "event-details-page" },
        { route: "/settings", testId: "settings-page" },
      ];

      tests.forEach(({ route, testId }) => {
        window.__TEST_INITIAL_ROUTE__ = route;
        const { unmount } = render(<App />);
        expect(screen.getByTestId(testId)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe("Public Routes Access", () => {
    it("should allow access to public routes regardless of auth state - authenticated", () => {
      mockUseAuth0.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
      });

      const publicRoutes = [
        { route: "/", testId: "landing-page" },
        { route: "/error", testId: "error-page" },
        { route: "/about", testId: "about-page" },
      ];

      publicRoutes.forEach(({ route, testId }) => {
        window.__TEST_INITIAL_ROUTE__ = route;
        const { unmount } = render(<App />);
        expect(screen.getByTestId(testId)).toBeInTheDocument();
        unmount();
      });
    });

    it("should allow access to public routes regardless of auth state - unauthenticated", () => {
      mockUseAuth0.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
      });

      const publicRoutes = [
        { route: "/", testId: "landing-page" },
        { route: "/error", testId: "error-page" },
        { route: "/about", testId: "about-page" },
      ];

      publicRoutes.forEach(({ route, testId }) => {
        window.__TEST_INITIAL_ROUTE__ = route;
        const { unmount } = render(<App />);
        expect(screen.getByTestId(testId)).toBeInTheDocument();
        unmount();
      });
    });

    it("should allow access to RSVP and Invite pages when loading", () => {
      mockUseAuth0.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
      });

      window.__TEST_INITIAL_ROUTE__ = "/rsvp/event1/guest1";
      const { unmount: unmount1 } = render(<App />);
      expect(screen.getByTestId("rsvp-page")).toBeInTheDocument();
      unmount1();

      window.__TEST_INITIAL_ROUTE__ = "/invite/event1";
      const { unmount: unmount2 } = render(<App />);
      expect(screen.getByTestId("invite-page")).toBeInTheDocument();
      unmount2();
    });
  });

  describe("App Structure", () => {
    it("should export App as default", () => {
      expect(App).toBeDefined();
      expect(typeof App).toBe("function");
    });

    it("should render without crashing", () => {
      mockUseAuth0.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
      });

      window.__TEST_INITIAL_ROUTE__ = "/";
      expect(() => render(<App />)).not.toThrow();
    });
  });
});