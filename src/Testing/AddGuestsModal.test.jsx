import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewGuestModal from "@/components/AddGuestsModal";
import { vi } from "vitest";
import { addGuest, getGuests } from "@/backend/api/EventGuest";

vi.mock("@/backend/api/EventGuest", () => ({
  addGuest: vi.fn(),
  getGuests: vi.fn(),
}));

describe("NewGuestModal", () => {
  const onClose = vi.fn();
  const onGuestsUpdated = vi.fn();
  const eventId = "event123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function setup() {
    render(
      <NewGuestModal
        onClose={onClose}
        onGuestsUpdated={onGuestsUpdated}
        eventId={eventId}
      />
    );
  }

  it("renders the modal title", () => {
    setup();
    expect(screen.getByText(/Add New Guest/i)).toBeInTheDocument();
  });

  it("closes when the close button is clicked", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /×/ }));
    expect(onClose).toHaveBeenCalled();
  });

  it("adds a guest manually and shows preview", async () => {
    setup();

    await userEvent.type(screen.getByPlaceholderText(/Name/i), "Alice");
    await userEvent.type(screen.getByPlaceholderText(/Email/i), "alice@email.com");
    await userEvent.type(screen.getByPlaceholderText(/Phone/i), "123456");

    // Submit the form by clicking the "+ Add Guest" button
    fireEvent.click(screen.getByRole("button", { name: /\+ Add Guest/i }));

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("alice@email.com")).toBeInTheDocument();
    expect(screen.getByText("123456")).toBeInTheDocument();
  });

  it("does not add guest if name or email is missing", async () => {
    setup();
    await userEvent.type(screen.getByPlaceholderText(/Name/i), "Bob");

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /\+ Add Guest/i }));

    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });

  it("saves guests successfully and closes modal", async () => {
    setup();

    // Add one guest
    await userEvent.type(screen.getByPlaceholderText(/Name/i), "Alice");
    await userEvent.type(screen.getByPlaceholderText(/Email/i), "alice@email.com");
    fireEvent.click(screen.getByRole("button", { name: /\+ Add Guest/i }));

    // Mock API responses
    addGuest.mockResolvedValueOnce({ id: 1, name: "Alice" });
    getGuests.mockResolvedValueOnce([{ id: 1, name: "Alice" }]);

    // Save all
    fireEvent.click(screen.getByRole("button", { name: /Save All Guests/i }));

    await waitFor(() => {
      expect(addGuest).toHaveBeenCalledWith(
        eventId,
        expect.objectContaining({ name: "Alice" })
      );
      expect(getGuests).toHaveBeenCalledWith(eventId);
      expect(onGuestsUpdated).toHaveBeenCalledWith([{ id: 1, name: "Alice" }]);
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("shows error if save fails", async () => {
    setup();

    // Add one guest
    await userEvent.type(screen.getByPlaceholderText(/Name/i), "Charlie");
    await userEvent.type(screen.getByPlaceholderText(/Email/i), "charlie@email.com");
    fireEvent.click(screen.getByRole("button", { name: /\+ Add Guest/i }));

    addGuest.mockRejectedValueOnce(new Error("Server down"));

    fireEvent.click(screen.getByRole("button", { name: /Save All Guests/i }));

    await waitFor(() => {
      expect(screen.getByText(/Server down/i)).toBeInTheDocument();
    });
  });

  it("imports guests from CSV file", async () => {
    setup();

    // Fix label-input association in your component
    const csvContent = `name,phone,email,rsvpStatus,dietaryPreferences
Alice,123,alice@email.com,Pending,Vegan
Bob,456,bob@email.com,Accepted,`;

    const file = new File([csvContent], "guests.csv", { type: "text/csv" });

    // Select the file input
    const input = screen.getByLabelText(/Or upload CSV file/i);

    await userEvent.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });
  });
});
