import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import VendorsModal from "@/components/VendorsModal";
import { deleteVendor, getEventVendorDetails } from "@/backend/api/EventVendor";
import { getEvent } from "@/backend/api/EventData";

// Mock APIs
vi.mock("@/backend/api/EventVendor", () => ({
  deleteVendor: vi.fn(),
  getEventVendorDetails: vi.fn(),
}));
vi.mock("@/backend/api/EventData", () => ({
  getEvent: vi.fn(),
}));

// Mock modals
vi.mock("@/components/NewVendorModal", () => ({
  default: ({ onClose }) => (
    <div data-testid="new-vendor-modal">
      NewVendorModal
      <button onClick={onClose}>Close NewVendor</button>
    </div>
  ),
}));
vi.mock("@/components/EditVendorModal", () => ({
  default: ({ onClose }) => (
    <div data-testid="edit-vendor-modal">
      EditVendorModal
      <button onClick={onClose}>Close EditVendor</button>
    </div>
  ),
}));

const mockEvent = { budget: 5000 };
const mockVendors = [
  {
    vendor: {
      _id: "1",
      name: "Vendor A",
      vendorType: "Catering",
      contactPerson: "Alice",
      phone: "111",
      email: "alice@test.com",
      rating: 4,
    },
    eventVendor: { contacted: true, vendorCost: 1200, notes: "Good service" },
  },
  {
    vendor: {
      _id: "2",
      name: "Vendor B",
      vendorType: "Decor",
      contactPerson: "Bob",
      phone: "222",
      email: "bob@test.com",
      rating: 5,
    },
    eventVendor: { contacted: false, vendorCost: 0, notes: "" },
  },
];

describe("VendorsModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getEvent.mockResolvedValue(mockEvent);
    getEventVendorDetails.mockResolvedValue(mockVendors);
  });

  it("renders loading and vendor list correctly", async () => {
    render(<VendorsModal eventId="evt1" onClose={vi.fn()} />);

    // Should show loading first
    expect(screen.getByText(/Loading vendors/i)).toBeInTheDocument();

    // After fetching
    expect(await screen.findByText("Vendor A")).toBeInTheDocument();
    expect(screen.getByText("Vendor B")).toBeInTheDocument();
  });

  it("filters vendors by search term", async () => {
    render(<VendorsModal eventId="evt1" onClose={vi.fn()} />);

    await screen.findByText("Vendor A"); // wait for fetch
    const searchInput = screen.getByPlaceholderText(/search by name or contact person/i);

    fireEvent.change(searchInput, { target: { value: "Alice" } });
    expect(screen.getByText("Vendor A")).toBeInTheDocument();
    expect(screen.queryByText("Vendor B")).not.toBeInTheDocument();
  });

  it("filters vendors by type", async () => {
    render(<VendorsModal eventId="evt1" onClose={vi.fn()} />);

    await screen.findByText("Vendor A");
    const select = screen.getByDisplayValue("All");
    fireEvent.change(select, { target: { value: "Decor" } });

    expect(screen.getByText("Vendor B")).toBeInTheDocument();
    expect(screen.queryByText("Vendor A")).not.toBeInTheDocument();
  });

  it("refreshes vendor list when clicking Refresh button", async () => {
    render(<VendorsModal eventId="evt1" onClose={vi.fn()} />);

    await screen.findByText("Vendor A");
    fireEvent.click(screen.getByText(/Refresh/i));
    await waitFor(() => expect(getEventVendorDetails).toHaveBeenCalledTimes(2));
  });

  it("opens and closes NewVendorModal", async () => {
    render(<VendorsModal eventId="evt1" onClose={vi.fn()} />);
    await screen.findByText("Vendor A");

    fireEvent.click(screen.getByText(/Add Vendor/i));
    expect(screen.getByTestId("new-vendor-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close NewVendor"));
    await waitFor(() => expect(screen.queryByTestId("new-vendor-modal")).not.toBeInTheDocument());
  });

  it("opens and closes EditVendorModal", async () => {
    render(<VendorsModal eventId="evt1" onClose={vi.fn()} />);
    await screen.findByText("Vendor A");

    fireEvent.click(screen.getAllByText(/Edit/i)[0]);
    expect(screen.getByTestId("edit-vendor-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close EditVendor"));
    await waitFor(() => expect(screen.queryByTestId("edit-vendor-modal")).not.toBeInTheDocument());
  });

  it("handles vendor deletion successfully", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    deleteVendor.mockResolvedValue({});

    render(<VendorsModal eventId="evt1" onClose={vi.fn()} />);
    await screen.findByText("Vendor A");

    fireEvent.click(screen.getAllByText(/Remove/i)[0]);

    await waitFor(() => {
      expect(deleteVendor).toHaveBeenCalledWith("evt1", "1");
    });
  });

  it("shows message when no vendors exist", async () => {
    getEventVendorDetails.mockResolvedValue([]);
    render(<VendorsModal eventId="evt1" onClose={vi.fn()} />);

    expect(await screen.findByText(/No vendors found/i)).toBeInTheDocument();
  });
});
