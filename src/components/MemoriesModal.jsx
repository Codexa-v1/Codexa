import React, { useEffect, useState } from "react";
import {
  getPublicResource,
  uploadPictures,
  uploadPDF,
  deletePDF,
  deletePictures,
} from "@/backend/api/EventMemories";
import { FiX, FiUpload, FiTrash2, FiImage, FiFileText, FiShare2, FiDownload } from "react-icons/fi";

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
    try {
      setLoading(true);
      setError("");
      const res = await getPublicResource(eventId);
      // Handle nested data structure
      const data = res.data?.data || res.data || {};
      setPictures(data.picture_url ? [data.picture_url] : []);
      setPdf(data.file_url || null);
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
      await fetchMemories();
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
      await fetchMemories();
    } catch (err) {
      console.error(err);
      setError("Failed to upload PDF");
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePictures = async () => {
    if (!confirm("Delete picture?")) return;
    try {
      await deletePictures(eventId);
      setSuccess("Picture deleted!");
      await fetchMemories();
    } catch (err) {
      console.error(err);
      setError("Failed to delete picture");
    }
  };

  const handleDeletePDF = async () => {
    if (!confirm("Delete PDF?")) return;
    try {
      await deletePDF(eventId);
      setSuccess("PDF deleted!");
      await fetchMemories();
    } catch (err) {
      console.error(err);
      setError("Failed to delete PDF");
    }
  };

  const handleGenerateShareLink = () => {
    const shareUrl = `${window.location.origin}/download?eventId=${eventId}`;
    navigator.clipboard.writeText(shareUrl);
    setSuccess("Share link copied!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 relative flex flex-col">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <FiX className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FiImage className="text-lime-500 w-6 h-6" /> Memories
        </h2>

        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-2 rounded mb-4">{success}</div>}

        {/* Upload Pictures */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Upload Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUploadPictures}
            disabled={uploading}
          />
        </div>

        {/* Upload PDF */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Upload PDF</label>
          <input type="file" accept="application/pdf" onChange={handleUploadPDF} disabled={uploading} />
        </div>

        {/* Pictures */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Picture</h3>
          {loading ? (
            <p>Loading...</p>
          ) : pictures.length ? (
            <img src={pictures[0]} alt="Event" className="w-full h-40 object-cover rounded-lg" />
          ) : (
            <p className="text-gray-500 italic">No picture uploaded yet.</p>
          )}
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleDeletePictures}
              className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
              disabled={uploading || !pictures.length}
            >
              <FiTrash2 /> Delete
            </button>
            {pictures.length ? (
              <a
                href={pictures[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-green-500 text-white rounded flex items-center gap-1"
              >
                <FiDownload /> Download
              </a>
            ) : null}
          </div>
        </div>

        {/* PDF */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">PDF</h3>
          {loading ? (
            <p>Loading...</p>
          ) : pdf ? (
            <div className="flex items-center gap-2">
              <a href={pdf} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                View PDF
              </a>
              <button
                onClick={handleDeletePDF}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                <FiTrash2 /> Delete
              </button>
              <a
                href={pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-green-500 text-white rounded flex items-center gap-1"
              >
                <FiDownload /> Download
              </a>
            </div>
          ) : (
            <p className="text-gray-500 italic">No PDF uploaded yet.</p>
          )}
        </div>

        {/* Share */}
        <div className="mt-4">
          <button
            onClick={handleGenerateShareLink}
            className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2"
          >
            <FiShare2 /> Generate Share Link
          </button>
        </div>
      </div>
    </div>
  );
}
