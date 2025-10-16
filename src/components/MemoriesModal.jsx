import React, { useEffect, useState } from "react";
import {
  getPublicResource,
  uploadPictures,
  uploadPDF,
  deletePDF,
  deletePictures,
} from "@/backend/api/EventMemories";
import {
  FiX,
  FiTrash2,
  FiImage,
  FiFileText,
  FiShare2,
  FiDownload,
  FiLoader,
} from "react-icons/fi";

const baseUrl = "https://sdp-project-zilb.onrender.com";

export default function MemoriesModal({ eventId, onClose }) {
  const [pictures, setPictures] = useState([]);
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!eventId) return;
    fetchMemories();
  }, [eventId]);

  const fetchMemories = async () => {
    if (!eventId) return;

    try {
      setLoading(true);
      setError("");

      const res = await getPublicResource(eventId);
      const data = res.data?.data || res.data || {};

      // ensure records is always an array
      const records = Array.isArray(data) ? data : [data];

      // separate pictures and PDFs
      const pictureUrls = records
        .filter(record => record.picture_url)
        .map(record => record.picture_url);

      const pdfFiles = records
        .filter(record => record.file_url)
        .map(record => record.file_url);

      // pick first PDF if exists
      const pdfFile = pdfFiles.length > 0 ? pdfFiles[0] : null;

      setPictures(pictureUrls);
      setPdf(pdfFile);

    } catch (err) {
      console.error(err);
      setError("Failed to fetch memories");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPictures = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    try {
      setUploading(true);
      setError("");
      setSuccess("");
      await uploadPictures(eventId, files);
      setSuccess("Picture uploaded!");
      await fetchMemories(); // reload both pics + pdf
    } catch (err) {
      console.error(err);
      setError("Failed to upload pictures");
    } finally {
      setUploading(false);
    }
  };

  const handleUploadPDF = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      setError("");
      setSuccess("");
      await uploadPDF(eventId, file);
      setSuccess("PDF uploaded!");
      await fetchMemories(); // 🔁 ensures PDF immediately updates
    } catch (err) {
      console.error(err);
      setError("Failed to upload PDF (only one PDF can be uploaded per event");
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePictures = async () => {
    if (!confirm("Delete picture(s)?")) return;
    try {
      setUploading(true);
      await deletePictures(eventId);
      setSuccess("Picture(s) deleted!");
      await fetchMemories();
    } catch (err) {
      console.error(err);
      setError("Failed to delete picture(s)");
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePDF = async () => {
    if (!confirm("Delete PDF?")) return;
    try {
      setUploading(true);
      await deletePDF(eventId);
      setSuccess("PDF deleted!");
      await fetchMemories();
    } catch (err) {
      console.error(err);
      setError("Failed to delete PDF");
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!pdf) return;
    try {
      setUploading(true);
      const res = await fetch(pdf);
      const blob = await res.blob();

      // Ensure MIME type is PDF
      const pdfBlob = new Blob([blob], { type: "application/pdf" });

      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "EventMemories.pdf"; // proper filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setSuccess("PDF downloaded!");
    } catch (err) {
      console.error(err);
      setError("Failed to download PDF.");
    } finally {
      setUploading(false);
    }
  };



  const handleGenerateShareLink = () => {
    const shareUrl = `${window.location.origin}/download?eventId=${eventId}`;
    navigator.clipboard.writeText(shareUrl);
    setSuccess("Share link copied!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col relative">
        
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
          onClick={onClose}
        >
          <FiX className="w-6 h-6" />
        </button>

        {/* Top section: Uploads + status */}
        <div className="px-6 pt-6 pb-4 space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FiImage className="text-lime-500 w-6 h-6" /> Memories
          </h2>

          {/* Status messages */}
          {error && <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>}
          {success && <div className="bg-green-100 text-green-700 p-2 rounded">{success}</div>}

          {/* Upload Inputs */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="block font-semibold mb-1">Upload Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadPictures}
                disabled={uploading}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Upload PDF</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleUploadPDF}
                disabled={uploading}
              />
            </div>
          </div>
        </div>

        {/* Scrollable pictures */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Pictures</h3>
            {loading ? (
              <p>Loading...</p>
            ) : pictures.length ? (
              <div className="grid grid-cols-2 gap-2">
                {pictures.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Event Picture ${i + 1}`}
                    className="w-full h-40 object-cover rounded-lg border"
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No pictures uploaded yet.</p>
            )}

            {/* Delete button */}
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleDeletePictures}
                className="px-3 py-1 bg-red-500 text-white rounded flex items-center gap-1 disabled:opacity-50"
                disabled={uploading || !pictures.length}
              >
                {uploading ? <FiLoader className="animate-spin" /> : <><FiTrash2 /> Delete</>}
              </button>
            </div>
          </div>
        </div>

        {/* Fixed bottom section: PDF + Share */}
        <div className="p-6 border-t bg-white flex flex-col gap-4">
          {/* PDF Section */}
          {pdf ? (
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                <FiFileText className="text-blue-500 w-5 h-5" />
                <span className="truncate max-w-[200px] font-medium">Event Memories PDF</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleDownloadPDF}
                  className="px-3 py-1 bg-green-500 text-white rounded flex items-center gap-1"
                  disabled={uploading}
                >
                  <FiDownload /> Download
                </button>

                <button
                  onClick={handleDeletePDF}
                  className="px-3 py-1 bg-red-500 text-white rounded flex items-center gap-1 disabled:opacity-50"
                  disabled={uploading}
                >
                  {uploading ? <FiLoader className="animate-spin" /> : <><FiTrash2 /> Delete</>}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">No PDF uploaded yet.</p>
          )}

          {/* Share link */}
          <button
            onClick={handleGenerateShareLink}
            disabled={uploading}
            className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2 disabled:opacity-50"
          >
            {uploading ? <FiLoader className="animate-spin" /> : <><FiShare2 /> Generate Share Link</>}
          </button>
        </div>
      </div>
    </div>

  );
}
