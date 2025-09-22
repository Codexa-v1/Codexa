import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, beforeEach, expect } from "vitest";
import RSVPModal from "@/components/RSVPModal";
import { getGuests, deleteGuest } from "@/backend/api/EventGuest";

beforeAll(() => {
  global.URL.createObjectURL = vi.fn(() => "blob:mock");
  global.URL.revokeObjectURL = vi.fn();
});


// 🔹 Mock API with vitest
vi.mock("@/backend/api/EventGuest", () => ({
  getGuests: vi.fn(),
  deleteGuest: vi.fn(),
}));

// 🔹 Mock AddGuestsModal
vi.mock("@/components/AddGuestsModal", () => ({
  default: (props) => (
    <div data-testid="add-guests-modal">
      AddGuestsModal
      <button onClick={() => props.onClose()}>Close Modal</button>
      <button
        onClick={() =>
          props.onGuestsAdded([
            {
              _id: "3",
              name: "New Guest",
              email: "new@test.com",
              phone: "333",
              rsvpStatus: "Pending",
            },
          ])
        }
      >
        Add Mock Guest
      </button>
    </div>
  ),
}));

const mockGuests = [
  {
    _id: "1",
    name: "Alice",
    email: "alice@test.com",
    phone: "123",
    rsvpStatus: "Accepted",
  },
  {
    _id: "2",
    name: "Bob",
    email: "bob@test.com",
    phone: "456",
    rsvpStatus: "Pending",
  },
];

describe("RSVPModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getGuests.mockResolvedValue(mockGuests);
  });

  it("renders guest list from props", () => {
    render(<RSVPModal guests={mockGuests} eventId="evt1" onClose={vi.fn()} />);
    expect(screen.getByText("Guest List")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("filters guests by search term", () => {
    render(<RSVPModal guests={mockGuests} eventId="evt1" onClose={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/Search/i), {
      target: { value: "Alice" },
    });
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });

  it("filters guests by status", () => {
    render(<RSVPModal guests={mockGuests} eventId="evt1" onClose={vi.fn()} />);
    fireEvent.change(screen.getByDisplayValue("All"), {
      target: { value: "Pending" },
    });
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
  });

  it("removes a guest", async () => {
    deleteGuest.mockResolvedValue({});
    getGuests.mockResolvedValue([mockGuests[0]]); // after removal only Alice remains

    render(<RSVPModal guests={mockGuests} eventId="evt1" onClose={vi.fn()} />);
    fireEvent.click(screen.getByText("Remove", { selector: "button" }));

    await waitFor(() => {
      expect(getGuests).toHaveBeenCalledTimes(2); // initial + after delete
      expect(screen.queryByText("Bob")).not.toBeInTheDocument();
    });
  });

  it("opens and closes AddGuestsModal", async () => {
    const handleAdd = vi.fn();
    render(
      <RSVPModal
        guests={mockGuests}
        eventId="evt1"
        onClose={vi.fn()}
        onAddGuests={handleAdd}
      />
    );

    fireEvent.click(screen.getByText(/Add Guests/i));
    expect(await screen.findByTestId("add-guests-modal")).toBeInTheDocument();

    // Simulate adding
    fireEvent.click(screen.getByText("Add Mock Guest"));
    await waitFor(() => {
      expect(screen.getByText("New Guest")).toBeInTheDocument();
      expect(handleAdd).toHaveBeenCalled();
    });

    // Close modal
    fireEvent.click(screen.getByText("Close Modal"));
    expect(screen.queryByTestId("add-guests-modal")).not.toBeInTheDocument();
  });

  it("exports guests as CSV", () => {
  // Trigger the export action in your component...

  expect(URL.createObjectURL).toHaveBeenCalled();
  expect(URL.revokeObjectURL).toHaveBeenCalled();
});

});
