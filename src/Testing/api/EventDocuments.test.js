import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { getDocuments } from "../../backend/api/EventDocuments";

vi.mock("axios");

const API_BASE = "http://localhost:3000"; // adjust if needed

describe("getDocuments", () => {
  const userId = "user123";
  const eventId = "event456";

  beforeEach(() => {
    vi.clearAllMocks();
    import.meta.env = { VITE_BACKEND_URL: API_BASE };
  });

  it("should return documents on success", async () => {
    const mockDocs = [
      { name: "file1.pdf", url: "https://blob/file1.pdf" },
      { name: "file2.docx", url: "https://blob/file2.docx" },
    ];
    axios.get.mockResolvedValueOnce({ data: mockDocs });

    const result = await getDocuments(userId, eventId);

    expect(axios.get).toHaveBeenCalledWith(
      `${API_BASE}/api/azure/list-user-documents`,
      { params: { userId, eventId } }
    );
    expect(result).toEqual(mockDocs);
  });

  it("should return empty array if no documents", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    const result = await getDocuments(userId, eventId);

    expect(result).toEqual([]);
  });

  it("should return empty array and log error on failure", async () => {
    const error = new Error("Network error");
    axios.get.mockRejectedValueOnce(error);

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await getDocuments(userId, eventId);

    expect(consoleSpy).toHaveBeenCalledWith("Error fetching documents:", error);
    expect(result).toEqual([]);

    consoleSpy.mockRestore();
  });
});