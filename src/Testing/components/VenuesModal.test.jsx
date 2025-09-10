import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import VenuesModal from "@/components/VenuesModal";
import AddVenuesModal from "@/components/AddVenuesModal";
import { getVenues, deleteVenue } from "@/backend/api/EventVenue";

// Mocks
vi.mock("@/backend/api/EventVenue", () => ({
  getVenues: vi.fn(),
  deleteVenue: vi.fn(),
}));

vi.mock("@/components/AddVenuesModal", () => ({
  default: () => <div>Add New Venue(s)</div>
}));


describe("VenuesModal", () => {
  const eventId = "event123";
  const mockOnClose = vi.fn();
  const mockOnEditVenue = vi.fn();

  const venuesMock = [
    {
      _id: "v1",
      venueName: "Venue One",
      venueAddress: "123 Main St",
      venueEmail: "one@example.com",
      venuePhone: "111-111-1111",
      capacity: 40,
      venueStatus: "Pending",
    },
    {
      _id: "v2",
      venueName: "Venue Two",
      venueAddress: "456 Side St",
      venueEmail: "two@example.com",
      venuePhone: "222-222-2222",
      capacity: 150,
      venueStatus: "Accepted",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches and displays venues on mount", async () => {
    getVenues.mockResolvedValueOnce(venuesMock);

    render(
      <VenuesModal
        eventId={eventId}
        onClose={mockOnClose}
        onEditVenue={mockOnEditVenue}
      />
    );

    expect(screen.getByText("Loading venues...")).toBeInTheDocument();

    await waitFor(() => {
      expect(getVenues).toHaveBeenCalledWith(eventId);
    });

    expect(screen.getByText("Venue One")).toBeInTheDocument();
    expect(screen.getByText("Venue Two")).toBeInTheDocument();
  });

  it("filters venues by search term", async () => {
    getVenues.mockResolvedValueOnce(venuesMock);

    render(<VenuesModal eventId={eventId} onClose={mockOnClose} onEditVenue={mockOnEditVenue} />);

    await waitFor(() => screen.getByText("Venue One"));

    fireEvent.change(screen.getByPlaceholderText("Search by Name or Address..."), {
      target: { value: "Two" },
    });

    expect(screen.queryByText("Venue One")).not.toBeInTheDocument();
    expect(screen.getByText("Venue Two")).toBeInTheDocument();
  });

  it("filters venues by capacity", async () => {
    getVenues.mockResolvedValueOnce(venuesMock);

    render(<VenuesModal eventId={eventId} onClose={mockOnClose} onEditVenue={mockOnEditVenue} />);

    await waitFor(() => screen.getByText("Venue One"));

    fireEvent.change(screen.getByDisplayValue("All Capacities"), {
      target: { value: "Small" },
    });

    expect(screen.getByText("Venue One")).toBeInTheDocument();
    expect(screen.queryByText("Venue Two")).not.toBeInTheDocument();
  });

  it("calls onEditVenue when Edit is clicked", async () => {
    getVenues.mockResolvedValueOnce(venuesMock);

    render(<VenuesModal eventId={eventId} onClose={mockOnClose} onEditVenue={mockOnEditVenue} />);

    await waitFor(() => screen.getByText("Venue One"));

    fireEvent.click(screen.getAllByText("Edit")[0]);

    expect(mockOnEditVenue).toHaveBeenCalledWith(venuesMock[0]);
  });

  it("calls deleteVenue and removes from UI", async () => {
    getVenues.mockResolvedValueOnce(venuesMock);
    deleteVenue.mockResolvedValueOnce();

    render(<VenuesModal eventId={eventId} onClose={mockOnClose} onEditVenue={mockOnEditVenue} />);

    await waitFor(() => screen.getByText("Venue One"));

    fireEvent.click(screen.getAllByText("Remove")[0]);

    await waitFor(() => {
      expect(deleteVenue).toHaveBeenCalledWith(eventId, "v1");
    });

    expect(screen.queryByText("Venue One")).not.toBeInTheDocument();
  });

  it("shows the new venue modal when + Add Venue is clicked", async () => {
    getVenues.mockResolvedValueOnce(venuesMock);

    render(<VenuesModal eventId={eventId} onClose={mockOnClose} onEditVenue={mockOnEditVenue} />);

    await waitFor(() => screen.getByText("Venue One"));

    fireEvent.click(screen.getByText("+ Add Venue"));

    expect(await screen.findByText("Add New Venue(s)")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    getVenues.mockResolvedValueOnce(venuesMock);

    render(<VenuesModal eventId={eventId} onClose={mockOnClose} onEditVenue={mockOnEditVenue} />);

    await waitFor(() => screen.getByText("Venue One"));

    fireEvent.click(screen.getByText("×"));

    expect(mockOnClose).toHaveBeenCalled();
  });
});
