// src/Testing/DocumentsModal.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DocumentsModal from "../../components/DocumentsModal.jsx";

// Mock DocumentUpload so we don't test it here
vi.mock("../components/DocumentUpload", () => ({
  default: () => <div data-testid="document-upload" />,
}));

describe("DocumentsModal", () => {
  const mockDocuments = [
    {
      name: "Event Schedule",
      size: "1.2MB",
      date: "2025-08-27",
      type: "PDF",
      url: "https://example.com/schedule.pdf",
    },
    {
      name: "Guest List",
      size: "800KB",
      date: "2025-08-25",
      type: "Excel",
      url: "https://example.com/guests.xlsx",
    },
  ];

  it("renders modal title", () => {
    render(<DocumentsModal documents={mockDocuments} onClose={vi.fn()} />);
    expect(screen.getByText("Event Documents")).toBeInTheDocument();
  });

  it("renders documents when provided", () => {
  render(<DocumentsModal documents={mockDocuments} onClose={vi.fn()} />);

  mockDocuments.forEach((doc, idx) => {
    // Check text content
    expect(screen.getByText(doc.name)).toBeInTheDocument();
    expect(screen.getByText(`Size: ${doc.size}`)).toBeInTheDocument();
    expect(screen.getByText(`Date: ${doc.date}`)).toBeInTheDocument();
    expect(screen.getByText(`Type: ${doc.type}`)).toBeInTheDocument();
  });

  // Check links
  const links = screen.getAllByRole("link");
  links.forEach((link, idx) => {
    expect(link).toHaveAttribute("href", mockDocuments[idx].url);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});


  it("renders message when no documents are provided", () => {
    render(<DocumentsModal documents={[]} onClose={vi.fn()} />);
    expect(
      screen.getByText("No documents available for this event.")
    ).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onCloseMock = vi.fn();
    render(<DocumentsModal documents={mockDocuments} onClose={onCloseMock} />);
    const closeButton = screen.getByText("×");
    fireEvent.click(closeButton);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("renders the DocumentUpload component", () => {
    render(<DocumentsModal documents={mockDocuments} onClose={vi.fn()} />);
    expect(screen.getByTestId("document-upload")).toBeInTheDocument();
  });
});
