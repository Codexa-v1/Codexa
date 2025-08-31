import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import EventsPage from "../pages/EventsPage";

// Mock Auth0 context for both import paths
vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({ user: { sub: "test-user-id" }, isAuthenticated: true, isLoading: false })
}));
vi.mock("@/auth0/auth0-react", () => ({
  useAuth0: () => ({ user: { sub: "test-user-id" }, isAuthenticated: true, isLoading: false })
}));

// Global fetch mock for event data
const mockEvents = [
  {
    _id: "789",
    title: "Emily & Jake’s Wedding",
    category: "Wedding",
    status: "Confirmed",
    date: "2025-08-31",
    startTime: "15:00",
    endTime: "22:00",
    location: "Central Park",
    description: "A beautiful day.",
    rsvpTotal: 120,
    rsvpCurrent: 100,
    budget: 120000,
    vendors: [],
    documents: [],
    floorPlanUrl: "floorplan.jpg",
  },
  {
    _id: "456",
    title: "Business Conference",
    category: "Conference",
    status: "Upcoming",
    date: "2025-09-15",
    startTime: "09:00",
    endTime: "17:00",
    location: "Hilton Hotel",
    description: "Annual business conference.",
    rsvpTotal: 300,
    rsvpCurrent: 250,
    budget: 50000,
    vendors: [],
    documents: [],
    floorPlanUrl: "conference.jpg",
  },
  {
    _id: "123",
    title: "John’s 30th Birthday",
    category: "Birthday",
    status: "Completed",
    date: "2025-07-10",
    startTime: "18:00",
    endTime: "23:00",
    location: "John's House",
    description: "Surprise party.",
    rsvpTotal: 50,
    rsvpCurrent: 45,
    budget: 2000,
    vendors: [],
    documents: [],
    floorPlanUrl: "birthday.jpg",
  },
];

beforeAll(() => {
  global.fetch = vi.fn((url, options) => {
    if (url.includes("/api/events/all")) {
      let userId = "";
      try {
        userId = JSON.parse(options?.body || "{}").userId;
      } catch {}
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(userId === "test-user-id" ? mockEvents : []),
      });
    }
    // fallback for other endpoints
    return Promise.resolve({
      ok: false,
      json: () => Promise.resolve({}),
    });
  });
});

// ✅ mock react-router navigate
const mockedNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockedNavigate,
}));

// mock Navbar so tests don't break
vi.mock("../components/Navbar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

describe("EventsPage", () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });


  test("renders heading and events", async () => {
    render(<EventsPage />);
    await screen.findByText(/Emily & Jake/i);
    expect(screen.getByRole("heading", { name: /All Events/i })).toBeInTheDocument();
    expect(screen.getByText(/Emily & Jake/i)).toBeInTheDocument();
    expect(screen.getByText(/Business Conference/i)).toBeInTheDocument();
    expect(screen.getByText(/John’s 30th Birthday/i)).toBeInTheDocument();
  });

  test("search filters events by title", async () => {
    render(<EventsPage />);
    await screen.findByText(/Emily & Jake/i);
    const searchBox = screen.getByPlaceholderText(/Search events/i);
    fireEvent.change(searchBox, { target: { value: "Wedding" } });
    expect(screen.getByText(/Emily & Jake/i)).toBeInTheDocument();
    expect(screen.queryByText(/Business Conference/i)).not.toBeInTheDocument();
  });

  test("filter dropdown filters by type", async () => {
    render(<EventsPage />);
    await screen.findByText(/Business Conference/i);
    const dropdown = screen.getByRole("combobox");
    fireEvent.change(dropdown, { target: { value: "Conference" } });
    expect(screen.getByText(/Business Conference/i)).toBeInTheDocument();
    expect(screen.queryAllByText(/Wedding/i)).toHaveLength(1);
  });

  test("shows 'No events found' when no matches", async () => {
    render(<EventsPage />);
    await screen.findByText(/Emily & Jake/i);
    const searchBox = screen.getByPlaceholderText(/Search events/i);
    fireEvent.change(searchBox, { target: { value: "Nonexistent" } });
    expect(screen.getByText(/No events found/i)).toBeInTheDocument();
  });

  test("clicking View navigates to event detail", async () => {
    render(<EventsPage />);
    await screen.findByText(/Emily & Jake/i);
    const viewBtn = screen.getAllByRole("button", { name: /View/i })[0];
    fireEvent.click(viewBtn);
    expect(mockedNavigate).toHaveBeenCalledWith(expect.stringMatching(/^\/events\/\w+$/));
  });

});
