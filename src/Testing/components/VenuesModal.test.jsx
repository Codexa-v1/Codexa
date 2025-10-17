import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import VenuesModal from "@/components/VenuesModal";
import { getVenues, deleteVenue } from "@/backend/api/EventVenue";
import { getEvent } from "@/backend/api/EventData";

// === MOCKS ===
vi.mock("@/backend/api/EventVenue", () => ({
  getVenues: vi.fn(),
  deleteVenue: vi.fn(),
}));

vi.mock("@/backend/api/EventData", () => ({
  getEvent: vi.fn(),
}));

vi.mock("@/components/AddVenuesModal", () => ({
  __esModule: true,
  default: ({ onClose }) => (
    <div>
      Add New Venue(s)
      <button onClick={onClose}>Close Modal</button>
    </div>
  ),
}));

vi.mock("@/components/EditVenueModal", () => ({
  __esModule: true,
  default: ({ onClose }) => (
    <div>
      Edit Venue Modal
      <button onClick={onClose}>Close Edit</button>
    </div>
  ),
}));

describe("VenuesModal", () => {
  const eventId = "event123";
  const mockOnClose = vi.fn();
  const mockOnVenuesUpdated = vi.fn();

  const venuesMock = [
    {
      _id: "v1",
      venueName: "Venue One",
      venueAddress: "123 Main St",
      venueEmail: "one@example.com",
      venuePhone: "111-111-1111",
      capacity: 40,
      venueCost: 2000,
      venueStatus: "Contacted",
    },
    {
      _id: "v2",
      venueName: "Venue Two",
      venueAddress: "456 Side St",
      venueEmail: "two@example.com",
      venuePhone: "222-222-2222",
      capacity: 150,
      venueCost: 8000,
      venueStatus: "Not Contacted",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches and displays venues on mount", async () => {
    getVenues.mockResolvedValueOnce(venuesMock);
    getEvent.mockResolvedValueOnce({ budget: 10000 });

    render(
      <VenuesModal
        eventId={eventId}
        onClose={mockOnClose}
        onVenuesUpdated={mockOnVenuesUpdated}
      />
    );

    expect(getVenues).toHaveBeenCalledWith(eventId);

    await waitFor(() => {
      expect(screen.getByText("Venue One")).toBeInTheDocument();
      expect(screen.getByText("Venue Two")).toBeInTheDocument();
    });
  });

  it("filters venues by search term", async () => {
    getVenues.mockResolvedValueOnce(venuesMock);
    getEvent.mockResolvedValueOnce({ budget: 10000 });

    render(
      <VenuesModal eventId={eventId} onClose={mockOnClose} onVenuesUpdated={mockOnVenuesUpdated} />
    );

    await waitFor(() => screen.getByText("Venue One"));

    fireEvent.change(screen.getByPlaceholderText("Search by name or address..."), {
      target: { value: "Two" },
    });

    expect(screen.queryByText("Venue One")).not.toBeInTheDocument();
    expect(screen.getByText("Venue Two")).toBeInTheDocument();
  });

  it("filters venues by capacity", async () => {
    getVenues.mockResolvedValueOnce(venuesMock);
    getEvent.mockResolvedValueOnce({ budget: 10000 });

    render(
      <VenuesModal eventId={eventId} onClose={mockOnClose} onVenuesUpdated={mockOnVenuesUpdated} />
    );

    await waitFor(() => screen.getByText("Venue One"));

    fireEvent.change(screen.getByDisplayValue("All Capacities"), {
      target: { value: "Small" },
    });

    expect(screen.getByText("Venue One")).toBeInTheDocument();
    expect(screen.queryByText("Venue Two")).not.toBeInTheDocument();
  });

  it("shows delete confirmation and deletes a venue", async () => {
    getVenues.mockResolvedValueOnce(venuesMock);
    deleteVenue.mockResolvedValueOnce();
    getEvent.mockResolvedValueOnce({ budget: 10000 });

    render(
      <VenuesModal eventId={eventId} onClose={mockOnClose} onVenuesUpdated={mockOnVenuesUpdated} />
    );

    await waitFor(() => screen.getByText("Venue One"));

    fireEvent.click(screen.getAllByText("Remove")[0]);

    expect(
      screen.getByText("Are you sure you want to remove this venue?")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(deleteVenue).toHaveBeenCalledWith(eventId, "v1");
    });
  });

  it("opens the new venue modal when Add Venue is clicked", async () => {
  getVenues.mockResolvedValueOnce(venuesMock);
  getEvent.mockResolvedValueOnce({ budget: 10000 });

  render(
    <VenuesModal
      eventId={eventId}
      onClose={mockOnClose}
      onVenuesUpdated={mockOnVenuesUpdated}
    />
  );

  // Wait until venues have loaded before interacting
  await waitFor(() => expect(screen.getByText("Venue One")).toBeInTheDocument());

  fireEvent.click(screen.getByText("Add Venue"));

  await waitFor(() =>
    expect(screen.getByText("Add New Venue(s)")).toBeInTheDocument()
  );
});

it("opens the edit venue modal when Edit is clicked", async () => {
  getVenues.mockResolvedValueOnce([
    { _id: "1", venueName: "Venue One", capacity: 100, venueAddress: "Address" },
  ]);
  getEvent.mockResolvedValueOnce({ budget: 10000 });

  render(
    <VenuesModal
      eventId="test-event"
      onClose={vi.fn()}
      onVenuesUpdated={vi.fn()}
    />
  );

  await waitFor(() => expect(screen.getByText("Venue One")).toBeInTheDocument());

  fireEvent.click(screen.getByText("Edit"));

  await waitFor(() =>
    expect(screen.getByText("Edit Venue Modal")).toBeInTheDocument()
  );
});


  it("opens edit venue modal when Edit is clicked", async () => {
    getVenues.mockResolvedValueOnce(venuesMock);
    getEvent.mockResolvedValueOnce({ budget: 10000 });

    render(
      <VenuesModal eventId={eventId} onClose={mockOnClose} onVenuesUpdated={mockOnVenuesUpdated} />
    );

    await waitFor(() => screen.getByText("Venue One"));

    fireEvent.click(screen.getAllByText("Edit")[0]);

    expect(await screen.findByText("Edit Venue Modal")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    getVenues.mockResolvedValueOnce(venuesMock);
    getEvent.mockResolvedValueOnce({ budget: 10000 });

    render(
      <VenuesModal eventId={eventId} onClose={mockOnClose} onVenuesUpdated={mockOnVenuesUpdated} />
    );

    await waitFor(() => screen.getByText("Venue One"));

    fireEvent.click(screen.getByRole("button", { name: "" })); // FiX button (close)

    expect(mockOnClose).toHaveBeenCalled();
  });
});
