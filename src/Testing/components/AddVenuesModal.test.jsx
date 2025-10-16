// __tests__/AddVenuesModal.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import AddVenuesModal from "@/components/AddVenuesModal";
import { addVenue, getVenues } from "@/backend/api/EventVenue";

// Mock the API
vi.mock("@/backend/api/EventVenue", () => ({
  addVenue: vi.fn(),
  getVenues: vi.fn(),
}));

describe("AddVenuesModal", () => {
  const mockOnClose = vi.fn();
  const mockOnVenuesUpdated = vi.fn();
  const eventId = "123";

  const fillForm = () => {
    fireEvent.change(screen.getByPlaceholderText("Enter venue name"), {
      target: { value: "Test Venue" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter venue address"), {
      target: { value: "123 Street" },
    });
    fireEvent.change(screen.getByPlaceholderText("venue@example.com"), {
      target: { value: "test@venue.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter phone number"), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByPlaceholderText("Add any additional notes..."), {
      target: { value: "Nice place" },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should allow adding a venue and display it in the table", () => {
    render(
      <AddVenuesModal eventId={eventId} onClose={mockOnClose} onVenuesUpdated={mockOnVenuesUpdated} />
    );

    fillForm();

    fireEvent.click(screen.getByText(/Add Venue to List/i));

    // Expect venue to appear in table
    expect(screen.getByText("Test Venue")).toBeInTheDocument();
    expect(screen.getByText("123 Street")).toBeInTheDocument();
    expect(screen.getByText("test@venue.com")).toBeInTheDocument();
    expect(screen.getByText("1234567890")).toBeInTheDocument();
    expect(screen.getByText("Nice place")).toBeInTheDocument();
  });

  it("calls addVenue and getVenues when clicking Save All", async () => {
    getVenues.mockResolvedValueOnce([{ venueName: "Updated Venue" }]);
    addVenue.mockResolvedValue();

    render(
      <AddVenuesModal eventId={eventId} onClose={mockOnClose} onVenuesUpdated={mockOnVenuesUpdated} />
    );

    fillForm();
    fireEvent.click(screen.getByText(/Add Venue to List/i));
    fireEvent.click(screen.getByRole("button", { name: /Save All Venues/i }));

    await waitFor(() => {
      expect(addVenue).toHaveBeenCalledTimes(1);
      expect(getVenues).toHaveBeenCalledTimes(1);
      expect(mockOnVenuesUpdated).toHaveBeenCalledWith([{ venueName: "Updated Venue" }]);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("shows error if saving fails", async () => {
    addVenue.mockRejectedValueOnce(new Error("API failure"));

    render(
      <AddVenuesModal eventId={eventId} onClose={mockOnClose} onVenuesUpdated={mockOnVenuesUpdated} />
    );

    fillForm();
    fireEvent.click(screen.getByText(/Add Venue to List/i));
    fireEvent.click(screen.getByRole("button", { name: /Save All Venues/i }));

    await waitFor(() => {
      expect(screen.getByText("API failure")).toBeInTheDocument();
    });
  });
});
