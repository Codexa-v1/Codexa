import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import RSVPPage from "../pages/RSVPPage";

// Helper to render with router params
const renderWithRouter = (eventId) => {
  return render(
    <MemoryRouter initialEntries={[`/rsvp/${eventId}`]}>
      <Routes>
        <Route path="/rsvp/:eventId" element={<RSVPPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("RSVPPage", () => {
  beforeEach(() => {
    // Prevent actual alert() and console.log during tests
    vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("renders event details when event exists", () => {
    renderWithRouter("789"); // Wedding

    expect(
      screen.getByRole("heading", { name: /Emily & Jake’s Wedding/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Join us for a beautiful wedding celebration!/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Riverside Mansion/i)).toBeInTheDocument();
  });

  it("shows 'Event not found' if eventId is invalid", () => {
    renderWithRouter("999");

    expect(screen.getByText(/Event not found/i)).toBeInTheDocument();
  });

  it("lets user fill out the form and submit", () => {
    renderWithRouter("456"); // Conference

    // Fill inputs
    fireEvent.change(screen.getByPlaceholderText(/Full Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/example@gmail.com/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Mobile Number/i), {
      target: { value: "1234567890" },
    });

    // Change dropdown
    fireEvent.change(screen.getByDisplayValue("yes"), {
      target: { value: "no" },
    });

    // Change radio button
    fireEvent.click(screen.getByLabelText(/Yes/i)); // plusOne yes

    // Submit
    fireEvent.click(screen.getByRole("button", { name: /Submit RSVP/i }));

    // Check side effects
    expect(console.log).toHaveBeenCalledWith("Submitting RSVP:", {
      fullName: "John Doe",
      email: "john@example.com",
      mobileNumber: "1234567890",
      attending: "no",
      plusOne: "yes",
    });
    expect(window.alert).toHaveBeenCalledWith("Thank you for your RSVP!");
  });
});
