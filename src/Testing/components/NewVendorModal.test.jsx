import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NewVendorModal from "../../components/NewVendorModal";
import { addVendor, getVendors } from "@/backend/api/EventVendor";

// ✅ vitest mocks
vi.mock("@/backend/api/EventVendor");

function setup(props = {}) {
  const defaultProps = {
    eventId: "e1",
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

  it("submits successfully, refreshes vendors and closes", async () => {
    addVendor.mockResolvedValueOnce({});
    getVendors.mockResolvedValueOnce([{ id: "v1", name: "Vendor A" }]);

    const { onClose, onVendorsUpdated } = setup();

    // Fill minimal required fields
    fireEvent.change(screen.getByPlaceholderText(/Name/i), {
      target: { value: "Vendor A" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Type/i), {
      target: { value: "Food" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Contact Person/i), {
      target: { value: "Alice" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Phone/i), {
      target: { value: "12345" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "a@b.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Address/i), {
      target: { value: "123 Street" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Vendor Cost/i), {
      target: { value: "100" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Save Vendor/i }));

    await waitFor(() => {
      expect(addVendor).toHaveBeenCalledWith("e1", expect.any(Object));
      expect(getVendors).toHaveBeenCalledWith("e1");
      expect(onVendorsUpdated).toHaveBeenCalledWith([
        { id: "v1", name: "Vendor A" },
      ]);
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("shows validation error if vendor cost is missing or invalid", async () => {
    setup();

    fireEvent.click(screen.getByRole("button", { name: /Save Vendor/i }));

    await waitFor(() => {
      expect(
        screen.getByText((_, el) =>
          el.textContent.includes("Vendor cost is required and must be a number")
        )
      ).toBeInTheDocument();
    });
  });

  it("shows error if addVendor fails", async () => {
    addVendor.mockRejectedValueOnce(new Error("Add failed"));

    setup();

    // Fill required fields with cost
    fireEvent.change(screen.getByPlaceholderText(/Name/i), {
      target: { value: "Vendor A" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Type/i), {
      target: { value: "Food" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Contact Person/i), {
      target: { value: "Alice" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Phone/i), {
      target: { value: "12345" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "a@b.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Address/i), {
      target: { value: "123 Street" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Vendor Cost/i), {
      target: { value: "100" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Save Vendor/i }));

    await waitFor(() => {
      expect(screen.getByText("Add failed")).toBeInTheDocument();
    });
  });

  it("shows error if getVendors fails after successful add", async () => {
    addVendor.mockResolvedValueOnce({});
    getVendors.mockRejectedValueOnce(new Error("Fetch failed"));

    setup();

    // Fill required fields
    fireEvent.change(screen.getByPlaceholderText(/Name/i), {
      target: { value: "Vendor A" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Type/i), {
      target: { value: "Food" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Contact Person/i), {
      target: { value: "Alice" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Phone/i), {
      target: { value: "12345" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "a@b.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Address/i), {
      target: { value: "123 Street" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Vendor Cost/i), {
      target: { value: "100" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Save Vendor/i }));

    await waitFor(() => {
      expect(screen.getByText("Fetch failed")).toBeInTheDocument();
    });
  });

  it("disables buttons while saving", async () => {
    let resolveAdd;
    addVendor.mockImplementation(
      () => new Promise((res) => (resolveAdd = res))
    );

    setup();

    // Fill required fields
    fireEvent.change(screen.getByPlaceholderText(/Name/i), {
      target: { value: "Vendor A" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Type/i), {
      target: { value: "Food" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Contact Person/i), {
      target: { value: "Alice" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Phone/i), {
      target: { value: "12345" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "a@b.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Address/i), {
      target: { value: "123 Street" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Vendor Cost/i), {
      target: { value: "100" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Save Vendor/i }));

    // During saving, the label changes to "Saving..."
    expect(screen.getByRole("button", { name: /Saving.../i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeDisabled();

    // Resolve promise to cleanup
    resolveAdd({});
  });

  it("calls onClose when cancel is clicked", () => {
    const { onClose } = setup();

    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));

    expect(onClose).toHaveBeenCalled();
  });
});
