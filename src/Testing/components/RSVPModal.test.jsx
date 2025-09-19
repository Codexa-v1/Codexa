import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RSVPModal from "@/components/RSVPModal";
import { getGuests, deleteGuest } from "@/backend/api/EventGuest";
import { vi } from "vitest";
import React from "react";

// Mock dependencies
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("@/backend/api/EventGuest", () => ({
  getGuests: vi.fn(),
  deleteGuest: vi.fn(),
}));

// Mock AddGuestsModal to avoid rendering the whole thing
vi.mock("@/components/AddGuestsModal", () => ({
  default: ({ onClose, onGuestsAdded }) => (
    <div data-testid="add-guests-modal">
      <button onClick={() => onGuestsAdded([{ _id: "4", name: "New Guest", email: "new@test.com", phone: "0000", rsvpStatus: "Pending" }])}>
        Add New Guest
      </button>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

const mockGuests = [
  { _id: "1", name: "Alice", email: "alice@mail.com", phone: "123", rsvpStatus: "Accepted" },
  { _id: "2", name: "Bob", email: "bob@mail.com", phone: "456", rsvpStatus: "Pending" },
  { _id: "3", name: "Charlie", email: "charlie@mail.com", phone: "789", rsvpStatus: "Declined" },
];

describe("RSVPModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getGuests.mockResolvedValue(mockGuests);
    deleteGuest.mockResolvedValue({});
  });

  it("renders initial guests", async () => {
    render(<RSVPModal guests={mockGuests} onClose={vi.fn()} eventId="event-1" />);

    expect(await screen.findByText("Guest List")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
  });

  it("filters guests by search term", async () => {
    render(<RSVPModal guests={mockGuests} onClose={vi.fn()} eventId="event-1" />);

    const searchInput = screen.getByPlaceholderText(/Search by Name/i);
    fireEvent.change(searchInput, { target: { value: "alice" } });

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.queryByText("Bob")).not.toBeInTheDocument();
    });
  });

  it("filters guests by status", async () => {
    render(<RSVPModal guests={mockGuests} onClose={vi.fn()} eventId="event-1" />);

    const filterSelect = screen.getByDisplayValue("All");
    fireEvent.change(filterSelect, { target: { value: "Pending" } });

    await waitFor(() => {
      expect(screen.getByText("Bob")).toBeInTheDocument();
      expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    });
  });

  it("removes a guest when remove button is clicked", async () => {
    render(<RSVPModal guests={mockGuests} onClose={vi.fn()} eventId="event-1" />);
    const removeButton = await screen.findByText("Remove", { selector: "button" });

    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(deleteGuest).toHaveBeenCalledWith("event-1", "1");
      expect(getGuests).toHaveBeenCalledTimes(2); // initial fetch + after delete
    });
  });

  it("exports guests as CSV", async () => {
    render(<RSVPModal guests={mockGuests} onClose={vi.fn()} eventId="event-1" />);
    const exportButton = screen.getByText("Export");

    // Spy on anchor element creation
    const createSpy = vi.spyOn(document, "createElement");
    fireEvent.click(exportButton);

    expect(createSpy).toHaveBeenCalledWith("a");
    createSpy.mockRestore();
  });

  it("opens AddGuestsModal and adds new guests", async () => {
    const onAddGuests = vi.fn();
    render(<RSVPModal guests={mockGuests} onClose={vi.fn()} eventId="event-1" onAddGuests={onAddGuests} />);

    fireEvent.click(screen.getByText("Add Guests"));

    expect(await screen.findByTestId("add-guests-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Add New Guest"));

    await waitFor(() => {
      expect(screen.getByText("New Guest")).toBeInTheDocument();
      expect(onAddGuests).toHaveBeenCalled();
    });
  });

  it("shows progress bar with correct percentage", async () => {
    render(<RSVPModal guests={mockGuests} onClose={vi.fn()} eventId="event-1" />);

    const progressText = await screen.findByText(/Accepted:/);
    expect(progressText).toHaveTextContent("Accepted: 1/3");
  });
});
