import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import VendorsModal from "@/components/VendorsModal";
import { deleteVendor } from "@/backend/api/EventVendor";

// Mock API
vi.mock("@/backend/api/EventVendor", () => ({
  deleteVendor: vi.fn(),
}));

// Mock NewVendorModal
vi.mock("@/components/NewVendorModal", () => {
  return {
    default: (props) => (
      <div data-testid="new-vendor-modal">
        NewVendorModal
        <button onClick={() => props.onClose()}>Close Modal</button>
        <button
          onClick={() =>
            props.onSave({
              _id: "3",
              name: "New Vendor",
              vendorType: "Type C",
              contactPerson: "Charlie",
              phone: "333",
              email: "new@vendor.com",
            })
          }
        >
          Save Mock Vendor
        </button>
      </div>
    ),
  };
});


const mockVendors = [
  { _id: "1", name: "Vendor A", vendorType: "Type A", contactPerson: "Alice", phone: "111", email: "alice@test.com" },
  { _id: "2", name: "Vendor B", vendorType: "Type B", contactPerson: "Bob", phone: "222", email: "bob@test.com" },
];

describe("VendorsModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders vendors from props", () => {
    render(<VendorsModal vendors={mockVendors} eventId="evt1" onClose={vi.fn()} onEditVendor={vi.fn()} />);

    expect(screen.getByText("Vendor List")).toBeInTheDocument();
    expect(screen.getByText("Vendor A")).toBeInTheDocument();
    expect(screen.getByText("Vendor B")).toBeInTheDocument();
  });

  it("filters vendors by search term", () => {
    render(<VendorsModal vendors={mockVendors} eventId="evt1" onClose={vi.fn()} onEditVendor={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText(/Search by Name or Contact Person/i), { target: { value: "Alice" } });

    expect(screen.getByText("Vendor A")).toBeInTheDocument();
    expect(screen.queryByText("Vendor B")).not.toBeInTheDocument();
  });

  it("filters vendors by type", () => {
    render(<VendorsModal vendors={mockVendors} eventId="evt1" onClose={vi.fn()} onEditVendor={vi.fn()} />);

    fireEvent.change(screen.getByDisplayValue("All"), { target: { value: "Type B" } });

    expect(screen.getByText("Vendor B")).toBeInTheDocument();
    expect(screen.queryByText("Vendor A")).not.toBeInTheDocument();
  });

  it("removes a vendor", async () => {
    deleteVendor.mockResolvedValue({});
    render(<VendorsModal vendors={mockVendors} eventId="evt1" onClose={vi.fn()} onEditVendor={vi.fn()} />);

    fireEvent.click(screen.getAllByText("Remove")[0]); // remove Vendor A

    await waitFor(() => {
      expect(deleteVendor).toHaveBeenCalledWith("evt1", "1");
      expect(screen.queryByText("Vendor A")).not.toBeInTheDocument();
      expect(screen.getByText("Vendor B")).toBeInTheDocument();
    });
  });

  it("opens and closes NewVendorModal", async () => {
    render(<VendorsModal vendors={mockVendors} eventId="evt1" onClose={vi.fn()} onEditVendor={vi.fn()} />);

    // Open modal
    fireEvent.click(screen.getByText("+ Add New Vendor"));
    expect(await screen.findByTestId("new-vendor-modal")).toBeInTheDocument();

    // Save new vendor
    fireEvent.click(screen.getByText("Save Mock Vendor"));
    await waitFor(() => {
      expect(screen.getByText("New Vendor")).toBeInTheDocument();
    });

    // Close modal
    fireEvent.click(screen.getByText("Close Modal"));
    expect(screen.queryByTestId("new-vendor-modal")).not.toBeInTheDocument();
  });

  it("calls onEditVendor when edit button is clicked", () => {
    const handleEdit = vi.fn();
    render(<VendorsModal vendors={mockVendors} eventId="evt1" onClose={vi.fn()} onEditVendor={handleEdit} />);

    fireEvent.click(screen.getAllByText("Edit")[0]); // edit Vendor A
    expect(handleEdit).toHaveBeenCalledWith(mockVendors[0]);
  });
});
