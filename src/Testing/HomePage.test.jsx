// src/Testing/HomePage.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";

// ---- mock dependencies ----
const mockedNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockedNavigate,
}));

vi.mock("../components/Navbar", () => ({
  default: () => React.createElement("nav", { "data-testid": "navbar" }, "Navbar"),
}));


vi.mock("../components/Calendar", () => ({
  default: () => <div data-testid="calendar">Calendar</div>,
}));

vi.mock("../components/EventPopup", () => ({
  default: ({ onClose }) => (
    <div data-testid="event-popup">
      EventPopup <button onClick={onClose}>Close</button>
    </div>
  ),
}));

// helper to mock Auth0
function mockAuth0({ user = { name: "TestUser", sub: "auth0|123" }, isAuthenticated = true } = {}) {
  vi.doMock("@auth0/auth0-react", () => ({
    useAuth0: () => ({
      user,
      logout: vi.fn(),
      isAuthenticated,
    }),
  }));
}

describe("HomePage", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    // mock fetch globally
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]), // default: no events
      })
    );
  });

  test("renders welcome message with user name", async () => {
    mockAuth0();
    const { default: HomePage } = await import("../pages/HomePage");
    render(<HomePage />);
    expect(await screen.findByText(/Welcome back, TestUser!/)).toBeInTheDocument();
  });

  test("opens and closes Add New Event modal", async () => {
    mockAuth0();
    const { default: HomePage } = await import("../pages/HomePage");
    render(<HomePage />);

    const btn = screen.getByRole("button", { name: /Add New Event/i });
    fireEvent.click(btn);
    expect(screen.getByTestId("event-popup")).toBeInTheDocument();

    // close popup via child close button
    fireEvent.click(screen.getByText("Close"));
    await waitFor(() => {
      expect(screen.queryByTestId("event-popup")).not.toBeInTheDocument();
    });
  });

  test("renders fallback when no events exist", async () => {
    mockAuth0();
    const { default: HomePage } = await import("../pages/HomePage");
    render(<HomePage />);
    expect(await screen.findByText(/No events found/i)).toBeInTheDocument();
  });

  test("renders upcoming events and see more button", async () => {
    mockAuth0();
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { title: "Event 1", date: "2025-08-20", rsvpCurrent: 1, rsvpTotal: 2 },
            { title: "Event 2", date: "2025-08-21", rsvpCurrent: 0, rsvpTotal: 5 },
            { title: "Event 3", date: "2025-08-22", rsvpCurrent: 5, rsvpTotal: 5 },
            { title: "Event 4", date: "2025-08-23", rsvpCurrent: 2, rsvpTotal: 10 },
          ]),
      })
    );

    const { default: HomePage } = await import("../pages/HomePage");
    render(<HomePage />);

    expect(await screen.findAllByText("Event 1")).toHaveLength(2);
    expect(screen.getAllByText("Event 2")).toHaveLength(2);
    expect(screen.getAllByText("Event 3")).toHaveLength(2);
    expect(screen.getByRole("button", { name: /See more/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /See more/i }));
    expect(mockedNavigate).toHaveBeenCalledWith("/events");
  });

  test("shows cancel confirmation when Cancel clicked", async () => {
    mockAuth0();
    const fakeEvent = { _id: "abc123", title: "Deletable Event", date: "2025-08-20" };
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([fakeEvent]),
      })
    );

    const { default: HomePage } = await import("../pages/HomePage");
    render(<HomePage />);

    expect(await screen.findAllByText("Deletable Event")).toHaveLength(2);

    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));

    expect(await screen.findByText(/Cancel Event\?/i)).toBeInTheDocument();

    // close by clicking "No, Go Back"
    fireEvent.click(screen.getByRole("button", { name: /No, Go Back/i }));
    await waitFor(() => {
      expect(screen.queryByText(/Cancel Event\?/i)).not.toBeInTheDocument();
    });
  });
});
