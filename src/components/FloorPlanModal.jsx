import React from "react";

export default function FloorPlanModal({ floorPlanUrl, onClose }) {
  return (
    <section className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <section className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={onClose}>&times;</button>
        <h3 className="text-xl font-bold mb-4 text-green-900">Venue Floor Plan</h3>
        {floorPlanUrl ? (
          <img src={floorPlanUrl} alt="Floor Plan" className="w-full h-auto max-h-[600px] object-contain border rounded" />
        ) : (
          <p className="text-gray-500">No floor plan available.</p>
        )}
      </section>
    </section>
  );
}
