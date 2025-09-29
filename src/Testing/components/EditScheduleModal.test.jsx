import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditScheduleModal from "../../components/EditScheduleModal";
import { updateEventSchedule } from "../../backend/api/EventSchedule";

vi.mock("@/backend/api/EventSchedule", () => ({
  updateEventSchedule: vi.fn(),
}));

describe("EditScheduleModal", () => {
  const defaultProps = {
    eventId: "event-123",
    onClose: vi.fn(),
    onScheduleUpdated: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with empty form when no initialData is provided", () => {
    render(<EditScheduleModal {...defaultProps} />);

    expect(screen.getByPlaceholderText(/description/i)).toHaveValue("");
    expect(screen.getAllByRole("textbox")[0]).toBeInTheDocument(); // textarea
    expect(screen.getAllByRole("textbox").length).toBe(1); // only description
    expect(screen.getAllByRole("button", { name: /save/i })[0]).toBeInTheDocument();
  });

  it("renders with initialData when provided", () => {
    const initialData = {
      description: "Opening Ceremony",
      startTime: "09:00",
      endTime: "10:00",
    };

    render(<EditScheduleModal {...defaultProps} initialData={initialData} />);

    expect(screen.getByPlaceholderText(/description/i)).toHaveValue("Opening Ceremony");
    expect(screen.getByDisplayValue("09:00")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10:00")).toBeInTheDocument();
  });

  it("updates form fields on user input", () => {
    render(<EditScheduleModal {...defaultProps} />);

    // Update description
    const description = screen.getByPlaceholderText(/description/i);
    fireEvent.change(description, { target: { value: "Updated description" } });
    expect(description).toHaveValue("Updated description");

    // Update start time
    const start = screen.getByRole("textbox", { name: /startTime/i }) || screen.getByDisplayValue("");
    fireEvent.change(start, { target: { value: "11:00" } });
    expect(start).toHaveValue("11:00");

    // Update end time
    const end = screen.getByRole("textbox", { name: /endTime/i }) || screen.getByDisplayValue("");
    fireEvent.change(end, { target: { value: "12:00" } });
    expect(end).toHaveValue("12:00");
  });

  it("calls updateEventSchedule and triggers callbacks on save", async () => {
    updateEventSchedule.mockResolvedValueOnce({ success: true });

    render(<EditScheduleModal {...defaultProps} />);

    // Fill in description
    fireEvent.change(screen.getByPlaceholderText(/description/i), {
      target: { value: "Keynote speech" },
    });

    // Click Save
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(updateEventSchedule).toHaveBeenCalledWith("event-123", {
        description: "Keynote speech",
        startTime: "",
        endTime: "",
      });
      expect(defaultProps.onScheduleUpdated).toHaveBeenCalled();
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  it("closes when the close button is clicked", () => {
    render(<EditScheduleModal {...defaultProps} />);

    fireEvent.click(screen.getByText("×"));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
