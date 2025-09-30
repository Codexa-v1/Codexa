import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, beforeEach, afterEach, expect } from "vitest";
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
global.confirm = vi.fn();

describe("DocumentsModal", () => {
  const mockUser = { sub: "user-123" };
  const mockEventId = "event-456";
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth0.mockReturnValue({ user: mockUser, isAuthenticated: true });
  });

  it("renders modal and close button", () => {
    render(<DocumentsModal onClose={onClose} eventId={mockEventId} />);
    expect(screen.getByText("Your Documents")).toBeInTheDocument();
    fireEvent.click(screen.getByText("×"));
    expect(onClose).toHaveBeenCalled();
  });

  it("fetches documents on mount and displays loading", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ name: "Doc1", type: "FloorPlan", date: "2025-01-01", url: "url1" }],
    });

    render(<DocumentsModal onClose={onClose} eventId={mockEventId} />);
    expect(screen.getByText("Loading documents...")).toBeInTheDocument();

    await waitFor(() => screen.getByText("Doc1"));
    expect(screen.getByText("FloorPlan")).toBeInTheDocument();
    expect(screen.getByText("Download")).toBeInTheDocument();
  });

  it("renders empty state if no documents", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
    render(<DocumentsModal onClose={onClose} eventId={mockEventId} />);
    await waitFor(() => screen.getByText("No documents found."));
  });

  it("filters documents by search term", async () => {
    const docs = [
      { name: "Budget1", type: "Budget", date: "2025-01-01", url: "url1" },
      { name: "Agenda1", type: "Agenda", date: "2025-01-02", url: "url2" },
    ];
    fetch.mockResolvedValue({ ok: true, json: async () => docs });

    render(<DocumentsModal onClose={onClose} eventId={mockEventId} />);
    await waitFor(() => screen.getByText("Budget1"));

    const searchInput = screen.getByPlaceholderText("Search by name...");
    fireEvent.change(searchInput, { target: { value: "Budget" } });

    expect(screen.getByText("Budget1")).toBeInTheDocument();
    expect(screen.queryByText("Agenda1")).not.toBeInTheDocument();
  });

  it("filters by type", async () => {
    const docs = [
      { name: "Budget1", type: "Budget", date: "2025-01-01", url: "url1" },
      { name: "Agenda1", type: "Agenda", date: "2025-01-02", url: "url2" },
    ];
    fetch.mockResolvedValue({ ok: true, json: async () => docs });

    render(<DocumentsModal onClose={onClose} eventId={mockEventId} />);
    await waitFor(() => screen.getByText("Budget1"));

    fireEvent.change(screen.getByDisplayValue("All Types"), { target: { value: "Agenda" } });
    expect(screen.getByText("Agenda1")).toBeInTheDocument();
    expect(screen.queryByText("Budget1")).not.toBeInTheDocument();
  });

  it("sorts documents correctly", async () => {
    const docs = [
      { name: "BDoc", type: "Budget", date: "2025-01-01", url: "url1" },
      { name: "ADoc", type: "Agenda", date: "2025-01-02", url: "url2" },
    ];
    fetch.mockResolvedValue({ ok: true, json: async () => docs });

    render(<DocumentsModal onClose={onClose} eventId={mockEventId} />);
    await waitFor(() => screen.getByText("BDoc"));

    fireEvent.change(screen.getByDisplayValue("Newest First"), { target: { value: "name-asc" } });

    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("ADoc");
    expect(rows[2]).toHaveTextContent("BDoc");
  });

  it("deletes a document after confirmation", async () => {
    const doc = { name: "Budget1", type: "Budget", date: "2025-01-01", url: "url1" };
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [doc] }); // initial fetch
    fetch.mockResolvedValueOnce({ ok: true }); // delete
    global.confirm.mockReturnValueOnce(true);

    render(<DocumentsModal onClose={onClose} eventId={mockEventId} />);
    await waitFor(() => screen.getByText("Budget1"));

    fireEvent.click(screen.getByText("Delete"));
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("delete-user-document"),
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("does not delete if confirm is cancelled", async () => {
    const doc = { name: "Budget1", type: "Budget", date: "2025-01-01", url: "url1" };
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [doc] });
    global.confirm.mockReturnValueOnce(false);

    render(<DocumentsModal onClose={onClose} eventId={mockEventId} />);
    await waitFor(() => screen.getByText("Budget1"));

    fireEvent.click(screen.getByText("Delete"));
    expect(fetch).toHaveBeenCalledTimes(1); // only initial fetch
  });

  it("renders DocumentUpload component", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
    render(<DocumentsModal onClose={onClose} eventId={mockEventId} />);
    await waitFor(() => screen.getByTestId("document-upload"));
  });

  it("handles fetch errors gracefully", async () => {
    fetch.mockRejectedValueOnce(new Error("Failed to fetch"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<DocumentsModal onClose={onClose} eventId={mockEventId} />);
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Failed to fetch documents:", expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});
