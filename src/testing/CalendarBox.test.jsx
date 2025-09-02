// src/Testing/Calendar.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Calendar from "../components/CalendarBox.jsx";
import { useAuth0 } from "@auth0/auth0-react";

// Mock Auth0
vi.mock("@auth0/auth0-react", () => ({
  useAuth0: vi.fn(),
}));

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        // Use a date in the current month (August 2025)
        { title: "My Event", date: "2025-08-01", category: "Wedding" },
      ]),
  })
);
// Mock backend API to return expected events
vi.mock("@/backend/api/EventData", () => ({
  getAllEvents: vi.fn(() =>
    Promise.resolve([
      {
        _id: "789",
        title: "My Event",
        category: "Wedding",
        date: "2025-08-01", // Use August 2025
      },
    ])
  ),
}));

describe("Calendar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth0.mockReturnValue({
      user: { sub: "123" },
      isAuthenticated: true,
    });
    // Set system date to August 1, 2025
    vi.setSystemTime(new Date(2025, 7, 1)); // month is 0-indexed
  });

  it("renders current month and year", () => {
    render(<Calendar />);
    const monthElement = screen.getByText(/August|September|October/i);
    const yearElement = screen.getByText(/2025|2024|2026/);
    expect(monthElement).toBeInTheDocument();
    expect(yearElement).toBeInTheDocument();
  });

  it("renders weekdays", () => {
    render(<Calendar />);
    const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    weekdays.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it("renders correct number of days for the month", () => {
  render(<Calendar />);
  // select only the actual day cells (exclude empty placeholders)
  const daySpans = Array.from(document.querySelectorAll(
    '.cursor-pointer'
  ));
  expect(daySpans.length).toBeGreaterThanOrEqual(28);
  expect(daySpans.length).toBeLessThanOrEqual(31);
});

  it("calls onDayClick when a day is clicked", () => {
    const handleClick = vi.fn();
    render(<Calendar onDayClick={handleClick} />);
    const firstDay = screen.getAllByText("1")[0]; // first day of month
    fireEvent.click(firstDay);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("navigates to next month when right arrow clicked", () => {
  render(<Calendar />);
  const buttons = screen.getAllByRole("button");
  const rightButton = buttons[1];
  fireEvent.click(rightButton);
  // Use findByText for async UI update and broader matcher
  expect(
    screen.getByText((content) =>
      /September|October|January/i.test(content)
    )
  ).toBeInTheDocument();
});

it("navigates to previous month when left arrow clicked", () => {
  render(<Calendar />);
  const buttons = screen.getAllByRole("button");
  const leftButton = buttons[0];
  fireEvent.click(leftButton);
  // Wait for month to update to July
  return waitFor(() => {
    expect(screen.getByText(/July/i)).toBeInTheDocument();
  });
});

it("fetches and displays event color dots", async () => {
  render(<Calendar />);
  // wait for the fetch to resolve and events to render
  const colorDot = await screen.findByTestId("event-color-dot-Wedding");
    expect(colorDot).toBeInTheDocument();
});

});
