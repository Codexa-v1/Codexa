import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import EventDetails from "../pages/EventDetails"; 
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { getGuests } from "@/backend/api/EventGuest";
import { getAllEvents } from "@/backend/api/EventData"; 
import { getVendors } from "@/backend/api/EventVendor";
import React from "react";

// ------------------ MOCKS ------------------

// Router mocks
vi.mock("react-router-dom", () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn(),
}));

// Auth0 mock
vi.mock("@auth0/auth0-react", () => ({
  useAuth0: vi.fn(),
}));

// Backend API mocks
vi.mock("../backend/api/EventData", () => ({
  getAllEvents: vi.fn(),
}));
vi.mock("../backend/api/EventVendor", () => ({
  getVendors: vi.fn(),
}));
vi.mock("../backend/api/EventGuest", () => ({
  getGuests: vi.fn(),
}));

// Mock modals & child components 
vi.mock("../components/Navbar", () => ({
  default: () => <div>Mock Navbar</div>,
}));
vi.mock("../components/RSVPModal", () => ({
  default: (props) => <div>Mock RSVPModal {props.eventId}</div>,
}));
vi.mock("../components/VendorsModal", () => ({
  default: () => <div>Mock VendorsModal</div>,
}));
vi.mock("../components/VenuesModal", () => ({
  default: () => <div>Mock VenuesModal</div>,
}));
vi.mock("../components/EditEventModal", () => ({
  default: () => <div>Mock EditEventModal</div>,
}));
vi.mock("../components/WeatherCard", () => ({
  default: () => <div>Mock WeatherCard</div>,
}));

// ------------------ TEST DATA ------------------
const fakeEvent = {
  _id: "123",
  title: "My Test Event",
  category: "Wedding",
  status: "Planned",
  date: new Date().toISOString(),
  startTime: "10:00",
  endTime: "12:00",
  location: "Cape Town",
  description: "A beautiful test event",
  rsvpTotal: 100,
  rsvpCurrent: 25,
  budget: 50000,
};

describe("EventDetails", () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Router params and navigate
    useParams.mockReturnValue({ id: "123" });
    useNavigate.mockReturnValue(vi.fn());

    // Auth user
    useAuth0.mockReturnValue({ user: { sub: "user_1" } });

    // API responses
    getAllEvents.mockResolvedValue([fakeEvent]);
    getGuests.mockResolvedValue([{ name: "Alice" }]);
    getVendors.mockResolvedValue([{ name: "Caterer" }]);

    // navigator + alert mocks
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn() },
      share: vi.fn().mockResolvedValue(),
    });
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("renders event details after fetching", async () => {
    render(<EventDetails />);

    // Wait for async data load
    expect(await screen.findByText("My Test Event")).toBeInTheDocument();
    expect(screen.getByText("Wedding")).toBeInTheDocument();
    expect(screen.getByText("Planned")).toBeInTheDocument();
    expect(screen.getByText("R50000")).toBeInTheDocument();
  });

  it("shows 'Event Not Found' when event ID is missing", async () => {
    getAllEvents.mockResolvedValue([]);
    render(<EventDetails />);
    expect(
      await screen.findByText("Event Not Found")
    ).toBeInTheDocument();
  });

  it("opens Edit Event modal when button clicked", async () => {
    render(<EventDetails />);
    const btn = await screen.findByRole("button", { name: /Edit Event/i });
    fireEvent.click(btn);
    expect(screen.getByText("Mock EditEventModal")).toBeInTheDocument();
  });

  it("sends invites via navigator.share if available", async () => {
    render(<EventDetails />);
    const btn = await screen.findByRole("button", { name: /Send Invite/i });
    fireEvent.click(btn);
    await waitFor(() => {
      expect(navigator.share).toHaveBeenCalled();
    });
  });

  it("falls back to clipboard + alert if navigator.share not available", async () => {
    delete navigator.share;
    render(<EventDetails />);
    const btn = await screen.findByRole("button", { name: /Send Invite/i });
    fireEvent.click(btn);
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("Link copied to clipboard!");
    });
  });

  it("switches tabs and renders correct modal", async () => {
    render(<EventDetails />);
    const vendorsTab = await screen.findByRole("button", { name: /Vendors/i });
    fireEvent.click(vendorsTab);
    expect(await screen.findByText("Mock VendorsModal")).toBeInTheDocument();
  });
});
