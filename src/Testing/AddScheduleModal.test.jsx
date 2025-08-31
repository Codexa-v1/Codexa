import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddScheduleModal from "@/components/AddScheduleModal";
import { vi } from "vitest";
import { createEventSchedule } from "@/backend/api/EventSchedule";

// Mock the backend API
vi.mock("@/backend/api/EventSchedule", () => ({
  createEventSchedule: vi.fn(),
}));

describe("AddScheduleModal", () => {
  const mockOnClose = vi.fn();
  const mockOnScheduleUpdated = vi.fn();
  const eventId = "event-123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Add Schedule modal with empty initial data", () => {
    render(
      <AddScheduleModal
        eventId={eventId}
        onClose={mockOnClose}
        onScheduleUpdated={mockOnScheduleUpdated}
      />
    );

    expect(screen.getByText(/Add Schedule Item/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Description/i)).toHaveValue("");
    expect(screen.getByRole("textbox", { name: /description/i })).toBeInTheDocument();
  });

  it("renders Edit Schedule modal with initial data", () => {
    const initialData = {
      description: "Meeting",
      startTime: "09:00",
      endTime: "10:00",
    };

    render(
      <AddScheduleModal
        eventId={eventId}
        onClose={mockOnClose}
        onScheduleUpdated={mockOnScheduleUpdated}
        initialData={initialData}
      />
    );

    expect(screen.getByText(/Edit Schedule Item/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Description/i)).toHaveValue("Meeting");
    expect(screen.getByDisplayValue("09:00")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10:00")).toBeInTheDocument();
  });

  it("updates form values when inputs change", async () => {
    render(
      <AddScheduleModal
        eventId={eventId}
        onClose={mockOnClose}
        onScheduleUpdated={mockOnScheduleUpdated}
      />
    );

    const descriptionInput = screen.getByPlaceholderText("Description");
const startTimeInput = screen.getByRole("textbox", { name: "" }); 
const endTimeInput = screen.getByRole("textbox", { name: "" }); 
    fireEvent.change(screen.getByDisplayValue(""), { target: { value: "08:30", name: "startTime" } });
    fireEvent.change(screen.getByDisplayValue(""), { target: { value: "09:30", name: "endTime" } });

    expect(descriptionInput).toHaveValue("Team Meeting");
    expect(screen.getByDisplayValue("08:30")).toBeInTheDocument();
    expect(screen.getByDisplayValue("09:30")).toBeInTheDocument();
  });

  it("calls API and callbacks when Save is clicked", async () => {
    const formData = {
      description: "Planning",
      startTime: "10:00",
      endTime: "11:00",
    };

    createEventSchedule.mockResolvedValueOnce({ success: true });

    render(
      <AddScheduleModal
        eventId={eventId}
        onClose={mockOnClose}
        onScheduleUpdated={mockOnScheduleUpdated}
        initialData={formData}
      />
    );

    const saveButton = screen.getByText(/Save/i);
    await userEvent.click(saveButton);

    expect(createEventSchedule).toHaveBeenCalledWith(eventId, formData);
    expect(mockOnScheduleUpdated).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onClose when the close button is clicked", async () => {
    render(
      <AddScheduleModal
        eventId={eventId}
        onClose={mockOnClose}
        onScheduleUpdated={mockOnScheduleUpdated}
      />
    );

    const closeButton = screen.getByText("×");
    await userEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
