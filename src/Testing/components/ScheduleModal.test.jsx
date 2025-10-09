import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import ScheduleModal from "../../components/ScheduleModal";
import AddScheduleModal from "../../components/AddScheduleModal";
import {
  getSchedule,
  deleteEventSchedule,
} from "../../backend/api/EventSchedule";

vi.mock("../../backend/api/EventSchedule", () => ({
  getSchedule: vi.fn(),
  deleteEventSchedule: vi.fn(),
}));

// Mock AddScheduleModal to avoid rendering its internals
vi.mock("../../components/AddScheduleModal", () => ({
  __esModule: true,
  default: ({ onClose, onSaved }) => (
    <div data-testid="add-schedule-modal">
      <button onClick={onClose}>Close Add/Edit</button>
      <button onClick={onSaved}>Save Add/Edit</button>
    </div>
  ),
}));

beforeAll(() => {
  global.URL.createObjectURL = vi.fn(() => "blob:mock-url");
  global.URL.revokeObjectURL = vi.fn();
});

describe("ScheduleModal", () => {
  const eventId = "evt123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", async () => {
    getSchedule.mockImplementation(() => new Promise(() => {})); // never resolves
    render(<ScheduleModal eventId={eventId} onClose={vi.fn()} />);
    expect(screen.getByText(/Loading schedule/i)).toBeInTheDocument();
  });

  it("renders empty state when no schedule items", async () => {
    getSchedule.mockResolvedValue([]);
    render(<ScheduleModal eventId={eventId} onClose={vi.fn()} />);
    await screen.findByText(/No schedule items added yet/i);
    expect(screen.getByText(/Click "Add Schedule Item" to get started/i)).toBeInTheDocument();
  });

  it("renders schedule items", async () => {
    getSchedule.mockResolvedValue([
      { _id: "1", description: "Meeting", startTime: "09:00", endTime: "10:00" },
      { _id: "2", description: "Workshop", startTime: "10:30", endTime: "12:00" },
    ]);
    render(<ScheduleModal eventId={eventId} onClose={vi.fn()} />);
    expect(await screen.findByText("Meeting")).toBeInTheDocument();
    expect(screen.getByText("Workshop")).toBeInTheDocument();
    expect(screen.getAllByTitle("Edit").length).toBe(2);
    expect(screen.getAllByTitle("Remove").length).toBe(2);
  });

  it("calls onClose when × is clicked", async () => {
    getSchedule.mockResolvedValue([]);
    const onClose = vi.fn();
    render(<ScheduleModal eventId={eventId} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "" })); // The × button
    expect(onClose).toHaveBeenCalled();
  });

  it("opens AddScheduleModal when Add Schedule Item is clicked", async () => {
    getSchedule.mockResolvedValue([]);
    render(<ScheduleModal eventId={eventId} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText(/\+ Add Schedule Item/i));
    expect(screen.getByTestId("add-schedule-modal")).toBeInTheDocument();
  });

  it("opens AddScheduleModal for editing when Edit is clicked", async () => {
    getSchedule.mockResolvedValue([
      { _id: "1", description: "Meeting", startTime: "09:00", endTime: "10:00" },
    ]);
    render(<ScheduleModal eventId={eventId} onClose={vi.fn()} />);
    await screen.findByText("Meeting");
    fireEvent.click(screen.getByTitle("Edit"));
    expect(screen.getByTestId("add-schedule-modal")).toBeInTheDocument();
  });

  it("removes a schedule item after confirmation", async () => {
    getSchedule.mockResolvedValue([
      { _id: "1", description: "Meeting", startTime: "09:00", endTime: "10:00" },
    ]);
    deleteEventSchedule.mockResolvedValue({});
    render(<ScheduleModal eventId={eventId} onClose={vi.fn()} />);
    await screen.findByText("Meeting");
    fireEvent.click(screen.getByTitle("Remove"));
    // Confirm modal appears
    expect(screen.getByText(/Delete Schedule Item/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText("Delete"));
    await waitFor(() => {
      expect(deleteEventSchedule).toHaveBeenCalledWith(eventId, "1");
    });
  });

  it("cancels delete confirmation", async () => {
    getSchedule.mockResolvedValue([
      { _id: "1", description: "Meeting", startTime: "09:00", endTime: "10:00" },
    ]);
    render(<ScheduleModal eventId={eventId} onClose={vi.fn()} />);
    await screen.findByText("Meeting");
    fireEvent.click(screen.getByTitle("Remove"));
    expect(screen.getByText(/Delete Schedule Item/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText(/Delete Schedule Item/i)).not.toBeInTheDocument();
  });

  it("logs error if deleteEventSchedule fails", async () => {
    getSchedule.mockResolvedValue([
      { _id: "1", description: "Meeting", startTime: "09:00", endTime: "10:00" },
    ]);
    deleteEventSchedule.mockRejectedValue(new Error("Delete failed"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<ScheduleModal eventId={eventId} onClose={vi.fn()} />);
    await screen.findByText("Meeting");
    fireEvent.click(screen.getByTitle("Remove"));
    fireEvent.click(screen.getByText("Delete"));
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error removing schedule item:",
        expect.any(Error)
      );
    });
    consoleSpy.mockRestore();
  });

  it("exports to Word", async () => {
    getSchedule.mockResolvedValue([
      { _id: "1", description: "Meeting", startTime: "09:00", endTime: "10:00" },
    ]);
    // Mock fetch for event details
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        title: "Event Title",
        date: "2025-09-01T10:00:00.000Z",
        location: "Test Location",
        description: "Test Description",
      }),
    });
    render(<ScheduleModal eventId={eventId} onClose={vi.fn()} />);
    await screen.findByText("Meeting");
    fireEvent.click(screen.getByText(/Export to Word/i));
    await waitFor(() => {
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });
  });

  it("logs error if export to Word fails", async () => {
    getSchedule.mockResolvedValue([
      { _id: "1", description: "Meeting", startTime: "09:00", endTime: "10:00" },
    ]);
    // Mock fetch to throw
    global.fetch = vi.fn().mockRejectedValue(new Error("Fetch failed"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<ScheduleModal eventId={eventId} onClose={vi.fn()} />);
    await screen.findByText("Meeting");
    fireEvent.click(screen.getByText(/Export to Word/i));
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    consoleSpy.mockRestore();
  });
});
