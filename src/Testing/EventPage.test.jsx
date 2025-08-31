import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import EventsPage from "../pages/EventsPage";
import React from "react";

// ✅ mock react-router navigate
const mockedNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockedNavigate,
}));

// mock Navbar so tests don't break
vi.mock("../components/Navbar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

describe("EventsPage", () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  test("renders heading and events", () => {
    render(<EventsPage />);

    expect(screen.getByRole("heading", { name: /All Events/i })).toBeInTheDocument();

    // check that mock events are shown
    expect(screen.getByText(/Emily & Jake/i)).toBeInTheDocument();
    expect(screen.getByText(/Business Conference/i)).toBeInTheDocument();
    expect(screen.getByText(/John’s 30th Birthday/i)).toBeInTheDocument();
  });

  test("search filters events by title", () => {
    render(<EventsPage />);

    const searchBox = screen.getByPlaceholderText(/Search events/i);
    fireEvent.change(searchBox, { target: { value: "Wedding" } });

    expect(screen.getByText(/Emily & Jake/i)).toBeInTheDocument();
    expect(screen.queryByText(/Business Conference/i)).not.toBeInTheDocument();
  });

  test("filter dropdown filters by type", () => {
    render(<EventsPage />);

    const dropdown = screen.getByRole("combobox");
    fireEvent.change(dropdown, { target: { value: "Conference" } });

    expect(screen.getByText(/Business Conference/i)).toBeInTheDocument();
    expect(screen.queryAllByText(/Wedding/i)).toHaveLength(1);
  });

  test("shows 'No events found' when no matches", () => {
    render(<EventsPage />);

    const searchBox = screen.getByPlaceholderText(/Search events/i);
    fireEvent.change(searchBox, { target: { value: "Nonexistent" } });

    expect(screen.getByText(/No events found/i)).toBeInTheDocument();
  });

  test("clicking View navigates to event detail", () => {
    render(<EventsPage />);

    const viewBtn = screen.getAllByRole("button", { name: /View/i })[0];
    fireEvent.click(viewBtn);

    expect(mockedNavigate).toHaveBeenCalledWith(expect.stringMatching(/^\/events\/\w+$/));
  });

});
