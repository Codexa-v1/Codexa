import React from "react";

export default function VendorsModal({ vendors, onClose }) {
  return (
    <section className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <section className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={onClose}>&times;</button>
        <h3 className="text-xl font-bold mb-4 text-blue-900">Vendor Details</h3>
        <ul>
          {vendors.map((vendor, idx) => (
            <li key={idx} className="mb-3">
              <span className="font-medium">{vendor.name}</span> <span className="text-xs text-gray-600">({vendor.service})</span>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
