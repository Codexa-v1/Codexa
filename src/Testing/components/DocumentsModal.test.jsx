import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, beforeEach, expect } from "vitest";
import DocumentsModal from "@/components/DocumentsModal";
import { useAuth0 } from "@auth0/auth0-react";
import DocumentUpload from "@/components/DocumentUpload";

// Mock Auth0
vi.mock("@auth0/auth0-react", () => ({
  useAuth0: vi.fn(),
}));

// Mock DocumentUpload
vi.mock("@/components/DocumentUpload", () => ({
  default: vi.fn(() => <div data-testid="document-upload" />),
}));

global.fetch = vi.fn();

describe("DocumentsModal", () => {
  const mockUser = { sub: "user-123" };
  const mockEventId = "event-456";
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth0.mockReturnValue({ user: mockUser, isAuthenticated: true });
  });

  it("renders header and close button", () => {
    render(<DocumentsModal onClose={onClose} eventId={mockEventId} />);
    expect(screen.getByText("Event Documents")).toBeInTheDocument();

    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  it("shows loading and then documents", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => [{ name: "Doc1", type: "Budget", date: "2025-01-01", url: "test.com" }],
    });

    render(<DocumentsModal onClose={onClose} eventId={mockEventId} />);
    expect(screen.getByText(/Loading documents/i)).toBeInTheDocument();

    await waitFor(() => screen.getByText("Doc1"));
    expect(screen.getByText("Budget")).toBeInTheDocument();
  });

  it("shows empty state when no documents", async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => [] });
    render(<DocumentsModal onClose={onClose} eventId={mockEventId} />);
    await waitFor(() => screen.getByText("No documents found."));
  });

  it("filters documents by name", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => [
        { name: "Budget Plan", type: "Budget", date: "2025-01-01", url: "#" },
        { name: "Agenda Doc", type: "Agenda", date: "2025-01-02", url: "#" },
      ],
    });

    render(<DocumentsModal onClose={onClose} eventId={mockEventId} />);
    await waitFor(() => screen.getByText("Budget Plan"));

    const input = screen.getByPlaceholderText("Search by name...");
    fireEvent.change(input, { target: { value: "Budget" } });

    expect(screen.getByText("Budget Plan")).toBeInTheDocument();
    expect(screen.queryByText("Agenda Doc")).not.toBeInTheDocument();
  });

  it("renders DocumentUpload component", async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => [] });
    render(<DocumentsModal onClose={onClose} eventId={mockEventId} />);
    await waitFor(() => screen.getByTestId("document-upload"));
  });

  it("handles fetch errors gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    fetch.mockRejectedValue(new Error("Failed to fetch"));

    render(<DocumentsModal onClose={onClose} eventId={mockEventId} />);
    await waitFor(() =>
      expect(consoleSpy).toHaveBeenCalledWith("Failed to fetch documents:", expect.any(Error))
    );

    consoleSpy.mockRestore();
  });
});
