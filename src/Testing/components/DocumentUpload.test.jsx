/* src/Testing/DocumentUpload.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DocumentUpload from "../../components/DocumentUpload";
import { vi } from "vitest";

describe("DocumentUpload", () => {
  let alertMock;

  beforeEach(() => {
    // Mock alert so it doesn’t actually show in test runner
    alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the upload component", () => {
    render(<DocumentUpload />);
    expect(screen.getByText("Upload Floor Plan")).toBeInTheDocument();
    expect(screen.getByLabelText("Choose File")).toBeInTheDocument();
    expect(screen.getByText("Upload")).toBeInTheDocument();
  });

  it("does not show file name initially", () => {
    render(<DocumentUpload />);
    expect(screen.queryByText(/\.txt|\.pdf|\.png/)).not.toBeInTheDocument();
  });

  it("updates when a file is chosen", () => {
    render(<DocumentUpload />);

    const file = new File(["hello"], "testfile.txt", { type: "text/plain" });
    const input = screen.getByLabelText("Choose File", { selector: "input" });

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText("testfile.txt")).toBeInTheDocument();
  });

  it("does nothing when upload clicked with no file", () => {
    render(<DocumentUpload />);
    fireEvent.click(screen.getByText("Upload"));
    expect(alertMock).not.toHaveBeenCalled();
  });

  it("shows alert when file is uploaded", () => {
    render(<DocumentUpload />);
    const file = new File(["hello"], "testfile.txt", { type: "text/plain" });
    const input = screen.getByLabelText("Choose File", { selector: "input" });

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByText("Upload"));

    expect(alertMock).toHaveBeenCalledWith("Uploaded!");
  });
}); */
