import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import ScheduleModal from "../../components/ScheduleModal";
import AddScheduleModal from "../../components/AddScheduleModal";
import EditScheduleModal from "../../components/EditScheduleModal";
import { updateEventSchedule } from "../../backend/api/EventSchedule";

vi.mock("../../backend/api/EventSchedule", () => ({
  updateEventSchedule: vi.fn(),
}));

beforeAll(() => {
  // Mock both URL methods to avoid unhandled rejections
  global.URL.createObjectURL = vi.fn(() => "blob:mock-url");
  global.URL.revokeObjectURL = vi.fn();
});

describe("ScheduleModal", () => {
  it("calls onAddSchedule when Add button clicked", async () => {
    const onAddSchedule = vi.fn();
    render(<ScheduleModal eventId="evt123" onClose={vi.fn()} onAddSchedule={onAddSchedule} />);

    await act(async () => {
      fireEvent.click(screen.getByText(/\+ Add Schedule Item/i));
    });

    expect(onAddSchedule).toHaveBeenCalledWith(null);
  });

  it("calls onClose when × clicked", async () => {
    const onClose = vi.fn();
    render(<ScheduleModal eventId="evt123" onClose={onClose} onAddSchedule={vi.fn()} />);

    await act(async () => {
      fireEvent.click(screen.getByText("×"));
    });

    expect(onClose).toHaveBeenCalled();
  });

  it("exports to Word", async () => {
    render(<ScheduleModal eventId="evt123" onClose={vi.fn()} onAddSchedule={vi.fn()} />);
    fireEvent.click(screen.getByText(/Export to Word/i));

    await waitFor(() => {
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });
  });
});

describe("AddScheduleModal", () => {
  it("renders empty form", () => {
    render(
      <AddScheduleModal
        eventId="evt123"
        onClose={vi.fn()}
        onScheduleAdded={vi.fn()}
      />
    );

    // Textarea (description)
    expect(screen.getByPlaceholderText(/Description/i)).toBeInTheDocument();

    // Inputs by testid
    expect(screen.getByTestId("start-time")).toBeInTheDocument();
    expect(screen.getByTestId("end-time")).toBeInTheDocument();
  });

  it("submits new schedule", async () => {
    const onScheduleAdded = vi.fn();
    render(
      <AddScheduleModal
        eventId="evt123"
        onClose={vi.fn()}
        onScheduleAdded={onScheduleAdded}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/Description/i), {
      target: { value: "Test desc" },
    });

    const startTime = screen.getByTestId("start-time");
    const endTime = screen.getByTestId("end-time");

    fireEvent.change(startTime, { target: { value: "09:00" } });
    fireEvent.change(endTime, { target: { value: "10:00" } });

    fireEvent.click(screen.getByText(/Save/i));

    await waitFor(() => {
      expect(onScheduleAdded).toHaveBeenCalled();
    });
  });
});

describe("EditScheduleModal", () => {
  it("shows initial data", () => {
    render(
      <EditScheduleModal
        eventId="evt123"
        onClose={vi.fn()}
        onScheduleUpdated={vi.fn()}
        initialData={{ description: "foo", startTime: "08:00", endTime: "09:00" }}
      />
    );

    expect(screen.getByDisplayValue("foo")).toBeInTheDocument();
    expect(screen.getByDisplayValue("08:00")).toBeInTheDocument();
    expect(screen.getByDisplayValue("09:00")).toBeInTheDocument();
  });

  it("updates schedule", async () => {
    const onScheduleUpdated = vi.fn();
    updateEventSchedule.mockResolvedValue({}); // mock API success

    render(
      <EditScheduleModal
        eventId="evt123"
        onClose={vi.fn()}
        onScheduleUpdated={onScheduleUpdated}
        initialData={{ description: "foo", startTime: "08:00", endTime: "09:00" }}
      />
    );

    const startTime = screen.getByTestId("start-time");
    const endTime = screen.getByTestId("end-time");

    fireEvent.change(startTime, { target: { value: "11:00" } });
    fireEvent.change(endTime, { target: { value: "12:00" } });

    fireEvent.click(screen.getByText(/Save/i));

    await waitFor(() => {
      expect(onScheduleUpdated).toHaveBeenCalled();
    });
  });
});
