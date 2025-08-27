import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import RSVPPage from "../pages/RSVPPage.jsx";

// --- mock react-router-dom ---
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: vi.fn(), // inline so it's available at hoist time
  };
});

import { useParams } from "react-router-dom";

// --- mock fetch ---
global.fetch = vi.fn();

describe("RSVPPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches event details and displays them", async () => {
    // set return value for useParams
    useParams.mockReturnValue({ eventId: "456" });

    // mock fetch for event details
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "456", title: "Test Event" }),
    });

    render(<RSVPPage />);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/events/456")
    );

    await waitFor(() => {
      expect(screen.getByText(/Test Event/i)).toBeInTheDocument();
    });
  });

  it("submits RSVP successfully", async () => {
    useParams.mockReturnValue({ eventId: "456" });

    // first fetch: event details
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "456", title: "Test Event" }),
    });

    // second fetch: RSVP submission
    fetch.mockResolvedValueOnce({ ok: true });

    render(<RSVPPage />);

    await waitFor(() => {
  expect(screen.getByText(/Business Conference/i)).toBeInTheDocument();
});


    fireEvent.change(screen.getByLabelText(/Your Name/i), {
      target: { value: "Alice" },
    });
    fireEvent.change(screen.getByLabelText(/Your Email/i), {
      target: { value: "alice@example.com" },
    });
    fireEvent.click(screen.getByText(/Submit RSVP/i));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/events/456/rsvp"),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "Alice", email: "alice@example.com" }),
        })
      );
    });
  });
});
