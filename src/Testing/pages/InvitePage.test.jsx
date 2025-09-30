import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import axios from "axios";
import InvitePage from "../../pages/InvitePage";

// Mock axios
vi.mock("axios");

// Mock react-router-dom
const mockUseParams = vi.fn();
vi.mock("react-router-dom", () => ({
  useParams: () => mockUseParams(),
}));

// Mock alert
global.alert = vi.fn();

describe("InvitePage Component", () => {
  const mockEvent = {
    _id: "event123",
    title: "Summer Garden Party",
    date: "2025-07-15T00:00:00.000Z",
    endDate: "2025-07-15T23:59:59.000Z",
    startTime: "14:00",
    endTime: "18:00",
    location: "Central Park",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ eventId: "event123" });
    axios.get.mockResolvedValue({ data: mockEvent });
  });

  describe("Initial Render and Loading", () => {
    it("should display loading message initially", () => {
      axios.get.mockImplementation(() => new Promise(() => {})); // Never resolves
      render(<InvitePage />);
      
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should fetch event data on mount", async () => {
      render(<InvitePage />);

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          "https://planit-backend-amfkhqcgbvfhamhx.canadacentral-01.azurewebsites.net/api/events/event123"
        );
      });
    });

    it("should fetch event with correct eventId from params", async () => {
      mockUseParams.mockReturnValue({ eventId: "different-event-id" });
      
      render(<InvitePage />);

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining("different-event-id")
        );
      });
    });

    it("should display event details after loading", async () => {
      render(<InvitePage />);

      await waitFor(() => {
        expect(screen.getByText(/You're Invited to Summer Garden Party/i)).toBeInTheDocument();
      });
    });

    it("should handle fetch error gracefully", async () => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
      axios.get.mockRejectedValue(new Error("Network error"));

      render(<InvitePage />);

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith(
          "Failed to load event",
          expect.any(Error)
        );
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
        expect(screen.getByText(/14:00 – 18:00/i)).toBeInTheDocument();
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
      axios.get.mockResolvedValue({ data: customEvent });

      render(<InvitePage />);

      await waitFor(() => {
        expect(screen.getByText(/December 25, 2025/i)).toBeInTheDocument();
      });
    });
  });

  describe("Form Fields", () => {
    it("should render all required form fields", async () => {
      render(<InvitePage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
      });

      expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Phone")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Dietary Preferences (optional)")).toBeInTheDocument();
    });

    it("should have correct input types", async () => {
      render(<InvitePage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Full Name")).toHaveAttribute("type", "text");
      });

      expect(screen.getByPlaceholderText("Email")).toHaveAttribute("type", "email");
      expect(screen.getByPlaceholderText("Phone")).toHaveAttribute("type", "tel");
    });

    it("should mark required fields as required", async () => {
      render(<InvitePage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Full Name")).toBeRequired();
      });

      expect(screen.getByPlaceholderText("Email")).toBeRequired();
      expect(screen.getByPlaceholderText("Phone")).toBeRequired();
      expect(screen.getByPlaceholderText("Dietary Preferences (optional)")).not.toBeRequired();
    });

    it("should render RSVP status radio buttons", async () => {
      render(<InvitePage />);

      await waitFor(() => {
        expect(screen.getByLabelText("Accept")).toBeInTheDocument();
      });

      expect(screen.getByLabelText("Decline")).toBeInTheDocument();
      expect(screen.getByLabelText("Maybe")).toBeInTheDocument();
    });

    it("should have Pending selected by default", async () => {
      render(<InvitePage />);

      await waitFor(() => {
        const pendingRadio = screen.getByLabelText("Maybe");
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
        expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText("Full Name");
      await user.type(nameInput, "John Doe");

      expect(nameInput).toHaveValue("John Doe");
    });

    it("should update email field on input", async () => {
      const user = userEvent.setup();
      render(<InvitePage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
      });

      const emailInput = screen.getByPlaceholderText("Email");
      await user.type(emailInput, "john@example.com");

      expect(emailInput).toHaveValue("john@example.com");
    });

    it("should update phone field on input", async () => {
      const user = userEvent.setup();
      render(<InvitePage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Phone")).toBeInTheDocument();
      });

      const phoneInput = screen.getByPlaceholderText("Phone");
      await user.type(phoneInput, "1234567890");

      expect(phoneInput).toHaveValue("1234567890");
    });

    it("should update dietary preferences field on input", async () => {
      const user = userEvent.setup();
      render(<InvitePage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Dietary Preferences (optional)")).toBeInTheDocument();
      });

      const dietInput = screen.getByPlaceholderText("Dietary Preferences (optional)");
      await user.type(dietInput, "Vegetarian");

      expect(dietInput).toHaveValue("Vegetarian");
    });

    it("should change RSVP status to Accepted", async () => {
      render(<InvitePage />);

      await waitFor(() => {
        expect(screen.getByLabelText("Accept")).toBeInTheDocument();
      });

      const acceptRadio = screen.getByLabelText("Accept");
      fireEvent.click(acceptRadio);

      expect(acceptRadio).toBeChecked();
      expect(screen.getByLabelText("Decline")).not.toBeChecked();
      expect(screen.getByLabelText("Maybe")).not.toBeChecked();
    });

    it("should change RSVP status to Declined", async () => {
      render(<InvitePage />);

      await waitFor(() => {
        expect(screen.getByLabelText("Decline")).toBeInTheDocument();
      });

      const declineRadio = screen.getByLabelText("Decline");
      fireEvent.click(declineRadio);

      expect(declineRadio).toBeChecked();
      expect(screen.getByLabelText("Accept")).not.toBeChecked();
      expect(screen.getByLabelText("Maybe")).not.toBeChecked();
    });

    it("should allow switching between RSVP statuses", async () => {
      render(<InvitePage />);

      await waitFor(() => {
        expect(screen.getByLabelText("Accept")).toBeInTheDocument();
      });

      // Click Accept
      fireEvent.click(screen.getByLabelText("Accept"));
      expect(screen.getByLabelText("Accept")).toBeChecked();

      // Click Decline
      fireEvent.click(screen.getByLabelText("Decline"));
      expect(screen.getByLabelText("Decline")).toBeChecked();
      expect(screen.getByLabelText("Accept")).not.toBeChecked();

      // Click Maybe
      fireEvent.click(screen.getByLabelText("Maybe"));
      expect(screen.getByLabelText("Maybe")).toBeChecked();
      expect(screen.getByLabelText("Decline")).not.toBeChecked();
    });
  });

  describe("Form Submission", () => {
    it("should submit form with correct data", async () => {
      const user = userEvent.setup();
      axios.post.mockResolvedValue({ data: { success: true } });

      render(<InvitePage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
      });

      // Fill form
      await user.type(screen.getByPlaceholderText("Full Name"), "John Doe");
      await user.type(screen.getByPlaceholderText("Email"), "john@example.com");
      await user.type(screen.getByPlaceholderText("Phone"), "1234567890");
      await user.type(screen.getByPlaceholderText("Dietary Preferences (optional)"), "Vegan");
      fireEvent.click(screen.getByLabelText("Accept"));

      // Submit
      fireEvent.click(screen.getByRole("button", { name: /Submit RSVP/i }));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          "https://planit-backend-amfkhqcgbvfhamhx.canadacentral-01.azurewebsites.net/api/guests/event/event123",
          {
            name: "John Doe",
            email: "john@example.com",
            phone: "1234567890",
            rsvpStatus: "Accepted",
            dietaryPreferences: "Vegan",
            eventId: "event123",
          }
        );
      });
    });

    it("should disable submit button while submitting", async () => {
      const user = userEvent.setup();
      axios.post.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(<InvitePage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
      });

      // Fill required fields
      await user.type(screen.getByPlaceholderText("Full Name"), "John Doe");
      await user.type(screen.getByPlaceholderText("Email"), "john@example.com");
      await user.type(screen.getByPlaceholderText("Phone"), "1234567890");

      // Submit
      const submitButton = screen.getByRole("button", { name: /Submit RSVP/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Submitting.../i })).toBeDisabled();
      });
    });

    it("should show success message after successful submission", async () => {
      const user = userEvent.setup();
      axios.post.mockResolvedValue({ data: { success: true } });

      render(<InvitePage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
      });

      // Fill required fields
      await user.type(screen.getByPlaceholderText("Full Name"), "John Doe");
      await user.type(screen.getByPlaceholderText("Email"), "john@example.com");
      await user.type(screen.getByPlaceholderText("Phone"), "1234567890");

      // Submit
      fireEvent.click(screen.getByRole("button", { name: /Submit RSVP/i }));

      await waitFor(() => {
        expect(screen.getByText(/RSVP Confirmation Successful!/i)).toBeInTheDocument();
      });
    });

    it("should display event title in success message", async () => {
      const user = userEvent.setup();
      axios.post.mockResolvedValue({ data: { success: true } });

      render(<InvitePage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
      });

      // Fill and submit
      await user.type(screen.getByPlaceholderText("Full Name"), "John Doe");
      await user.type(screen.getByPlaceholderText("Email"), "john@example.com");
      await user.type(screen.getByPlaceholderText("Phone"), "1234567890");
      fireEvent.click(screen.getByRole("button", { name: /Submit RSVP/i }));

      await waitFor(() => {
        expect(screen.getByText(/Summer Garden Party/i)).toBeInTheDocument();
      });
    });

    it("should hide form after successful submission", async () => {
      const user = userEvent.setup();
      axios.post.mockResolvedValue({ data: { success: true } });

      render(<InvitePage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
      });

      // Fill and submit
      await user.type(screen.getByPlaceholderText("Full Name"), "John Doe");
      await user.type(screen.getByPlaceholderText("Email"), "john@example.com");
      await user.type(screen.getByPlaceholderText("Phone"), "1234567890");
      fireEvent.click(screen.getByRole("button", { name: /Submit RSVP/i }));

      await waitFor(() => {
        expect(screen.queryByPlaceholderText("Full Name")).not.toBeInTheDocument();
      });
    });

    it("should include eventId in submission", async () => {
      const user = userEvent.setup();
      axios.post.mockResolvedValue({ data: { success: true } });

      render(<InvitePage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
      });

      // Fill and submit
      await user.type(screen.getByPlaceholderText("Full Name"), "John Doe");
      await user.type(screen.getByPlaceholderText("Email"), "john@example.com");
      await user.type(screen.getByPlaceholderText("Phone"), "1234567890");
      fireEvent.click(screen.getByRole("button", { name: /Submit RSVP/i }));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({ eventId: "event123" })
        );
      });
    });
  });

  describe("Error Handling", () => {
    it("should show alert for duplicate email error", async () => {
      const user = userEvent.setup();
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
      
      axios.post.mockRejectedValue({
        response: {
          status: 400,
          data: "duplicate key error",
        },
      });

      render(<InvitePage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
      });

      // Fill and submit
      await user.type(screen.getByPlaceholderText("Full Name"), "John Doe");
      await user.type(screen.getByPlaceholderText("Email"), "john@example.com");
      await user.type(screen.getByPlaceholderText("Phone"), "1234567890");
      fireEvent.click(screen.getByRole("button", { name: /Submit RSVP/i }));

      await waitFor(() => {
        expect(alert).toHaveBeenCalledWith("This email has already RSVP'd for the event.");
      });

      consoleError.mockRestore();
    });

    it("should show generic error alert for other errors", async () => {
      const user = userEvent.setup();
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
      
      axios.post.mockRejectedValue({
        response: {
          status: 500,
          data: "Internal server error",
        },
      });

      render(<InvitePage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
      });

      // Fill and submit
      await user.type(screen.getByPlaceholderText("Full Name"), "John Doe");
      await user.type(screen.getByPlaceholderText("Email"), "john@example.com");
      await user.type(screen.getByPlaceholderText("Phone"), "1234567890");
      fireEvent.click(screen.getByRole("button", { name: /Submit RSVP/i }));

      await waitFor(() => {
        expect(alert).toHaveBeenCalledWith("Failed to submit RSVP");
      });

      consoleError.mockRestore();
    });

    it("should log error to console on submission failure", async () => {
      const user = userEvent.setup();
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
      const error = new Error("Network error");
      
      axios.post.mockRejectedValue(error);

      render(<InvitePage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
      });

      // Fill and submit
      await user.type(screen.getByPlaceholderText("Full Name"), "John Doe");
      await user.type(screen.getByPlaceholderText("Email"), "john@example.com");
      await user.type(screen.getByPlaceholderText("Phone"), "1234567890");
      fireEvent.click(screen.getByRole("button", { name: /Submit RSVP/i }));

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith(error);
      });

      consoleError.mockRestore();
    });

    it("should re-enable submit button after error", async () => {
      const user = userEvent.setup();
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
      
      axios.post.mockRejectedValue(new Error("Network error"));

      render(<InvitePage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
      });

      // Fill and submit
      await user.type(screen.getByPlaceholderText("Full Name"), "John Doe");
      await user.type(screen.getByPlaceholderText("Email"), "john@example.com");
      await user.type(screen.getByPlaceholderText("Phone"), "1234567890");
      fireEvent.click(screen.getByRole("button", { name: /Submit RSVP/i }));

      await waitFor(() => {
        const submitButton = screen.getByRole("button", { name: /Submit RSVP/i });
        expect(submitButton).not.toBeDisabled();
      });

      consoleError.mockRestore();
    });

    it("should handle network error without response", async () => {
      const user = userEvent.setup();
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
      
      axios.post.mockRejectedValue(new Error("Network error"));

      render(<InvitePage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
      });

      // Fill and submit
      await user.type(screen.getByPlaceholderText("Full Name"), "John Doe");
      await user.type(screen.getByPlaceholderText("Email"), "john@example.com");
      await user.type(screen.getByPlaceholderText("Phone"), "1234567890");
      fireEvent.click(screen.getByRole("button", { name: /Submit RSVP/i }));

      await waitFor(() => {
        expect(alert).toHaveBeenCalledWith("Failed to submit RSVP");
      });

      consoleError.mockRestore();
    });
  });

  describe("Edge Cases", () => {
    it("should handle form submission without dietary preferences", async () => {
      const user = userEvent.setup();
      axios.post.mockResolvedValue({ data: { success: true } });

      render(<InvitePage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
      });

      // Fill only required fields
      await user.type(screen.getByPlaceholderText("Full Name"), "John Doe");
      await user.type(screen.getByPlaceholderText("Email"), "john@example.com");
      await user.type(screen.getByPlaceholderText("Phone"), "1234567890");
      fireEvent.click(screen.getByRole("button", { name: /Submit RSVP/i }));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({ dietaryPreferences: "" })
        );
      });
    });

    it("should handle empty event data gracefully", async () => {
      axios.get.mockResolvedValue({ data: null });

      render(<InvitePage />);

      // Should still show loading since event is null
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should update eventId when params change", async () => {
      const { rerender } = render(<InvitePage />);

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining("event123")
        );
      });

      // Change eventId
      mockUseParams.mockReturnValue({ eventId: "event456" });
      axios.get.mockResolvedValue({ data: { ...mockEvent, _id: "event456" } });

      rerender(<InvitePage />);

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining("event456")
        );
      });
    });

    it("should prevent form submission when already submitting", async () => {
      const user = userEvent.setup();
      axios.post.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(<InvitePage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
      });

      // Fill and submit
      await user.type(screen.getByPlaceholderText("Full Name"), "John Doe");
      await user.type(screen.getByPlaceholderText("Email"), "john@example.com");
      await user.type(screen.getByPlaceholderText("Phone"), "1234567890");
      
      const submitButton = screen.getByRole("button", { name: /Submit RSVP/i });
      fireEvent.click(submitButton);

      // Try to submit again
      await waitFor(() => {
        const disabledButton = screen.getByRole("button", { name: /Submitting.../i });
        expect(disabledButton).toBeDisabled();
      });
    });
  });

  describe("Date Formatting", () => {
    it("should format dates in long format", async () => {
      render(<InvitePage />);

      await waitFor(() => {
        const dateText = screen.getByText(/From:/);
        expect(dateText).toBeInTheDocument();
      });
    });

    it("should handle different date formats", async () => {
      const customEvent = {
        ...mockEvent,
        date: "2025-01-01T10:00:00.000Z",
        endDate: "2025-01-02T10:00:00.000Z",
      };
      axios.get.mockResolvedValue({ data: customEvent });

      render(<InvitePage />);

      await waitFor(() => {
        expect(screen.getByText(/January 1, 2025/i)).toBeInTheDocument();
      });
    });
  });
});