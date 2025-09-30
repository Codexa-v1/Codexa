import request from "supertest";
import express from "express";
import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock Azure Storage Blob
const mockGenerateBlobSASQueryParameters = vi.fn();
const mockGetContainerClient = vi.fn();
const mockContainerSASPermissions = { parse: vi.fn() };

vi.mock("@azure/storage-blob", () => ({
  BlobServiceClient: vi.fn().mockImplementation(() => ({
    getContainerClient: mockGetContainerClient,
  })),
  StorageSharedKeyCredential: vi.fn(),
  generateBlobSASQueryParameters: mockGenerateBlobSASQueryParameters,
  ContainerSASPermissions: mockContainerSASPermissions,
}));

describe("Azure SAS Router", () => {
  let app;

  beforeEach(async () => {
    vi.clearAllMocks();

    mockContainerSASPermissions.parse.mockReturnValue("rwl");
    mockGenerateBlobSASQueryParameters.mockReturnValue({
      toString: () =>
        "sv=2021-01-01&st=2025-01-01T00:00:00Z&se=2025-01-01T00:30:00Z&sr=c&sp=rwl&sig=mocksignature",
    });
    mockGetContainerClient.mockReturnValue({
      url: "https://teststorageaccount.blob.core.windows.net/files",
    });

    app = express();
    app.use(express.json());

    // ✅ Attach the actual router file here
    // Make sure your router exports an Express Router, e.g.:
    // module.exports = router;
    const azureSASRouter = await import("../../backend/routes/AzureRoutes.js");
    app.use("/api/azure", azureSASRouter.default || azureSASRouter);
  });

  describe("GET /get-sas", () => {
    it("should return SAS URL successfully", async () => {
      const response = await request(app)
        .get("/api/azure/get-sas")
        .expect(200);

      expect(response.body).toHaveProperty("sasUrl");
      expect(response.body.sasUrl).toContain(
        "https://teststorageaccount.blob.core.windows.net/files"
      );
      expect(response.body.sasUrl).toContain("sv=");
      expect(response.body.sasUrl).toContain("sig=");
    });

    it("should create StorageSharedKeyCredential with correct credentials", async () => {
      const { StorageSharedKeyCredential } = await import("@azure/storage-blob");
      await request(app).get("/api/azure/get-sas");
      expect(StorageSharedKeyCredential).toHaveBeenCalledWith(
        "teststorageaccount",
        "testkey123=="
      );
    });

    it("should get container client for files container", async () => {
      await request(app).get("/api/azure/get-sas");
      expect(mockGetContainerClient).toHaveBeenCalledWith("files");
    });

    it("should parse container permissions as rwl", async () => {
      await request(app).get("/api/azure/get-sas");
      expect(mockContainerSASPermissions.parse).toHaveBeenCalledWith("rwl");
    });

    it("should generate SAS token with correct parameters", async () => {
      await request(app).get("/api/azure/get-sas");
      const callArgs = mockGenerateBlobSASQueryParameters.mock.calls[0][0];
      expect(callArgs).toMatchObject({
        containerName: "files",
        permissions: "rwl",
      });
      expect(callArgs.expiresOn).toBeInstanceOf(Date);
    });

    it("should set expiry to 30 minutes from now", async () => {
      const now = new Date();
      await request(app).get("/api/azure/get-sas");
      const expiryDate = mockGenerateBlobSASQueryParameters.mock.calls[0][0].expiresOn;
      const diff = Math.abs(expiryDate - new Date(now.getTime() + 30 * 60 * 1000));
      expect(diff).toBeLessThan(1000 * 60); // within 1 minute
    });

    it("should return SAS URL with query parameters", async () => {
      const response = await request(app).get("/api/azure/get-sas");
      expect(response.body.sasUrl).toContain("?");
      expect(response.body.sasUrl).toContain("sv=");
      expect(response.body.sasUrl).toContain("sp=");
      expect(response.body.sasUrl).toContain("sig=");
    });
  });

  describe("Error Handling", () => {
    it("should return 500 on error", async () => {
      mockGenerateBlobSASQueryParameters.mockImplementationOnce(() => {
        throw new Error("Test error");
      });

      const response = await request(app).get("/api/azure/get-sas").expect(500);
      expect(response.body).toHaveProperty("error", "Test error");
    });

    it("should log error message to console", async () => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
      mockGenerateBlobSASQueryParameters.mockImplementationOnce(() => {
        throw new Error("Test error");
      });

      await request(app).get("/api/azure/get-sas").expect(500);
      expect(consoleError).toHaveBeenCalledWith("SAS generation failed:", "Test error");
      consoleError.mockRestore();
    });
  });

  describe("Response Format", () => {
    it("should return JSON response", async () => {
      await request(app)
        .get("/api/azure/get-sas")
        .expect("Content-Type", /json/);
    });

    it("should have sasUrl property in response", async () => {
      const response = await request(app).get("/api/azure/get-sas");
      expect(response.body).toHaveProperty("sasUrl");
    });
  });
});
