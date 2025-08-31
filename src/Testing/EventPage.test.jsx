// EventsPage.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EventsPage from "@/pages/EventsPage";
import { useAuth0 } from "@auth0/auth0-react";
import { getAllEvents } from "@/backend/api/EventData";
import { BrowserRouter } from "react-router-dom";

// Mock Auth0
vi.mock("@auth0/auth0-react", () => ({
  useAuth0: vi.fn(),
}));

// Mock API
vi.mock("@/backend/api/EventData", () => ({
  getAllEvents: vi.fn(),
}));

// Mock EventPopup
vi.mock("@/components/EventPopup", () => ({
  default: () => <div>EventPopup Mock</div>,
}));

// Mock Navbar
vi.mock("@/components/Navbar", () => ({
  default: () => <div>Navbar Mock</div>,
}));
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("EventsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    useAuth0.mockReturnValue({ user: null, isAuthenticated: false, isLoading: true });
    renderWithRouter(<EventsPage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("fetches and displays events", async () => {
    const mockEvents = [
      { _id: "1", title: "Event 1", category: "Party", location: "Venue 1", date: new Date(), rsvpCurrent: 2, rsvpTotal: 5 },
      { _id: "2", title: "Event 2", category: "Meeting", location: "Venue 2", date: new Date(), rsvpCurrent: 1, rsvpTotal: 3 },
    ];

    useAuth0.mockReturnValue({ user: { sub: "user123" }, isAuthenticated: true, isLoading: false });
    getAllEvents.mockResolvedValue(mockEvents);

    renderWithRouter(<EventsPage />);

    await waitFor(() => {
      expect(screen.getByText("Event 1")).toBeInTheDocument();
      expect(screen.getByText("Event 2")).toBeInTheDocument();
    });
  });

  it("filters events based on search term", async () => {
    const mockEvents = [
      { _id: "1", title: "Party Night", category: "Party", location: "Club", date: new Date(), rsvpCurrent: 2, rsvpTotal: 5 },
      { _id: "2", title: "Business Meeting", category: "Meeting", location: "Office", date: new Date(), rsvpCurrent: 1, rsvpTotal: 3 },
    ];

    useAuth0.mockReturnValue({ user: { sub: "user123" }, isAuthenticated: true, isLoading: false });
    getAllEvents.mockResolvedValue(mockEvents);

    renderWithRouter(<EventsPage />);
    await waitFor(() => screen.getByText("Party Night"));

    fireEvent.change(screen.getByPlaceholderText(/search events/i), { target: { value: "business" } });

    expect(screen.queryByText("Party Night")).not.toBeInTheDocument();
    expect(screen.getByText("Business Meeting")).toBeInTheDocument();
  });

  it("opens and closes Add New Event modal", async () => {
    useAuth0.mockReturnValue({ user: { sub: "user123" }, isAuthenticated: true, isLoading: false });
    getAllEvents.mockResolvedValue([]);

    renderWithRouter(<EventsPage />);

    const addButton = screen.getByRole("button", { name: /add new event/i });
    fireEvent.click(addButton);

    expect(screen.getByText("EventPopup Mock")).toBeInTheDocument();

    // Click overlay to close
    const overlay = screen.getByTestId("overlay");
    fireEvent.click(overlay);
    expect(screen.queryByText("EventPopup Mock")).not.toBeInTheDocument();
  });

  it("shows cancel confirmation when Cancel is clicked", async () => {
    const mockEvents = [
      { _id: "1", title: "Event 1", category: "Party", location: "Venue", date: new Date(), rsvpCurrent: 2, rsvpTotal: 5 },
    ];

    useAuth0.mockReturnValue({ user: { sub: "user123" }, isAuthenticated: true, isLoading: false });
    getAllEvents.mockResolvedValue(mockEvents);

    renderWithRouter(<EventsPage />);
    await waitFor(() => screen.getByText("Event 1"));

    const cancelButton = screen.getByText(/cancel/i);
    fireEvent.click(cancelButton);

    expect(screen.getByText(/cancel event\?/i)).toBeInTheDocument();
    expect(screen.getByText(/yes, cancel/i)).toBeInTheDocument();
    expect(screen.getByText(/no, go back/i)).toBeInTheDocument();
  });
});
