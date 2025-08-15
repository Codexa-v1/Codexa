import React from "react";

export default function DocumentsModal({ documents, onClose }) {
  return (
    <section className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <section className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={onClose}>&times;</button>
        <h3 className="text-xl font-bold mb-4 text-green-900">Event Documents</h3>
        {documents && documents.length > 0 ? (
          <ul className="space-y-4">
            {documents.map((doc, idx) => (
              <li key={idx} className="flex items-center justify-between border-b pb-2">
                <span className="font-medium text-gray-800">{doc.name}</span>
                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800 text-xs">View</a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No documents available for this event.</p>
        )}
      </section>
    </section>
  );
}
