import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import EditVendorModal from "../../components/EditVendorModal";
import { updateVendor, getVendors } from "@/backend/api/EventVendor";

// Mock API
vi.mock("@/backend/api/EventVendor", () => ({
  updateVendor: vi.fn(),
  getVendors: vi.fn(),
}));

const mockVendor = {
  _id: "vendor123",
  name: "Test Vendor",
  vendorType: "Food",
  contactPerson: "Alice",
  phone: "123456789",
  email: "vendor@example.com",
  website: "https://test.com",
  address: "123 Street",
  rating: "4",
  notes: "Good service",
};

describe("EditVendorModal", () => {
  const onClose = vi.fn();
  const onVendorsUpdated = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders vendor data in inputs", () => {
    render(
      <EditVendorModal
        eventId="event1"
        vendor={mockVendor}
        onClose={onClose}
        onVendorsUpdated={onVendorsUpdated}
      />
    );

    expect(screen.getByDisplayValue("Test Vendor")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Food")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
  });

  it("updates form fields when typing", async () => {
    render(
      <EditVendorModal
        eventId="event1"
        vendor={mockVendor}
        onClose={onClose}
        onVendorsUpdated={onVendorsUpdated}
      />
    );

    const nameInput = screen.getByDisplayValue("Test Vendor");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Updated Vendor");

    expect(nameInput).toHaveValue("Updated Vendor");
  });

  it("submits form successfully", async () => {
    updateVendor.mockResolvedValueOnce({});
    getVendors.mockResolvedValueOnce([
      { _id: "vendor123", name: "Updated Vendor" },
    ]);

    render(
      <EditVendorModal
        eventId="event1"
        vendor={mockVendor}
        onClose={onClose}
        onVendorsUpdated={onVendorsUpdated}
      />
    );

    const saveBtn = screen.getByRole("button", { name: /save vendor/i });
    await userEvent.click(saveBtn);

    await waitFor(() => {
      expect(updateVendor).toHaveBeenCalledWith("event1", "vendor123", expect.any(Object));
      expect(getVendors).toHaveBeenCalledWith("event1");
      expect(onVendorsUpdated).toHaveBeenCalledWith(
        expect.arrayContaining([{ _id: "vendor123", name: "Updated Vendor" }])
      );
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("shows error message when API fails", async () => {
    updateVendor.mockRejectedValueOnce(new Error("Update failed"));

    render(
      <EditVendorModal
        eventId="event1"
        vendor={mockVendor}
        onClose={onClose}
        onVendorsUpdated={onVendorsUpdated}
      />
    );

    const saveBtn = screen.getByRole("button", { name: /save vendor/i });
    await userEvent.click(saveBtn);

    expect(await screen.findByText("Update failed")).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls onClose when cancel is clicked", async () => {
    render(
      <EditVendorModal
        eventId="event1"
        vendor={mockVendor}
        onClose={onClose}
        onVendorsUpdated={onVendorsUpdated}
      />
    );

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelBtn);

    expect(onClose).toHaveBeenCalled();
  });
});
