import React, { useRef } from "react";

export default function FloorPlanModal({ floorPlanUrl, onClose, onUpload }) {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click(); // trigger hidden input
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onUpload) {
      onUpload(file); // pass file back to parent for handling (e.g. upload to server / Firebase / etc.)
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-lg p-12 max-w-7xl w-full relative">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        onClick={onClose}
      >
        &times;
      </button>

      <h3 className="text-xl font-bold mb-4 text-pink-900">Venue Floor Plan</h3>

      {floorPlanUrl ? (
        <img
          src={floorPlanUrl}
          alt={`Floor plan: ${floorPlanUrl}`}
          className="w-full h-auto max-h-[600px] object-contain border rounded"
        />
      ) : (
        <p className="text-gray-500">No floor plan available.</p>
      )}

      {/* Add Floor Plan button */}
      <div className="mt-4">
        <button
          className="px-4 py-2 bg-pink-700 text-white rounded hover:bg-pink-800"
          onClick={handleButtonClick}
        >
          + Add Floor Plan
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </section>
  );
}

