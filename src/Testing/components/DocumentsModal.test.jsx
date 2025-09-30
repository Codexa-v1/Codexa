// src/Testing/DocumentsModal.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DocumentsModal from "../../components/DocumentsModal.jsx";

// Mock DocumentUpload so we don't test it here
vi.mock("../components/DocumentUpload", () => ({
  default: () => <div data-testid="document-upload" />,
}));

describe("DocumentsModal", () => {
  it("renders modal title", () => {
    render(<DocumentsModal documents={[]} onClose={vi.fn()} />);
    expect(screen.getByText("Your Documents")).toBeInTheDocument();
  });

  it("renders loading message when no documents are provided", () => {
    render(<DocumentsModal documents={[]} onClose={vi.fn()} />);
    expect(screen.getByText("Loading documents...")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    render(<DocumentsModal documents={[]} onClose={handleClose} />);
    const closeButton = screen.getByRole("button", { name: /×/ });
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("renders the document upload area", () => {
    render(<DocumentsModal documents={[]} onClose={vi.fn()} />);
    expect(screen.getByText("Upload Document")).toBeInTheDocument();
    expect(screen.getByLabelText(/Choose File/i)).toBeInTheDocument();
  });
});
