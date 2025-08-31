// src/Testing/Calendar.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Calendar from "../components/CalendarBox.jsx";
import { useAuth0 } from "@auth0/auth0-react";
import dayjs from "dayjs";

// Mock Auth0
vi.mock("@auth0/auth0-react", () => ({
  useAuth0: vi.fn(),
}));

// Mock fetch globally
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        {
          _id: "1",
          title: "My Event",
          date: "2025-08-15",
          category: "Wedding",
          color: "pink", // 👈 ensure CalendarBox renders bg-pink-500
        },
      ]),
  })
);

describe("Calendar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth0.mockReturnValue({
      user: { sub: "123" },
      isAuthenticated: true,
    });
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
    const daySpans = Array.from(
      document.querySelectorAll(".cursor-pointer")
    );
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
    expect(
      screen.getByText(/September|October|January/i)
    ).toBeInTheDocument();
  });
  

it("navigates to previous month when left arrow clicked", () => {
  render(<Calendar />);

  // Get current month before click
  let [monthHeading] = screen.getAllByRole("heading", { level: 2 });
  const currentMonth = monthHeading.textContent.replace(",", "").trim();

  // Click left arrow
  const [leftButton] = screen.getAllByRole("button");
  fireEvent.click(leftButton);

  // Compute expected previous month
  const expected = dayjs().month(dayjs().month() - 1).format("MMMM");

  // Re-read heading after click
  [monthHeading] = screen.getAllByRole("heading", { level: 2 });
  expect(monthHeading).toHaveTextContent(expected);
});




});
