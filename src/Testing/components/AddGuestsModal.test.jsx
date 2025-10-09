import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddGuestsModal from "@/components/AddGuestsModal";
import { vi } from "vitest";
import { addGuest, getGuests } from "@/backend/api/EventGuest";

vi.mock("@/backend/api/EventGuest", () => ({
  addGuest: vi.fn(),
  getGuests: vi.fn(),
}));

describe("AddGuestsModal", () => {
  const onClose = vi.fn();
  const onGuestsUpdated = vi.fn();
  const eventId = "event123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function setup() {
    render(
      <AddGuestsModal
        onClose={onClose}
        onGuestsUpdated={onGuestsUpdated}
        eventId={eventId}
      />
    );
  }

  it("renders the modal title", () => {
    setup();
    expect(screen.getByText(/Add New Guests/i)).toBeInTheDocument();
  });

  it("closes when the close button is clicked", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /Close/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("adds a guest manually and shows preview", async () => {
    setup();

    await userEvent.type(screen.getByPlaceholderText(/Enter guest name/i), "Alice");
    await userEvent.type(screen.getByPlaceholderText(/guest@example.com/i), "alice@email.com");
    await userEvent.type(screen.getByPlaceholderText(/\(123\) 456-7890/i), "123456");

    fireEvent.click(screen.getByRole("button", { name: /Add Guest to List/i }));

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("alice@email.com")).toBeInTheDocument();
    expect(screen.getByText("123456")).toBeInTheDocument();
  });

  it("does not add guest if name or email is missing", async () => {
    setup();
    await userEvent.type(screen.getByPlaceholderText(/Enter guest name/i), "Bob");

    fireEvent.click(screen.getByRole("button", { name: /Add Guest to List/i }));

    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });

  it("saves guests successfully and closes modal", async () => {
    setup();

    // Add one guest
    await userEvent.type(screen.getByPlaceholderText(/Enter guest name/i), "Alice");
    await userEvent.type(screen.getByPlaceholderText(/guest@example.com/i), "alice@email.com");
    fireEvent.click(screen.getByRole("button", { name: /Add Guest to List/i }));

    addGuest.mockResolvedValueOnce({ id: 1, name: "Alice" });

    fireEvent.click(screen.getByRole("button", { name: /Save 1 Guest/i }));

    await waitFor(() => {
      expect(addGuest).toHaveBeenCalledWith(
        eventId,
        expect.objectContaining({ name: "Alice" })
      );
      expect(onGuestsUpdated).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("shows error if save fails", async () => {
    setup();

    await userEvent.type(screen.getByPlaceholderText(/Enter guest name/i), "Charlie");
    await userEvent.type(screen.getByPlaceholderText(/guest@example.com/i), "charlie@email.com");
    fireEvent.click(screen.getByRole("button", { name: /Add Guest to List/i }));

    addGuest.mockRejectedValueOnce(new Error("Server down"));

    fireEvent.click(screen.getByRole("button", { name: /Save 1 Guest/i }));

    await waitFor(() => {
      expect(screen.getByText(/Server down/i)).toBeInTheDocument();
    });
  });

  it("imports guests from CSV file", async () => {
    setup();

    const csvContent = `name,phone,email,rsvpStatus,dietaryPreferences
Alice,123,alice@email.com,Pending,Vegan
Bob,456,bob@email.com,Accepted,`;

    const file = new File([csvContent], "guests.csv", { type: "text/csv" });

    const input = screen.getByLabelText(/Bulk Import via CSV/i);

    await userEvent.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });
  });

  it("removes a guest from the preview list", async () => {
    setup();

    await userEvent.type(screen.getByPlaceholderText(/Enter guest name/i), "Alice");
    await userEvent.type(screen.getByPlaceholderText(/guest@example.com/i), "alice@email.com");
    fireEvent.click(screen.getByRole("button", { name: /Add Guest to List/i }));

    const removeBtn = screen.getAllByTitle("Remove guest")[0];
    fireEvent.click(removeBtn);

    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
  });

  it("selects and removes multiple guests", async () => {
    setup();

    // Add two guests
    await userEvent.type(screen.getByPlaceholderText(/Enter guest name/i), "Alice");
    await userEvent.type(screen.getByPlaceholderText(/guest@example.com/i), "alice@email.com");
    fireEvent.click(screen.getByRole("button", { name: /Add Guest to List/i }));

    await userEvent.type(screen.getByPlaceholderText(/Enter guest name/i), "Bob");
    await userEvent.type(screen.getByPlaceholderText(/guest@example.com/i), "bob@email.com");
    fireEvent.click(screen.getByRole("button", { name: /Add Guest to List/i }));

    // Select all
    fireEvent.click(screen.getAllByRole("checkbox")[0]); // header checkbox

    // Remove selected
    fireEvent.click(screen.getByRole("button", { name: /Remove Selected/i }));

    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });
});
