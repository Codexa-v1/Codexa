import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import InvitePage from "../../pages/InvitePage";

// Mock react-router-dom
const mockUseParams = vi.fn();
vi.mock("react-router-dom", () => ({
  useParams: () => mockUseParams(),
}));

// Mock alert
global.alert = vi.fn();

const mockEvent = {
  _id: "event123",
  title: "Summer Garden Party",
  date: "2025-07-15T00:00:00.000Z",
  endDate: "2025-07-15T23:59:59.000Z",
  startTime: "14:00",
  endTime: "18:00",
  location: "Central Park",
};

function mockFetchEvent(event = mockEvent, ok = true) {
  global.fetch = vi.fn().mockResolvedValue({
    ok,
    json: async () => event,
    text: async () => "duplicate key error",
    status: ok ? 200 : 400,
  });
}

function mockFetchRSVP(ok = true, errorText = "") {
  global.fetch = vi.fn().mockResolvedValue({
    ok,
    json: async () => ({}),
    text: async () => errorText,
    status: ok ? 200 : 400,
  });
}

describe("InvitePage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ eventId: "event123" });
    mockFetchEvent();
  });

  describe("Initial Render and Loading", () => {
    it("should display loading message initially", () => {
      global.fetch = vi.fn(() => new Promise(() => {})); // Never resolves
      render(<InvitePage />);
      expect(screen.getByText(/Loading invitation/i)).toBeInTheDocument();
    });

    it("should fetch event data on mount", async () => {
      render(<InvitePage />);
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining("/api/events/event123")
        );
      });
    });

    it("should fetch event with correct eventId from params", async () => {
      mockUseParams.mockReturnValue({ eventId: "different-event-id" });
      mockFetchEvent({ ...mockEvent, _id: "different-event-id" });
      render(<InvitePage />);
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining("/api/events/different-event-id")
        );
      });
    });

    it("should display event details after loading", async () => {
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByText(/You're Invited!/i)).toBeInTheDocument();
        expect(screen.getByText(/Summer Garden Party/i)).toBeInTheDocument();
      });
    });

    it("should handle fetch error gracefully", async () => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
      mockFetchEvent(null, false);
      render(<InvitePage />);
      await waitFor(() => {
        expect(consoleError).toHaveBeenCalled();
        expect(screen.getByText(/Event not found/i)).toBeInTheDocument();
      });
      consoleError.mockRestore();
    });
  });

  describe("Event Details Display", () => {
    it("should display event title", async () => {
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByText(/Summer Garden Party/i)).toBeInTheDocument();
      });
    });

    it("should display formatted dates", async () => {
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByText(/July 15, 2025/i)).toBeInTheDocument();
      });
    });

    it("should display event times", async () => {
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByText(/14:00/)).toBeInTheDocument();
        expect(screen.getByText(/18:00/)).toBeInTheDocument();
      });
    });

    it("should display event location", async () => {
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByText(/Central Park/i)).toBeInTheDocument();
      });
    });

    it("should format date correctly", async () => {
      const customEvent = {
        ...mockEvent,
        date: "2025-12-25T00:00:00.000Z",
        endDate: "2025-12-26T00:00:00.000Z",
      };
      mockFetchEvent(customEvent);
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByText(/25 December 2025/i)).toBeInTheDocument();
      });
    });
  });

  describe("Form Fields", () => {
    it("should render all required form fields", async () => {
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Enter your full name/i)).toBeInTheDocument();
      });
      expect(screen.getByPlaceholderText(/your.email@example.com/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/\+1 \(555\) 000-0000/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Vegetarian, Gluten-free, etc./i)).toBeInTheDocument();
    });

    it("should have correct input types", async () => {
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Enter your full name/i)).toHaveAttribute("type", "text");
      });
      expect(screen.getByPlaceholderText(/your.email@example.com/i)).toHaveAttribute("type", "email");
      expect(screen.getByPlaceholderText(/\+1 \(555\) 000-0000/i)).toHaveAttribute("type", "tel");
    });

    it("should mark required fields as required", async () => {
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Enter your full name/i)).toBeRequired();
      });
      expect(screen.getByPlaceholderText(/your.email@example.com/i)).toBeRequired();
      expect(screen.getByPlaceholderText(/\+1 \(555\) 000-0000/i)).toBeRequired();
      expect(screen.getByPlaceholderText(/Vegetarian, Gluten-free, etc./i)).not.toBeRequired();
    });

    it("should render RSVP status radio buttons", async () => {
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByLabelText(/Accept/i)).toBeInTheDocument();
      });
      expect(screen.getByLabelText(/Decline/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Maybe/i)).toBeInTheDocument();
    });

    it("should have Pending selected by default", async () => {
      render(<InvitePage />);
      await waitFor(() => {
        const pendingRadio = screen.getByLabelText(/Maybe/i);
        expect(pendingRadio).toBeChecked();
      });
    });

    it("should render submit button", async () => {
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Submit RSVP/i })).toBeInTheDocument();
      });
    });
  });

  describe("Form Interaction", () => {
    it("should update name field on input", async () => {
      const user = userEvent.setup();
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Enter your full name/i)).toBeInTheDocument();
      });
      const nameInput = screen.getByPlaceholderText(/Enter your full name/i);
      await user.type(nameInput, "John Doe");
      expect(nameInput).toHaveValue("John Doe");
    });

    it("should update email field on input", async () => {
      const user = userEvent.setup();
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/your.email@example.com/i)).toBeInTheDocument();
      });
      const emailInput = screen.getByPlaceholderText(/your.email@example.com/i);
      await user.type(emailInput, "john@example.com");
      expect(emailInput).toHaveValue("john@example.com");
    });

    it("should update phone field on input", async () => {
      const user = userEvent.setup();
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/\+1 \(555\) 000-0000/i)).toBeInTheDocument();
      });
      const phoneInput = screen.getByPlaceholderText(/\+1 \(555\) 000-0000/i);
      await user.type(phoneInput, "1234567890");
      expect(phoneInput).toHaveValue("1234567890");
    });

    it("should update dietary preferences field on input", async () => {
      const user = userEvent.setup();
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Vegetarian, Gluten-free, etc./i)).toBeInTheDocument();
      });
      const dietInput = screen.getByPlaceholderText(/Vegetarian, Gluten-free, etc./i);
      await user.type(dietInput, "Vegetarian");
      expect(dietInput).toHaveValue("Vegetarian");
    });

    it("should change RSVP status to Accepted", async () => {
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByLabelText(/Accept/i)).toBeInTheDocument();
      });
      const acceptRadio = screen.getByLabelText(/Accept/i);
      fireEvent.click(acceptRadio);
      expect(acceptRadio).toBeChecked();
      expect(screen.getByLabelText(/Decline/i)).not.toBeChecked();
      expect(screen.getByLabelText(/Maybe/i)).not.toBeChecked();
    });

    it("should change RSVP status to Declined", async () => {
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByLabelText(/Decline/i)).toBeInTheDocument();
      });
      const declineRadio = screen.getByLabelText(/Decline/i);
      fireEvent.click(declineRadio);
      expect(declineRadio).toBeChecked();
      expect(screen.getByLabelText(/Accept/i)).not.toBeChecked();
      expect(screen.getByLabelText(/Maybe/i)).not.toBeChecked();
    });

    it("should allow switching between RSVP statuses", async () => {
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByLabelText(/Accept/i)).toBeInTheDocument();
      });
      fireEvent.click(screen.getByLabelText(/Accept/i));
      expect(screen.getByLabelText(/Accept/i)).toBeChecked();
      fireEvent.click(screen.getByLabelText(/Decline/i));
      expect(screen.getByLabelText(/Decline/i)).toBeChecked();
      expect(screen.getByLabelText(/Accept/i)).not.toBeChecked();
      fireEvent.click(screen.getByLabelText(/Maybe/i));
      expect(screen.getByLabelText(/Maybe/i)).toBeChecked();
      expect(screen.getByLabelText(/Decline/i)).not.toBeChecked();
    });
  });

  describe("Form Submission", () => {
    it("should submit form with correct data", async () => {
      const user = userEvent.setup();
      mockFetchRSVP(true);
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Enter your full name/i)).toBeInTheDocument();
      });
      await user.type(screen.getByPlaceholderText(/Enter your full name/i), "John Doe");
      await user.type(screen.getByPlaceholderText(/your.email@example.com/i), "john@example.com");
      await user.type(screen.getByPlaceholderText(/\+1 \(555\) 000-0000/i), "1234567890");
      await user.type(screen.getByPlaceholderText(/Vegetarian, Gluten-free, etc./i), "Vegan");
      fireEvent.click(screen.getByLabelText(/Accept/i));
      fireEvent.click(screen.getByRole("button", { name: /Submit RSVP/i }));
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining("/api/guests/event/event123"),
          expect.objectContaining({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: "John Doe",
              email: "john@example.com",
              phone: "1234567890",
              rsvpStatus: "Accepted",
              dietaryPreferences: "Vegan",
              eventId: "event123",
            }),
          })
        );
      });
    });

    it("should disable submit button while submitting", async () => {
      const user = userEvent.setup();
      global.fetch = vi.fn(() => new Promise(() => {})); // Never resolves
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Enter your full name/i)).toBeInTheDocument();
      });
      await user.type(screen.getByPlaceholderText(/Enter your full name/i), "John Doe");
      await user.type(screen.getByPlaceholderText(/your.email@example.com/i), "john@example.com");
      await user.type(screen.getByPlaceholderText(/\+1 \(555\) 000-0000/i), "1234567890");
      const submitButton = screen.getByRole("button", { name: /Submit RSVP/i });
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Submitting.../i })).toBeDisabled();
      });
    });

    it("should show success message after successful submission", async () => {
      const user = userEvent.setup();
      mockFetchRSVP(true);
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Enter your full name/i)).toBeInTheDocument();
      });
      await user.type(screen.getByPlaceholderText(/Enter your full name/i), "John Doe");
      await user.type(screen.getByPlaceholderText(/your.email@example.com/i), "john@example.com");
      await user.type(screen.getByPlaceholderText(/\+1 \(555\) 000-0000/i), "1234567890");
      fireEvent.click(screen.getByRole("button", { name: /Submit RSVP/i }));
      await waitFor(() => {
        expect(screen.getByText(/RSVP Confirmed!/i)).toBeInTheDocument();
      });
    });

    it("should display event title in success message", async () => {
      const user = userEvent.setup();
      mockFetchRSVP(true);
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Enter your full name/i)).toBeInTheDocument();
      });
      await user.type(screen.getByPlaceholderText(/Enter your full name/i), "John Doe");
      await user.type(screen.getByPlaceholderText(/your.email@example.com/i), "john@example.com");
      await user.type(screen.getByPlaceholderText(/\+1 \(555\) 000-0000/i), "1234567890");
      fireEvent.click(screen.getByRole("button", { name: /Submit RSVP/i }));
      await waitFor(() => {
        expect(screen.getByText(/Summer Garden Party/i)).toBeInTheDocument();
      });
    });

    it("should hide form after successful submission", async () => {
      const user = userEvent.setup();
      mockFetchRSVP(true);
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Enter your full name/i)).toBeInTheDocument();
      });
      await user.type(screen.getByPlaceholderText(/Enter your full name/i), "John Doe");
      await user.type(screen.getByPlaceholderText(/your.email@example.com/i), "john@example.com");
      await user.type(screen.getByPlaceholderText(/\+1 \(555\) 000-0000/i), "1234567890");
      fireEvent.click(screen.getByRole("button", { name: /Submit RSVP/i }));
      await waitFor(() => {
        expect(screen.queryByPlaceholderText(/Enter your full name/i)).not.toBeInTheDocument();
      });
    });

    it("should include eventId in submission", async () => {
      const user = userEvent.setup();
      mockFetchRSVP(true);
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Enter your full name/i)).toBeInTheDocument();
      });
      await user.type(screen.getByPlaceholderText(/Enter your full name/i), "John Doe");
      await user.type(screen.getByPlaceholderText(/your.email@example.com/i), "john@example.com");
      await user.type(screen.getByPlaceholderText(/\+1 \(555\) 000-0000/i), "1234567890");
      fireEvent.click(screen.getByRole("button", { name: /Submit RSVP/i }));
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining("/api/guests/event/event123"),
          expect.objectContaining({
            body: expect.stringContaining('"eventId":"event123"'),
          })
        );
      });
    });
  });

  describe("Error Handling", () => {
    it("should show alert for duplicate email error", async () => {
      const user = userEvent.setup();
      mockFetchRSVP(false, "duplicate key error");
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByText(/Event not found/i)).toBeInTheDocument();
      });
      expect(alert).toHaveBeenCalledWith("This email has already RSVP'd for the event.");
    });

    it("should show generic error alert for other errors", async () => {
      const user = userEvent.setup();
      mockFetchRSVP(false, "other error");
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByText(/Event not found/i)).toBeInTheDocument();
      });
      expect(alert).toHaveBeenCalledWith("Failed to submit RSVP");
    });

    it("should log error to console on submission failure", async () => {
      const user = userEvent.setup();
      const error = new Error("Network error");
      global.fetch = vi.fn().mockRejectedValue(error);
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByText(/Event not found/i)).toBeInTheDocument();
      });
      expect(consoleError).toHaveBeenCalledWith(error);
      consoleError.mockRestore();
    });

    it("should re-enable submit button after error", async () => {
      const user = userEvent.setup();
      mockFetchRSVP(false, "other error");
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByText(/Event not found/i)).toBeInTheDocument();
      });
      expect(alert).toHaveBeenCalledWith("Failed to submit RSVP");
    });

    it("should handle network error without response", async () => {
      const user = userEvent.setup();
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByText(/Event not found/i)).toBeInTheDocument();
      });
      expect(alert).toHaveBeenCalledWith("Failed to submit RSVP");
    });
  });

  describe("Edge Cases", () => {
    it("should handle form submission without dietary preferences", async () => {
      const user = userEvent.setup();
      mockFetchRSVP(true);
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Enter your full name/i)).toBeInTheDocument();
      });
      await user.type(screen.getByPlaceholderText(/Enter your full name/i), "John Doe");
      await user.type(screen.getByPlaceholderText(/your.email@example.com/i), "john@example.com");
      await user.type(screen.getByPlaceholderText(/\+1 \(555\) 000-0000/i), "1234567890");
      fireEvent.click(screen.getByRole("button", { name: /Submit RSVP/i }));
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining("/api/guests/event/event123"),
          expect.objectContaining({
            body: expect.stringContaining('"dietaryPreferences":""'),
          })
        );
      });
    });

    it("should handle empty event data gracefully", async () => {
      mockFetchEvent(null, true);
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByText(/Event not found/i)).toBeInTheDocument();
      });
      expect(alert).toHaveBeenCalledWith("Failed to submit RSVP");
    });

    it("should update eventId when params change", async () => {
      const { rerender } = render(<InvitePage />);
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining("/api/events/event123")
        );
      });
      mockUseParams.mockReturnValue({ eventId: "event456" });
      mockFetchEvent({ ...mockEvent, _id: "event456" });
      rerender(<InvitePage />);
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining("/api/events/event456")
        );
      });
    });

    it("should prevent form submission when already submitting", async () => {
      const user = userEvent.setup();
      // Step 1: Event fetch resolves immediately
      mockFetchEvent();
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Enter your full name/i)).toBeInTheDocument();
      });
      // Step 2: RSVP submission never resolves
      global.fetch = vi.fn(() => new Promise(() => {}));
      await user.type(screen.getByPlaceholderText(/Enter your full name/i), "John Doe");
      await user.type(screen.getByPlaceholderText(/your.email@example.com/i), "john@example.com");
      await user.type(screen.getByPlaceholderText(/\+1 \(555\) 000-0000/i), "1234567890");
      const submitButton = screen.getByRole("button", { name: /Submit RSVP/i });
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Submitting.../i })).toBeDisabled();
      });
    });
  });

  describe("Date Formatting", () => {
    it("should format dates in long format", async () => {
      render(<InvitePage />);
      await waitFor(() => {
        expect(screen.getByText(/15 July 2025/i)).toBeInTheDocument();
      });
    });

    it("should handle different date formats", async () => {
      const customEvent = {
        ...mockEvent,
        date: "2025-01-01T10:00:00.000Z",
        endDate: "2025-01-02T10:00:00.000Z",
      };
      mockFetchEvent(customEvent);
      render(<InvitePage />);
      await waitFor(() => {
        expect(
          screen.getByText(/1 January 2025/i)
        ).toBeInTheDocument();
      });
    });
  });
});