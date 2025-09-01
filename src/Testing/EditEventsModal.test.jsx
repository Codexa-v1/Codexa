// src/Testing/EditEventModal.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditEventModal from "@/components/EditEventModal";
import { updateEvent } from "@/backend/api/EventData";

vi.mock("@/backend/api/EventData", () => ({
  updateEvent: vi.fn()
}));

const mockEvent = {
  _id: "123",
  title: "Birthday Party",
  category: "Celebration",
  date: "2025-09-10",
  endDate: "2025-09-12",
  startTime: "10:00",
  endTime: "18:00",
  location: "Hall A",
  budget: "5000",
  description: "A fun birthday party!"
};

describe("EditEventModal", () => {
  let onClose, onSave;

  beforeEach(() => {
    onClose = vi.fn();
    onSave = vi.fn();
    updateEvent.mockReset();
  });

  it("renders with initial event data", () => {
    render(<EditEventModal event={mockEvent} onClose={onClose} onSave={onSave} />);
    expect(screen.getByLabelText(/title/i)).toHaveValue("Birthday Party");
    expect(screen.getByLabelText(/category/i)).toHaveValue("Celebration");
    expect(screen.getByLabelText(/date/i)).toHaveValue("2025-09-10");
    expect(screen.getByLabelText(/location/i)).toHaveValue("Hall A");
    expect(screen.getByLabelText(/budget/i)).toHaveValue("5,000");
  });

  it("calls onClose when cancel button is clicked", () => {
    render(<EditEventModal event={mockEvent} onClose={onClose} onSave={onSave} />);
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("updates input values when typing", () => {
    render(<EditEventModal event={mockEvent} onClose={onClose} onSave={onSave} />);
    const titleInput = screen.getByLabelText(/title/i);
    fireEvent.change(titleInput, { target: { value: "Graduation Party" } });
    expect(titleInput).toHaveValue("Graduation Party");
  });

  it("formats budget input with commas", () => {
    render(<EditEventModal event={mockEvent} onClose={onClose} onSave={onSave} />);
    const budgetInput = screen.getByLabelText(/budget/i);
    fireEvent.change(budgetInput, { target: { value: "10000" } });
    expect(budgetInput).toHaveValue("10,000");
  });

  it("submits form and calls updateEvent, onSave, and onClose", async () => {
    updateEvent.mockResolvedValueOnce({});
    render(<EditEventModal event={mockEvent} onClose={onClose} onSave={onSave} />);

    const titleInput = screen.getByLabelText(/title/i);
    fireEvent.change(titleInput, { target: { value: "Anniversary" } });

    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(updateEvent).toHaveBeenCalledWith("123", expect.objectContaining({ title: "Anniversary" }));
      expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ title: "Anniversary" }));
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("shows alert on update failure", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    updateEvent.mockRejectedValueOnce(new Error("Server error"));

    render(<EditEventModal event={mockEvent} onClose={onClose} onSave={onSave} />);
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Failed to update event. Please try again.");
    });

    alertSpy.mockRestore();
  });

  describe("floating labels", () => {
    it("shows label when field has value", () => {
      render(<EditEventModal event={mockEvent} onClose={onClose} onSave={onSave} />);
      // "Title" should already be visible as a label because event.title exists
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Category")).toBeInTheDocument();
      expect(screen.getByText("Budget")).toBeInTheDocument();
    });

    it("does not show label when field is empty", () => {
      const emptyEvent = { _id: "456" }; // no fields filled
      render(<EditEventModal event={emptyEvent} onClose={onClose} onSave={onSave} />);
      // Since no values, labels shouldn't appear
      expect(screen.queryByText("Title")).not.toBeInTheDocument();
      expect(screen.queryByText("Category")).not.toBeInTheDocument();
      expect(screen.queryByText("Budget")).not.toBeInTheDocument();
    });

    it("renders label after typing into empty input", () => {
      const emptyEvent = { _id: "789" }; // no fields filled
      render(<EditEventModal event={emptyEvent} onClose={onClose} onSave={onSave} />);

      const titleInput = screen.getByPlaceholderText(/title/i);
      fireEvent.change(titleInput, { target: { value: "My New Event" } });

      expect(screen.getByText("Title")).toBeInTheDocument();
    });
  });
});
