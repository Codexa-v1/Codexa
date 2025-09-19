import React, { useState } from "react";

export default function DocumentUpload({ userId, eventId }) {
  const [docType, setDocType] = useState("Other");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file || !userId || !eventId) return alert("Missing info");

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
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
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h4 className="font-bold mb-2">Upload a Document</h4>
      <select
        value={docType}
        onChange={(e) => setDocType(e.target.value)}
        className="border rounded p-2 mr-2"
      >
        <option value="FloorPlan">Floor Plan</option>
        <option value="Agenda">Agenda</option>
        <option value="Budget">Budget</option>
        <option value="VendorContract">Vendor Contract</option>
        <option value="Photos">Photos</option>
        <option value="Other">Other</option>
      </select>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-2"
      />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
