// src/Testing/HomePage.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

// ---- global mocks ----

// Mock navigate globally
const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

// Mock components
vi.mock("../components/Navbar", () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>,
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

vi.mock("../components/EventCard", () => ({
  default: ({ event, setConfirmDeleteId }) => (
    <div data-testid="event-card">
      {event?.title || "Mock Event"}
      <button
        onClick={() => setConfirmDeleteId && setConfirmDeleteId(event._id)}
      >
        Cancel
      </button>
    </div>
  ),
}));

// ---- helper to mock Auth0 ----
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
    vi.resetModules(); // reset module cache
    vi.clearAllMocks();

    // Default fetch returns empty array
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );
  });

  test("renders welcome message with user name", async () => {
    mockAuth0();

    const { default: HomePage } = await import("../pages/HomePage");
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Welcome back, TestUser!/i)).toBeInTheDocument();
  });

  test("opens and closes Add New Event modal", async () => {
    mockAuth0();
    const { default: HomePage } = await import("../pages/HomePage");

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

  test("renders fallback when no events exist", async () => {
    mockAuth0();
    const { default: HomePage } = await import("../pages/HomePage");

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

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
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    //event card only renders 3 events once, so .toHaveLength(1)

    expect(await screen.findAllByText("Event 1")).toHaveLength(1);
    expect(screen.getAllByText("Event 2")).toHaveLength(1);
    expect(screen.getAllByText("Event 3")).toHaveLength(1);

    const seeMoreBtn = screen.getByRole("button", { name: /See more/i });
    fireEvent.click(seeMoreBtn);

    expect(mockedNavigate).toHaveBeenCalledWith("/events");
  });

  // ...

test("opens cancel confirmation popup when Cancel button is clicked", async () => {
  mockAuth0();

  const fakeEvent = { _id: "abc123", title: "Deletable Event", date: "2025-08-20" };
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([fakeEvent]),
    })
  );

  const { default: HomePage } = await import("../pages/HomePage");
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  );

  // Ensure event is shown
  expect(await screen.findByText("Deletable Event")).toBeInTheDocument();

  // Click the Cancel button in EventCard
  fireEvent.click(screen.getByText("Cancel"));

  // Confirmation popup should appear
  expect(
    await screen.findByText(/Cancel Event\?/i)
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Are you sure you want to cancel this event/i)
  ).toBeInTheDocument();
});

test("closes confirmation popup when No, Go Back is clicked", async () => {
  mockAuth0();

  const fakeEvent = { _id: "abc123", title: "Deletable Event", date: "2025-08-20" };
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([fakeEvent]),
    })
  );

  const { default: HomePage } = await import("../pages/HomePage");
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  );

  fireEvent.click(await screen.findByText("Cancel"));

  // Confirmation popup should appear
  expect(await screen.findByText(/Cancel Event\?/i)).toBeInTheDocument();

  // Click "No, Go Back"
  fireEvent.click(screen.getByText("No, Go Back"));

  await waitFor(() => {
    expect(screen.queryByText(/Cancel Event\?/i)).not.toBeInTheDocument();
  });
});

test("deletes event and reloads page when Yes, Cancel is clicked", async () => {
  mockAuth0();

  const fakeEvent = { _id: "abc123", title: "Deletable Event", date: "2025-08-20" };
  global.fetch = vi.fn()
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([fakeEvent]),
    })
    .mockResolvedValueOnce({ ok: true });

  // Save original location
  const originalLocation = window.location;

  // Mock location with reload
  delete window.location;
  window.location = {
    ...originalLocation,
    reload: vi.fn(),
  };

  const { default: HomePage } = await import("../pages/HomePage");
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
    expect(window.location.reload).toHaveBeenCalled();
  });

  // Restore original location
  window.location = originalLocation;
});




});
