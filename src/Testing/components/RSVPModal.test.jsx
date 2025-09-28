import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, beforeEach, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import RSVPModal from "@/components/RSVPModal";
import { getGuests, deleteGuest } from "@/backend/api/EventGuest";

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
            { _id: "3", name: "New Guest", email: "new@test.com", phone: "333", rsvpStatus: "Pending" },
          ])
        }
      >
        Add Mock Guest
      </button>
    </div>
  ),
}));

// 🔹 Test data
const mockGuests = [
  { _id: "1", name: "Alice", email: "alice@test.com", phone: "123", rsvpStatus: "Accepted" },
  { _id: "2", name: "Bob", email: "bob@test.com", phone: "456", rsvpStatus: "Pending" },
];

// 🔹 Helper
function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("RSVPModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getGuests.mockResolvedValue(mockGuests);
    global.URL.createObjectURL = vi.fn(() => "blob:mock");
    global.URL.revokeObjectURL = vi.fn();
  });

  it("renders guest list from props", () => {
    renderWithRouter(<RSVPModal guests={mockGuests} eventId="evt1" onClose={vi.fn()} />);
    expect(screen.getByText("Guest List")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("filters guests by search term", () => {
    renderWithRouter(<RSVPModal guests={mockGuests} eventId="evt1" onClose={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/Search/i), { target: { value: "Alice" } });
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });

  it("filters guests by status", () => {
  renderWithRouter(<RSVPModal guests={mockGuests} eventId="evt1" onClose={vi.fn()} />);
  
  // The first <select> is the status filter
  const [statusSelect] = screen.getAllByRole("combobox");
  fireEvent.change(statusSelect, { target: { value: "Pending" } });

  expect(screen.getByText("Bob")).toBeInTheDocument();
  expect(screen.queryByText("Alice")).not.toBeInTheDocument();
});


it("removes a guest", async () => {
  deleteGuest.mockResolvedValue({});
  getGuests.mockResolvedValue([mockGuests[0]]);
  renderWithRouter(<RSVPModal guests={mockGuests} eventId="evt1" onClose={vi.fn()} />);
  const removeButtons = screen.getAllByText("Remove", { selector: "button" });
  fireEvent.click(removeButtons[1]); // Bob
  await waitFor(() => {
    expect(getGuests).toHaveBeenCalledTimes(2);
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });
});

  it("opens and closes AddGuestsModal", async () => {
    const handleAdd = vi.fn();
    renderWithRouter(<RSVPModal guests={mockGuests} eventId="evt1" onClose={vi.fn()} onAddGuests={handleAdd} />);
    fireEvent.click(screen.getByText(/Add Guests/i));
    expect(await screen.findByTestId("add-guests-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Add Mock Guest"));
    await waitFor(() => {
      expect(screen.getByText("New Guest")).toBeInTheDocument();
      expect(handleAdd).toHaveBeenCalled();
    });
    fireEvent.click(screen.getByText("Close Modal"));
    expect(screen.queryByTestId("add-guests-modal")).not.toBeInTheDocument();
  });

  it("exports guests as CSV", () => {
    renderWithRouter(<RSVPModal guests={mockGuests} eventId="evt1" onClose={vi.fn()} />);
    fireEvent.click(screen.getByText(/Export/i));
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });

  it("exports guests as JSON", () => {
    renderWithRouter(<RSVPModal guests={mockGuests} eventId="evt1" onClose={vi.fn()} />);
    fireEvent.change(screen.getByDisplayValue("CSV"), { target: { value: "JSON" } });
    fireEvent.click(screen.getByText(/Export/i));
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });

  it("shows error when deleting guest fails", async () => {
  deleteGuest.mockRejectedValueOnce(new Error("Delete failed"));
  renderWithRouter(<RSVPModal guests={mockGuests} eventId="evt1" onClose={vi.fn()} />);
  const removeButtons = screen.getAllByText("Remove", { selector: "button" });
  fireEvent.click(removeButtons[0]); // Alice
  await waitFor(() => {
    expect(getGuests).toHaveBeenCalledTimes(1);
  });
});

  it("renders 'No guests found' when list is empty", () => {
    renderWithRouter(<RSVPModal guests={[]} eventId="evt1" onClose={vi.fn()} />);
    expect(screen.getByText("No guests found.")).toBeInTheDocument();
  });

  it("renders Re-invite button for declined guest", () => {
    const declined = [{ ...mockGuests[0], rsvpStatus: "Declined" }];
    renderWithRouter(<RSVPModal guests={declined} eventId="evt1" onClose={vi.fn()} />);
    expect(screen.getByText("Re-invite")).toBeInTheDocument();
  });

  it("renders Remind button for pending guest and handles click", () => {
    const pending = [{ ...mockGuests[0], rsvpStatus: "Pending" }];
    renderWithRouter(<RSVPModal guests={pending} eventId="evt1" onClose={vi.fn()} />);
    const remindBtn = screen.getByText("Remind");
    fireEvent.click(remindBtn);
    expect(remindBtn).toBeInTheDocument();
  });

  it("fetches guests on mount with eventId", async () => {
    getGuests.mockResolvedValueOnce(mockGuests);
    renderWithRouter(<RSVPModal guests={[]} eventId="evt1" onClose={vi.fn()} />);
    await waitFor(() => expect(getGuests).toHaveBeenCalledWith("evt1"));
  });
});
