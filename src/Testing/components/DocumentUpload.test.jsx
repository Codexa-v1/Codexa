import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import DocumentUpload from "@/components/DocumentUpload";
import { vi } from "vitest";

describe("DocumentUpload", () => {
  const userId = "user123";
  const eventId = "event456";
  const onUploadSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("renders all form elements", () => {
    render(<DocumentUpload userId={userId} eventId={eventId} />);
    expect(screen.getByText(/Upload New Document/i)).toBeInTheDocument();
    expect(screen.getByText(/Document Type/i)).toBeInTheDocument();
    expect(screen.getByText(/Select File/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload Document/i)).toBeInTheDocument();
  });

  it("shows file name after selecting a file", () => {
    render(<DocumentUpload userId={userId} eventId={eventId} />);
    const input = screen.getByText(/Select File/i).parentNode.querySelector("input[type='file']");
    const file = new File(["hello"], "testfile.txt", { type: "text/plain" });

    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByText("testfile.txt")).toBeInTheDocument();
  });

  it("removes file when remove button is clicked", () => {
    render(<DocumentUpload userId={userId} eventId={eventId} />);
    const input = screen.getByText(/Select File/i).parentNode.querySelector("input[type='file']");
    const file = new File(["hello"], "testfile.txt", { type: "text/plain" });

    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByText("testfile.txt")).toBeInTheDocument();

    fireEvent.click(screen.getByTitle("Remove file"));
    expect(screen.queryByText("testfile.txt")).not.toBeInTheDocument();
  });

  it("shows error if upload is clicked with no file", async () => {
    render(<DocumentUpload userId={userId} eventId={eventId} />);
    fireEvent.click(screen.getByRole("button", { name: /Upload Document/i }));
    expect(await screen.findByText(/Please select a file to upload/i)).toBeInTheDocument();
  });

  it("shows success message after successful upload", async () => {
    global.fetch.mockResolvedValueOnce({ ok: true });
    render(<DocumentUpload userId={userId} eventId={eventId} onUploadSuccess={onUploadSuccess} />);
    const input = screen.getByText(/Select File/i).parentNode.querySelector("input[type='file']");
    const file = new File(["hello"], "testfile.txt", { type: "text/plain" });

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole("button", { name: /Upload Document/i }));

    expect(global.fetch).toHaveBeenCalled();
    expect(await screen.findByText(/Document uploaded successfully!/i)).toBeInTheDocument();
    await waitFor(() => expect(onUploadSuccess).toHaveBeenCalled());
    await waitFor(() => {
      expect(screen.queryByText(/Document uploaded successfully!/i)).not.toBeInTheDocument();
    }, { timeout: 4000 });
  });

  it("shows error message if upload fails", async () => {
    global.fetch.mockResolvedValueOnce({ ok: false });
    render(<DocumentUpload userId={userId} eventId={eventId} />);
    const input = screen.getByText(/Select File/i).parentNode.querySelector("input[type='file']");
    const file = new File(["hello"], "testfile.txt", { type: "text/plain" });

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole("button", { name: /Upload Document/i }));

    expect(await screen.findByText(/Failed to upload document/i)).toBeInTheDocument();
  });

  it("shows error message if fetch throws", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));
    render(<DocumentUpload userId={userId} eventId={eventId} />);
    const input = screen.getByText(/Select File/i).parentNode.querySelector("input[type='file']");
    const file = new File(["hello"], "testfile.txt", { type: "text/plain" });

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole("button", { name: /Upload Document/i }));

    expect(await screen.findByText(/Failed to upload document/i)).toBeInTheDocument();
  });

  it("disables upload button when uploading", async () => {
    let resolveFetch;
    global.fetch.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );
    render(<DocumentUpload userId={userId} eventId={eventId} />);
    // Find the file input directly
    const input = screen.getByText(/Select File/i).parentNode.querySelector("input[type='file']");
    const file = new File(["hello"], "testfile.txt", { type: "text/plain" });

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole("button", { name: /Upload Document/i }));

    expect(screen.getByRole("button", { name: /Uploading.../i })).toBeDisabled();

    // Finish upload
    await act(async () => {
      resolveFetch({ ok: true });
    });
  });

  it("changes document type", () => {
    render(<DocumentUpload userId={userId} eventId={eventId} />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "Budget" } });
    expect(select.value).toBe("Budget");
  });
});
