import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";

// --- mock react-router-dom ---
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: vi.fn(), // define inline so it's safe for hoisting
  };
});

import { useParams } from "react-router-dom";
import RSVPPage from "../pages/RSVPPage.jsx";
// Mock backend API to return expected events
vi.mock("@/backend/api/EventData", () => ({
  getAllEvents: vi.fn(() =>
    Promise.resolve([
      {
        _id: "456",
        title: "Business Conference",
        category: "Conference",
        description: "Annual business conference",
        location: "Grand Hotel",
      },
      {
        _id: "123",
        title: "John’s 30th Birthday",
        category: "Birthday",
        description: "Surprise birthday party",
        location: "Home",
      },
    ])
  ),
}));

// --- mock alert ---
global.alert = vi.fn();

describe("RSVPPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders event details when eventId is valid", () => {
    useParams.mockReturnValue({ eventId: "456" }); // Conference

    render(<RSVPPage />);

    expect(screen.getByRole("heading", { name: /Business Conference/i })).toBeInTheDocument();
    expect(
      screen.getByText(/Annual business conference/i)
    ).toBeInTheDocument();
  });

  it("shows 'Event not found' when eventId is invalid", () => {
    useParams.mockReturnValue({ eventId: "999" });

    render(<RSVPPage />);

    expect(screen.getByText(/Event not found/i)).toBeInTheDocument();
  });

  it("submits RSVP form and shows alert", async () => {
  useParams.mockReturnValue({ eventId: "123" }); // Birthday

  render(<RSVPPage />);

  // fill form
  fireEvent.change(screen.getByPlaceholderText(/Full Name/i), {
    target: { value: "Alice Smith" },
  });
  fireEvent.change(screen.getByPlaceholderText(/example@gmail.com/i), {
    target: { value: "alice@example.com" },
  });
  fireEvent.change(screen.getByRole("spinbutton"), {
    target: { value: "0123456789" },
  });
  fireEvent.change(screen.getByLabelText(/Will you be attending/i), {
    target: { value: "no" },
  });
  fireEvent.click(screen.getByLabelText(/^Yes$/i)); // plus one radio

  fireEvent.click(screen.getByRole("button", { name: /Submit RSVP/i }));

  await waitFor(() => {
    expect(global.alert).toHaveBeenCalledWith("Thank you for your RSVP!");
  });
});

});
