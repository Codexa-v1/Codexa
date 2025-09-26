import React, { useState } from "react";

export default function FloorPlanUpload({ userId, eventId, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const docType = "FloorPlan"; // fixed type

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileName(selectedFile.name.replace(/\.[^/.]+$/, "")); // remove extension
    setError("");
  };

  // Remove file
  const handleRemoveFile = () => {
    setFile(null);
    setFileName("");
    setError("");
  };

  // Validate filename
  const validateFileName = (name) => {
    if (!name.trim()) return "File name cannot be empty.";
    if (/[<>:"/\\|?*]/.test(name)) return "File name contains invalid characters.";
    return "";
  };

  // Handle upload
  const handleUpload = async () => {
    if (!file || !userId || !eventId) {
      setError("Missing required information.");
      return;
    }

    const validationError = validateFileName(fileName);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    setError("");

    const extension = file.name.includes(".")
      ? file.name.substring(file.name.lastIndexOf("."))
      : "";

    // Rename file if user changed filename
    const uploadFile =
      fileName.trim() && fileName.trim() !== file.name.replace(extension, "")
        ? new File([file], `${fileName.trim()}${extension}`, { type: file.type })
        : file;

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("userId", userId);
    formData.append("eventId", eventId);
    formData.append("docType", docType);

    try {
      const res = await fetch(
        "https://planit-backend-amfkhqcgbvfhamhx.canadacentral-01.azurewebsites.net/api/azure/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      alert("Upload successful!");

      // Reset inputs
      handleRemoveFile();

      // Refresh floor plans in modal
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h4 className="text-lg font-semibold mb-2">Upload Floor Plan</h4>

      {/* File input */}
      <label className="block mb-2 font-medium text-sm">
        Choose File
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full mt-1"
        />
      </label>

      {/* Optional file name override */}
      {file && (
        <div className="mb-2">
          <label className="block font-medium text-sm">
            File Name (optional)
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="block w-full border rounded p-2 mt-1"
            />
          </label>

          {/* Remove file button */}
          <button
            type="button"
            onClick={handleRemoveFile}
            className="mt-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Remove File
          </button>
        </div>
      )}

      {/* Error message */}
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className={`px-4 py-2 rounded-lg text-white ${
          uploading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
