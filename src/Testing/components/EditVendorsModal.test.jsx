// __tests__/EditVendorModal.test.jsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, beforeEach, expect } from "vitest";
import "@testing-library/jest-dom";
import EditVendorModal from "@/components/EditVendorModal";
import { updateVendor, getEventVendorDetails } from "@/backend/api/EventVendor";
import { getVenues } from "@/backend/api/EventVenue";

// Mock APIs
vi.mock("@/backend/api/EventVendor", () => ({
  updateVendor: vi.fn(),
  getEventVendorDetails: vi.fn(),
}));

vi.mock("@/backend/api/EventVenue", () => ({
  getVenues: vi.fn(),
}));

// Mock alert since the component uses it
window.alert = vi.fn();

describe("EditVendorModal", () => {
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();
  const eventId = "event123";

  const mockVendor = {
    vendor: { _id: "vendor123" },
    eventVendor: { vendorCost: 1000, notes: "Old notes" },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
  });

  it("renders initial vendor cost and notes", () => {
    render(
      <EditVendorModal
        vendor={mockVendor}
        eventId={eventId}
        eventBudget={5000}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByDisplayValue("1000")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Old notes")).toBeInTheDocument();
  });

  it("updates form fields correctly", async () => {
    const user = userEvent.setup();
    render(
      <EditVendorModal
        vendor={mockVendor}
        eventId={eventId}
        eventBudget={5000}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const costInput = screen.getByPlaceholderText("Enter cost (e.g., 1200.50)");
    await user.clear(costInput);
    await user.type(costInput, "2500.75");

    const notesInput = screen.getByPlaceholderText("Add any additional notes...");
    await user.clear(notesInput);
    await user.type(notesInput, "Updated vendor note");

    expect(costInput).toHaveValue("2500.75");
    expect(notesInput).toHaveValue("Updated vendor note");
  });

  it("shows an alert if cost exceeds remaining budget", async () => {
  const user = userEvent.setup();
  getEventVendorDetails.mockResolvedValueOnce([]);
  getVenues.mockResolvedValueOnce([]);

  render(
    <EditVendorModal
      vendor={mockVendor}
      eventId={eventId}
      eventBudget={500}
      onClose={mockOnClose}
      onSave={mockOnSave}
    />
  );

  // Wait for remaining budget to be displayed
  await waitFor(() => {
    expect(screen.getByText(/R500\.00/)).toBeInTheDocument();
  });

  const costInput = screen.getByPlaceholderText("Enter cost (e.g., 1200.50)");
  await user.clear(costInput);
  await user.type(costInput, "1000");

  const saveButton = screen.getByRole("button", { name: /Save Changes/i });
  await user.click(saveButton);

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining("Cost exceeds remaining budget")
    );
  });

  expect(updateVendor).not.toHaveBeenCalled();
});


  it("calls updateVendor and triggers onSave and onClose on success", async () => {
    const user = userEvent.setup();
    updateVendor.mockResolvedValueOnce({});
    getEventVendorDetails.mockResolvedValueOnce([]);
    getVenues.mockResolvedValueOnce([]);

    render(
      <EditVendorModal
        vendor={mockVendor}
        eventId={eventId}
        eventBudget={10000}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const costInput = screen.getByPlaceholderText("Enter cost (e.g., 1200.50)");
    await user.clear(costInput);
    await user.type(costInput, "1200.50");

    const notesInput = screen.getByPlaceholderText("Add any additional notes...");
    await user.clear(notesInput);
    await user.type(notesInput, "Updated note");

    const saveButton = screen.getByRole("button", { name: /Save Changes/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(updateVendor).toHaveBeenCalledWith(eventId, "vendor123", {
        vendorCost: 1200.5,
        notes: "Updated note",
        contacted: true,
      });
      expect(mockOnSave).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("shows alert if updateVendor throws error", async () => {
    const user = userEvent.setup();
    updateVendor.mockRejectedValueOnce(new Error("Update failed"));
    getEventVendorDetails.mockResolvedValueOnce([]);
    getVenues.mockResolvedValueOnce([]);

    render(
      <EditVendorModal
        vendor={mockVendor}
        eventId={eventId}
        eventBudget={5000}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const saveButton = screen.getByRole("button", { name: /Save Changes/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Failed to update vendor.");
    });
  });

  it("calls onClose when Cancel is clicked", async () => {
    const user = userEvent.setup();

    render(
      <EditVendorModal
        vendor={mockVendor}
        eventId={eventId}
        eventBudget={5000}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
