import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import FloorPlanUpload from "../../components/FloorPlanUpload";

// Mock fetch globally
global.fetch = vi.fn();

// Mock alert
global.alert = vi.fn();

describe("FloorPlanUpload Component", () => {
  const mockProps = {
    userId: "user123",
    eventId: "event456",
    onUploadSuccess: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial Render", () => {
    it("should render the component with all initial elements", () => {
      render(<FloorPlanUpload {...mockProps} />);

      expect(screen.getByText("Upload Floor Plan")).toBeInTheDocument();
      expect(screen.getByLabelText(/Choose File/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Upload/i })).toBeInTheDocument();
    });

    it("should have upload button disabled initially", () => {
      render(<FloorPlanUpload {...mockProps} />);

      const uploadButton = screen.getByRole("button", { name: /Upload/i });
      expect(uploadButton).toBeDisabled();
    });

    it("should not show file name input initially", () => {
      render(<FloorPlanUpload {...mockProps} />);

      expect(screen.queryByLabelText(/File Name \(optional\)/i)).not.toBeInTheDocument();
    });
  });

  describe("File Selection", () => {
    it("should display file name input after selecting a file", () => {
      render(<FloorPlanUpload {...mockProps} />);

      const file = new File(["dummy content"], "floor-plan.pdf", {
        type: "application/pdf",
      });
      const fileInput = screen.getByLabelText(/Choose File/i);

      fireEvent.change(fileInput, { target: { files: [file] } });

      expect(screen.getByLabelText(/File Name \(optional\)/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue("floor-plan")).toBeInTheDocument();
    });

    it("should remove file extension from filename", () => {
      render(<FloorPlanUpload {...mockProps} />);

      const file = new File(["content"], "my-floor-plan.png", {
        type: "image/png",
      });
      const fileInput = screen.getByLabelText(/Choose File/i);

      fireEvent.change(fileInput, { target: { files: [file] } });

      expect(screen.getByDisplayValue("my-floor-plan")).toBeInTheDocument();
    });

    it("should enable upload button after file selection", () => {
      render(<FloorPlanUpload {...mockProps} />);

      const file = new File(["content"], "test.pdf", { type: "application/pdf" });
      const fileInput = screen.getByLabelText(/Choose File/i);

      fireEvent.change(fileInput, { target: { files: [file] } });

      const uploadButton = screen.getByRole("button", { name: /Upload/i });
      expect(uploadButton).not.toBeDisabled();
    });

    it("should show remove file button after selection", () => {
      render(<FloorPlanUpload {...mockProps} />);

      const file = new File(["content"], "test.pdf", { type: "application/pdf" });
      const fileInput = screen.getByLabelText(/Choose File/i);

      fireEvent.change(fileInput, { target: { files: [file] } });

      expect(screen.getByRole("button", { name: /Remove File/i })).toBeInTheDocument();
    });
  });

  describe("File Name Modification", () => {
    it("should allow user to modify filename", async () => {
      const user = userEvent.setup();
      render(<FloorPlanUpload {...mockProps} />);

      const file = new File(["content"], "original.pdf", {
        type: "application/pdf",
      });
      const fileInput = screen.getByLabelText(/Choose File/i);

      fireEvent.change(fileInput, { target: { files: [file] } });

      const nameInput = screen.getByLabelText(/File Name \(optional\)/i);
      await user.clear(nameInput);
      await user.type(nameInput, "modified-name");

      expect(screen.getByDisplayValue("modified-name")).toBeInTheDocument();
    });
  });

  describe("Remove File Functionality", () => {
    it("should remove file and reset state when remove button clicked", () => {
      render(<FloorPlanUpload {...mockProps} />);

      const file = new File(["content"], "test.pdf", { type: "application/pdf" });
      const fileInput = screen.getByLabelText(/Choose File/i);

      fireEvent.change(fileInput, { target: { files: [file] } });
      expect(screen.getByDisplayValue("test")).toBeInTheDocument();

      const removeButton = screen.getByRole("button", { name: /Remove File/i });
      fireEvent.click(removeButton);

      expect(screen.queryByLabelText(/File Name \(optional\)/i)).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /Remove File/i })).not.toBeInTheDocument();
    });

    it("should disable upload button after removing file", () => {
      render(<FloorPlanUpload {...mockProps} />);

      const file = new File(["content"], "test.pdf", { type: "application/pdf" });
      const fileInput = screen.getByLabelText(/Choose File/i);

      fireEvent.change(fileInput, { target: { files: [file] } });

      const removeButton = screen.getByRole("button", { name: /Remove File/i });
      fireEvent.click(removeButton);

      const uploadButton = screen.getByRole("button", { name: /Upload/i });
      expect(uploadButton).toBeDisabled();
    });

    it("should clear error message when removing file", () => {
      render(<FloorPlanUpload {...mockProps} />);

      const file = new File(["content"], "test.pdf", { type: "application/pdf" });
      const fileInput = screen.getByLabelText(/Choose File/i);

      fireEvent.change(fileInput, { target: { files: [file] } });

      // Trigger error by trying to upload with empty filename
      const nameInput = screen.getByLabelText(/File Name \(optional\)/i);
      fireEvent.change(nameInput, { target: { value: "" } });

      const uploadButton = screen.getByRole("button", { name: /Upload/i });
      fireEvent.click(uploadButton);

      expect(screen.getByText(/File name cannot be empty/i)).toBeInTheDocument();

      const removeButton = screen.getByRole("button", { name: /Remove File/i });
      fireEvent.click(removeButton);

      expect(screen.queryByText(/File name cannot be empty/i)).not.toBeInTheDocument();
    });
  });

  describe("File Name Validation", () => {
    it("should show error for empty filename", () => {
      render(<FloorPlanUpload {...mockProps} />);

      const file = new File(["content"], "test.pdf", { type: "application/pdf" });
      const fileInput = screen.getByLabelText(/Choose File/i);

      fireEvent.change(fileInput, { target: { files: [file] } });

      const nameInput = screen.getByLabelText(/File Name \(optional\)/i);
      fireEvent.change(nameInput, { target: { value: "   " } });

      const uploadButton = screen.getByRole("button", { name: /Upload/i });
      fireEvent.click(uploadButton);

      expect(screen.getByText(/File name cannot be empty/i)).toBeInTheDocument();
    });

    it.each([
      ["<", "less than sign"],
      [">", "greater than sign"],
      [":", "colon"],
      ['"', "quote"],
      ["/", "forward slash"],
      ["\\", "backslash"],
      ["|", "pipe"],
      ["?", "question mark"],
      ["*", "asterisk"],
    ])("should show error for invalid character %s", (char, description) => {
      render(<FloorPlanUpload {...mockProps} />);

      const file = new File(["content"], "test.pdf", { type: "application/pdf" });
      const fileInput = screen.getByLabelText(/Choose File/i);

      fireEvent.change(fileInput, { target: { files: [file] } });

      const nameInput = screen.getByLabelText(/File Name \(optional\)/i);
      fireEvent.change(nameInput, { target: { value: `invalid${char}name` } });

      const uploadButton = screen.getByRole("button", { name: /Upload/i });
      fireEvent.click(uploadButton);

      expect(screen.getByText(/File name contains invalid characters/i)).toBeInTheDocument();
    });

    it("should accept valid filename", () => {
      render(<FloorPlanUpload {...mockProps} />);

      const file = new File(["content"], "test.pdf", { type: "application/pdf" });
      const fileInput = screen.getByLabelText(/Choose File/i);

      fireEvent.change(fileInput, { target: { files: [file] } });

      const nameInput = screen.getByLabelText(/File Name \(optional\)/i);
      fireEvent.change(nameInput, { target: { value: "valid-file-name_123" } });

      const uploadButton = screen.getByRole("button", { name: /Upload/i });
      fireEvent.click(uploadButton);

      expect(screen.queryByText(/File name cannot be empty/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/File name contains invalid characters/i)).not.toBeInTheDocument();
    });
  });

  describe("Upload Functionality", () => {
    it("should call fetch with correct parameters on successful upload", async () => {
      fetch.mockResolvedValueOnce({ ok: true });

      render(<FloorPlanUpload {...mockProps} />);

      const file = new File(["content"], "test.pdf", { type: "application/pdf" });
      const fileInput = screen.getByLabelText(/Choose File/i);

      fireEvent.change(fileInput, { target: { files: [file] } });

      const uploadButton = screen.getByRole("button", { name: /Upload/i });
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          "https://planit-backend-amfkhqcgbvfhamhx.canadacentral-01.azurewebsites.net/api/azure/upload",
          expect.objectContaining({
            method: "POST",
            body: expect.any(FormData),
          })
        );
      });
    });

    it("should include userId, eventId, and docType in FormData", async () => {
      fetch.mockResolvedValueOnce({ ok: true });

      render(<FloorPlanUpload {...mockProps} />);

      const file = new File(["content"], "test.pdf", { type: "application/pdf" });
      const fileInput = screen.getByLabelText(/Choose File/i);

      fireEvent.change(fileInput, { target: { files: [file] } });

      const uploadButton = screen.getByRole("button", { name: /Upload/i });
      fireEvent.click(uploadButton);

      await waitFor(() => {
        const formData = fetch.mock.calls[0][1].body;
        expect(formData.get("userId")).toBe("user123");
        expect(formData.get("eventId")).toBe("event456");
        expect(formData.get("docType")).toBe("FloorPlan");
      });
    });

    it("should upload file with modified name", async () => {
      fetch.mockResolvedValueOnce({ ok: true });

      render(<FloorPlanUpload {...mockProps} />);

      const file = new File(["content"], "original.pdf", {
        type: "application/pdf",
      });
      const fileInput = screen.getByLabelText(/Choose File/i);

      fireEvent.change(fileInput, { target: { files: [file] } });

      const nameInput = screen.getByLabelText(/File Name \(optional\)/i);
      fireEvent.change(nameInput, { target: { value: "modified" } });

      const uploadButton = screen.getByRole("button", { name: /Upload/i });
      fireEvent.click(uploadButton);

      await waitFor(() => {
        const formData = fetch.mock.calls[0][1].body;
        const uploadedFile = formData.get("file");
        expect(uploadedFile.name).toBe("modified.pdf");
      });
    });

    it("should preserve file extension when renaming", async () => {
      fetch.mockResolvedValueOnce({ ok: true });

      render(<FloorPlanUpload {...mockProps} />);

      const file = new File(["content"], "original.png", { type: "image/png" });
      const fileInput = screen.getByLabelText(/Choose File/i);

      fireEvent.change(fileInput, { target: { files: [file] } });

      const nameInput = screen.getByLabelText(/File Name \(optional\)/i);
      fireEvent.change(nameInput, { target: { value: "newname" } });

      const uploadButton = screen.getByRole("button", { name: /Upload/i });
      fireEvent.click(uploadButton);

      await waitFor(() => {
        const formData = fetch.mock.calls[0][1].body;
        const uploadedFile = formData.get("file");
        expect(uploadedFile.name).toBe("newname.png");
      });
    });

    it("should show success alert and reset form on successful upload", async () => {
      fetch.mockResolvedValueOnce({ ok: true });

      render(<FloorPlanUpload {...mockProps} />);

      const file = new File(["content"], "test.pdf", { type: "application/pdf" });
      const fileInput = screen.getByLabelText(/Choose File/i);

      fireEvent.change(fileInput, { target: { files: [file] } });

      const uploadButton = screen.getByRole("button", { name: /Upload/i });
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(alert).toHaveBeenCalledWith("Upload successful!");
      });

      expect(screen.queryByLabelText(/File Name \(optional\)/i)).not.toBeInTheDocument();
    });

    it("should call onUploadSuccess callback after successful upload", async () => {
      fetch.mockResolvedValueOnce({ ok: true });

      render(<FloorPlanUpload {...mockProps} />);

      const file = new File(["content"], "test.pdf", { type: "application/pdf" });
      const fileInput = screen.getByLabelText(/Choose File/i);

      fireEvent.change(fileInput, { target: { files: [file] } });

      const uploadButton = screen.getByRole("button", { name: /Upload/i });
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(mockProps.onUploadSuccess).toHaveBeenCalled();
      });
    });

    it("should disable button and show uploading text during upload", async () => {
      fetch.mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 100))
      );

      render(<FloorPlanUpload {...mockProps} />);

      const file = new File(["content"], "test.pdf", { type: "application/pdf" });
      const fileInput = screen.getByLabelText(/Choose File/i);

      fireEvent.change(fileInput, { target: { files: [file] } });

      const uploadButton = screen.getByRole("button", { name: /Upload/i });
      fireEvent.click(uploadButton);

      expect(screen.getByRole("button", { name: /Uploading\.\.\./i })).toBeDisabled();

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Upload/i })).toBeInTheDocument();
      });
    });

    it("should show error message on upload failure", async () => {
      fetch.mockResolvedValueOnce({ ok: false });

      render(<FloorPlanUpload {...mockProps} />);

      const file = new File(["content"], "test.pdf", { type: "application/pdf" });
      const fileInput = screen.getByLabelText(/Choose File/i);

      fireEvent.change(fileInput, { target: { files: [file] } });

      const uploadButton = screen.getByRole("button", { name: /Upload/i });
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(screen.getByText(/Failed to upload file\. Please try again\./i)).toBeInTheDocument();
      });
    });

    it("should show error message on network error", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      render(<FloorPlanUpload {...mockProps} />);

      const file = new File(["content"], "test.pdf", { type: "application/pdf" });
      const fileInput = screen.getByLabelText(/Choose File/i);

      fireEvent.change(fileInput, { target: { files: [file] } });

      const uploadButton = screen.getByRole("button", { name: /Upload/i });
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(screen.getByText(/Failed to upload file\. Please try again\./i)).toBeInTheDocument();
      });
    });

    it("should show error when userId is missing", () => {
      render(<FloorPlanUpload {...mockProps} userId={null} />);

      const file = new File(["content"], "test.pdf", { type: "application/pdf" });
      const fileInput = screen.getByLabelText(/Choose File/i);

      fireEvent.change(fileInput, { target: { files: [file] } });

      const uploadButton = screen.getByRole("button", { name: /Upload/i });
      fireEvent.click(uploadButton);

      expect(screen.getByText(/Missing required information/i)).toBeInTheDocument();
      expect(fetch).not.toHaveBeenCalled();
    });

    it("should show error when eventId is missing", () => {
      render(<FloorPlanUpload {...mockProps} eventId={null} />);

      const file = new File(["content"], "test.pdf", { type: "application/pdf" });
      const fileInput = screen.getByLabelText(/Choose File/i);

      fireEvent.change(fileInput, { target: { files: [file] } });

      const uploadButton = screen.getByRole("button", { name: /Upload/i });
      fireEvent.click(uploadButton);

      expect(screen.getByText(/Missing required information/i)).toBeInTheDocument();
      expect(fetch).not.toHaveBeenCalled();
    });

    it("should handle file without extension", async () => {
      fetch.mockResolvedValueOnce({ ok: true });

      render(<FloorPlanUpload {...mockProps} />);

      const file = new File(["content"], "filenoext", { type: "application/pdf" });
      const fileInput = screen.getByLabelText(/Choose File/i);

      fireEvent.change(fileInput, { target: { files: [file] } });

      const uploadButton = screen.getByRole("button", { name: /Upload/i });
      fireEvent.click(uploadButton);

      await waitFor(() => {
        const formData = fetch.mock.calls[0][1].body;
        const uploadedFile = formData.get("file");
        expect(uploadedFile.name).toBe("filenoext");
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle onUploadSuccess being undefined", async () => {
      fetch.mockResolvedValueOnce({ ok: true });

      render(<FloorPlanUpload userId="user123" eventId="event456" />);

      const file = new File(["content"], "test.pdf", { type: "application/pdf" });
      const fileInput = screen.getByLabelText(/Choose File/i);

      fireEvent.change(fileInput, { target: { files: [file] } });

      const uploadButton = screen.getByRole("button", { name: /Upload/i });
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(alert).toHaveBeenCalledWith("Upload successful!");
      });
    });

    it("should trim whitespace from filename", async () => {
      fetch.mockResolvedValueOnce({ ok: true });

      render(<FloorPlanUpload {...mockProps} />);

      const file = new File(["content"], "test.pdf", { type: "application/pdf" });
      const fileInput = screen.getByLabelText(/Choose File/i);

      fireEvent.change(fileInput, { target: { files: [file] } });

      const nameInput = screen.getByLabelText(/File Name \(optional\)/i);
      fireEvent.change(nameInput, { target: { value: "  trimmed  " } });

      const uploadButton = screen.getByRole("button", { name: /Upload/i });
      fireEvent.click(uploadButton);

      await waitFor(() => {
        const formData = fetch.mock.calls[0][1].body;
        const uploadedFile = formData.get("file");
        expect(uploadedFile.name).toBe("trimmed.pdf");
      });
    });

    it("should not rename file if filename unchanged", async () => {
      fetch.mockResolvedValueOnce({ ok: true });

      render(<FloorPlanUpload {...mockProps} />);

      const file = new File(["content"], "original.pdf", {
        type: "application/pdf",
      });
      const fileInput = screen.getByLabelText(/Choose File/i);

      fireEvent.change(fileInput, { target: { files: [file] } });

      const uploadButton = screen.getByRole("button", { name: /Upload/i });
      fireEvent.click(uploadButton);

      await waitFor(() => {
        const formData = fetch.mock.calls[0][1].body;
        const uploadedFile = formData.get("file");
        expect(uploadedFile.name).toBe("original.pdf");
      });
    });
  });
});