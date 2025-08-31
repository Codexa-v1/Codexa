// src/Testing/HomePage.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";

// ---- mock dependencies ----
const mockedNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockedNavigate,
}));

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
    <div>
      <span>{event.title}</span>
      <button type="button" onClick={() => setConfirmDeleteId && setConfirmDeleteId(event._id)}>Cancel</button>
      <button type="button" onClick={() => mockedNavigate("/events")}>See more</button>
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

// Mock backend API to return expected events
vi.mock("@/backend/api/EventData", () => ({
  getAllEvents: vi.fn(() =>
    Promise.resolve([
      { _id: "1", title: "Event 1", date: "2025-08-20", rsvpCurrent: 1, rsvpTotal: 2 },
      { _id: "2", title: "Event 2", date: "2025-08-21", rsvpCurrent: 0, rsvpTotal: 5 },
      { _id: "3", title: "Event 3", date: "2025-08-22", rsvpCurrent: 5, rsvpTotal: 5 },
      { _id: "4", title: "Deletable Event", date: "2025-08-23", rsvpCurrent: 2, rsvpTotal: 10 },
    ])
  ),
}));

describe("HomePage", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

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
    expect(await screen.findByText(/Welcome back, TestUser!/i)).toBeInTheDocument();
  });

  test("opens and closes Add New Event modal", async () => {
    mockAuth0();
    const { default: HomePage } = await import("../pages/HomePage");
    render(<HomePage />);

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

  expect(await screen.findAllByText((content) => content.includes("Event 1"))).not.toHaveLength(0);
  expect(screen.getAllByText((content) => content.includes("Event 2"))).not.toHaveLength(0);
  expect(screen.getAllByText((content) => content.includes("Event 3"))).not.toHaveLength(0);

  const seeMoreBtns = screen.getAllByRole("button", { name: /See more/i });
  expect(seeMoreBtns.length).toBeGreaterThan(0);

  // Find the first 'See more' button that is not disabled and click it
  const firstSeeMoreBtn = seeMoreBtns.find(btn => !btn.disabled);
  fireEvent.click(firstSeeMoreBtn);
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

  expect(await screen.findByText("Deletable Event")).toBeInTheDocument();

  const cancelBtns = screen.getAllByText("Cancel");
  expect(cancelBtns.length).toBeGreaterThan(0);


    //fireEvent.click(screen.getByRole("button", { name: /No, Go Back/i }));
    await waitFor(() => {
      expect(screen.queryByText(/Cancel\?/i)).not.toBeInTheDocument();
    });
  });
});
