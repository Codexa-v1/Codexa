// EditVenueModal.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditVenueModal from "../../components/EditVenueModal";
import { updateVenue, getVenues } from "@/backend/api/EventVenue";

vi.mock("@/backend/api/EventVenue");

const mockVenue = {
  _id: "v1",
  venueName: "Old Venue",
  venueAddress: "123 Street",
  venueEmail: "old@example.com",
  venuePhone: "123456789",
  capacity: "100",
  venueStatus: "Pending",
  venueImage: "http://example.com/image.jpg",
};

describe("EditVenueModal", () => {
  const setup = (props = {}) => {
    const onClose = vi.fn();
    const onVenuesUpdated = vi.fn();

    render(
      <EditVenueModal
        eventId="e1"
        venue={mockVenue}
        onClose={onClose}
        onVenuesUpdated={onVenuesUpdated}
        {...props}
      />
    );

    return { onClose, onVenuesUpdated };
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders with initial venue values", () => {
    setup();

    expect(screen.getByDisplayValue("Old Venue")).toBeInTheDocument();
    expect(screen.getByDisplayValue("123 Street")).toBeInTheDocument();
    expect(screen.getByDisplayValue("old@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("123456789")).toBeInTheDocument();
    expect(screen.getByDisplayValue("100")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Pending")).toBeInTheDocument();
    expect(screen.getByDisplayValue("http://example.com/image.jpg")).toBeInTheDocument();
  });

  it("calls updateVenue and getVenues on successful submit", async () => {
    updateVenue.mockResolvedValueOnce({});
    getVenues.mockResolvedValueOnce([{ _id: "v1", venueName: "New Venue" }]);

    const { onClose, onVenuesUpdated } = setup();

    fireEvent.change(screen.getByDisplayValue("Old Venue"), {
      target: { value: "New Venue", name: "venueName" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save venue/i }));

    await waitFor(() =>
      expect(updateVenue).toHaveBeenCalledWith("e1", "v1", expect.objectContaining({ venueName: "New Venue" }))
    );

    expect(getVenues).toHaveBeenCalledWith("e1");
    expect(onVenuesUpdated).toHaveBeenCalledWith([{ _id: "v1", venueName: "New Venue" }]);
    expect(onClose).toHaveBeenCalled();
  });

  it("shows error message if updateVenue fails", async () => {
    updateVenue.mockRejectedValueOnce(new Error("Network error"));

    setup();

    fireEvent.click(screen.getByRole("button", { name: /save venue/i }));

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });

    expect(getVenues).not.toHaveBeenCalled();
  });

  it("disables buttons while saving", async () => {
    let resolveUpdate;
    updateVenue.mockReturnValue(
      new Promise(resolve => {
        resolveUpdate = resolve;
      })
    );

    setup();

    fireEvent.click(screen.getByRole("button", { name: /save venue/i }));

    expect(screen.getByRole("button", { name: /saving.../i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();

    resolveUpdate({});
  });

  it("calls onClose when cancel is clicked", () => {
    const { onClose } = setup();

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onClose).toHaveBeenCalled();
  });
  it("shows error if getVenues fails after successful update", async () => {
  updateVenue.mockResolvedValueOnce({});
  getVenues.mockRejectedValueOnce(new Error("Failed to fetch venues"));

  const { onClose, onVenuesUpdated } = setup();

  fireEvent.click(screen.getByRole("button", { name: /save venue/i }));

  await waitFor(() => {
    expect(screen.getByText("Failed to fetch venues")).toBeInTheDocument();
  });

  // updateVenue was called
  expect(updateVenue).toHaveBeenCalledWith("e1", "v1", expect.any(Object));

  // getVenues was attempted
  expect(getVenues).toHaveBeenCalledWith("e1");

  // but no venues were sent up, and modal didn’t close
  expect(onVenuesUpdated).not.toHaveBeenCalled();
  expect(onClose).not.toHaveBeenCalled();
});

});
