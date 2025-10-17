import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import NewVendorModal from "@/components/NewVendorModal";
import { addVendor, getVendors, searchVendors } from "@/backend/api/EventVendor";

vi.mock("@/backend/api/EventVendor", () => ({
  addVendor: vi.fn(),
  getVendors: vi.fn(),
  searchVendors: vi.fn(),
}));

function setup(props = {}) {
  const defaultProps = {
    eventId: "evt1",
    onClose: vi.fn(),
    onVendorsUpdated: vi.fn(),
    ...props,
  };
  render(<NewVendorModal {...defaultProps} />);
  return defaultProps;
}

describe("NewVendorModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Add Vendor tab by default", () => {
    setup();
    // Use role-based selector to avoid header text collision
    const addTabBtn = screen.getByRole("button", { name: /Add New Vendor/i });
    expect(addTabBtn).toHaveClass("text-teal-600");
    expect(screen.getByPlaceholderText(/Enter vendor name/i)).toBeInTheDocument();
  });

  it("switches between tabs correctly", async () => {
    setup();
    // Click the Search tab by role
    fireEvent.click(screen.getByRole("button", { name: /Search Used Vendors/i }));
    expect(await screen.findByText(/Search Vendors/i)).toBeInTheDocument();
    // Switch back using the Add tab button
    fireEvent.click(screen.getByRole("button", { name: /Add New Vendor/i }));
    expect(await screen.findByPlaceholderText(/Enter vendor name/i)).toBeInTheDocument();
  });

  it("performs vendor search and displays results", async () => {
    searchVendors.mockResolvedValueOnce([
      { _id: "v1", name: "Vendor A", vendorType: "Decor", address: "Cape Town", rating: 4 },
    ]);

    setup();
    fireEvent.click(screen.getByRole("button", { name: /Search Used Vendors/i }));
    fireEvent.change(screen.getByPlaceholderText(/Enter city name/i), { target: { value: "Cape Town" } });
    fireEvent.click(screen.getByRole("button", { name: /Search Vendors/i }));

    // Wait for Vendor A
    expect(await screen.findByText("Vendor A")).toBeInTheDocument();

    // Instead of getByText("Decor"), use getAllByText and check the badge (span)
    const decorBadges = screen.getAllByText("Decor");
    expect(decorBadges.some((el) => el.tagName.toLowerCase() === "span")).toBe(true);
  });
});
