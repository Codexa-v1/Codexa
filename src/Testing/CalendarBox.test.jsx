// src/Testing/Calendar.test.jsx
import React from "react";
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
        { title: "My Event", date: "2025-08-15", category: "Wedding" },
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
  const buttons = screen.getAllByRole("button"); // get both nav buttons
  const rightButton = buttons[1]; // second button is "next"
  fireEvent.click(rightButton);
  // check that month text updated
  expect(screen.getByText(/September|October|January/i)).toBeInTheDocument();
});

it("navigates to previous month when left arrow clicked", () => {
  render(<Calendar />);
  const buttons = screen.getAllByRole("button");
  const leftButton = buttons[0]; // first button is "prev"
  fireEvent.click(leftButton);
  expect(screen.getByText(/July|June|December/i)).toBeInTheDocument();
});

it("fetches and displays event color dots", async () => {
  render(<Calendar />);
  // wait for the fetch to resolve and events to render
  await waitFor(() => {
    expect(document.querySelector(".bg-pink-500")).toBeInTheDocument();
  });
});

});
