// src/Testing/HomePage.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

// ---- global mocks ----
const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

vi.mock("../../components/Navbar", () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>,
}));
vi.mock("../../components/CalendarBox", () => ({
  default: ({ onDayClick }) => (
    <div data-testid="calendar">
      Calendar
      <button onClick={() => onDayClick("2025-10-10")}>Day</button>
    </div>
  ),
}));
vi.mock("../../components/EventPopup", () => ({
  default: ({ onClose }) => (
    <div data-testid="event-popup">
      EventPopup <button onClick={onClose}>Close</button>
    </div>
  ),
}));
vi.mock("../../components/EventCard", () => ({
  default: ({ event, setConfirmDeleteId }) => (
    <div data-testid="event-card">
      {event?.title || "Mock Event"}
      <button onClick={() => setConfirmDeleteId && setConfirmDeleteId(event._id)}>
        Cancel
      </button>
    </div>
  ),
}));

function mockAuth0({
  user = { name: "TestUser", sub: "auth0|123" },
  isAuthenticated = true,
} = {}) {
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
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );
  });

  test("renders welcome message with user name", async () => {
    mockAuth0();
    const { default: HomePage } = await import("../../pages/HomePage");
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(await screen.findByText(/Welcome back, TestUser!/i)).toBeInTheDocument();
  });

  test("opens and closes Add New Event modal", async () => {
    mockAuth0();
    const { default: HomePage } = await import("../../pages/HomePage");
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    const addButton = screen.getByRole("button", { name: /Add New Event/i });
    fireEvent.click(addButton);
    expect(screen.getByTestId("event-popup")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Close"));
    await waitFor(() => {
      expect(screen.queryByTestId("event-popup")).not.toBeInTheDocument();
    });
  });

  test("renders fallback when no upcoming events exist", async () => {
    mockAuth0();
    const { default: HomePage } = await import("../../pages/HomePage");
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(await screen.findByText(/No upcoming events/i)).toBeInTheDocument();
    expect(screen.getByText(/Create your first event to get started!/i)).toBeInTheDocument();
  });

  test("renders upcoming events and see more button", async () => {
    mockAuth0();
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { _id: "1", title: "Event 1", date: "2025-10-20" },
            { _id: "2", title: "Event 2", date: "2025-10-21" },
            { _id: "3", title: "Event 3", date: "2025-10-22" },
            { _id: "4", title: "Event 4", date: "2025-10-23" },
          ]),
      })
    );
    const { default: HomePage } = await import("../../pages/HomePage");
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(await screen.findByText("Event 1")).toBeInTheDocument();
    expect(screen.getByText("Event 2")).toBeInTheDocument();
    expect(screen.getByText("Event 3")).toBeInTheDocument();
    expect(screen.queryByText("Event 4")).not.toBeInTheDocument(); // Only first 3 shown
    const seeMoreBtn = screen.getByRole("button", { name: /See more/i });
    fireEvent.click(seeMoreBtn);
    expect(mockedNavigate).toHaveBeenCalledWith("/events");
  });

  test("opens cancel confirmation popup when Cancel button is clicked", async () => {
    mockAuth0();
    const fakeEvent = { _id: "abc123", title: "Deletable Event", date: "2025-10-20" };
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([fakeEvent]),
      })
    );
    const { default: HomePage } = await import("../../pages/HomePage");
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(await screen.findByText("Deletable Event")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Cancel"));
    expect(await screen.findByText(/Cancel Event\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to cancel this event/i)).toBeInTheDocument();
  });

  test("closes confirmation popup when No, Go Back is clicked", async () => {
    mockAuth0();
    const fakeEvent = { _id: "abc123", title: "Deletable Event", date: "2025-10-20" };
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([fakeEvent]),
      })
    );
    const { default: HomePage } = await import("../../pages/HomePage");
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    fireEvent.click(await screen.findByText("Cancel"));
    expect(await screen.findByText(/Cancel Event\?/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText("No, Go Back"));
    await waitFor(() => {
      expect(screen.queryByText(/Cancel Event\?/i)).not.toBeInTheDocument();
    });
  });

  test("deletes event and removes it from the list when Yes, Cancel is clicked", async () => {
    mockAuth0();
    const fakeEvent = { _id: "abc123", title: "Deletable Event", date: "2025-10-20" };
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([fakeEvent]),
      })
      .mockResolvedValueOnce({ ok: true });
    const { default: HomePage } = await import("../../pages/HomePage");
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    fireEvent.click(await screen.findByText("Cancel"));
    fireEvent.click(await screen.findByText("Yes, Cancel"));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/events/abc123"),
        expect.objectContaining({ method: "DELETE" })
      );
      expect(screen.queryByText("Deletable Event")).not.toBeInTheDocument();
    });
  });

  test("opens event modal when calendar day is clicked", async () => {
    mockAuth0();
    const { default: HomePage } = await import("../../pages/HomePage");
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Day"));
    expect(screen.getByTestId("event-popup")).toBeInTheDocument();
  });
});
