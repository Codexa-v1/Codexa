import React from "react";
import {
  DocumentTextIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
} from "react-icons/fa";

function getFileIcon(type) {
  if (type.includes("pdf"))
    return <FaFilePdf className="text-red-600 w-8 h-8" />;
  if (type.includes("word"))
    return <FaFileWord className="text-blue-600 w-8 h-8" />;
  if (type.includes("excel"))
    return <FaFileExcel className="text-green-600 w-8 h-8" />;
  if (type.includes("image"))
    return <FaFileImage className="text-yellow-500 w-8 h-8" />;
  return <DocumentTextIcon className="text-gray-500 w-8 h-8" />;
}

export default function DocumentsModal({ documents, onClose }) {
  return (
    <section className="bg-white rounded-lg shadow-lg p-8 w-full relative">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        onClick={onClose}
      >
        &times;
      </button>

      <h3 className="text-xl font-bold mb-4 text-green-900">Event Documents</h3>

      {documents && documents.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc, idx) => (
            <div
              key={idx}
              className="border rounded-lg shadow p-4 flex flex-col justify-between relative bg-white"
            >
              {/* Document Type Badge */}
              {getFileIcon(doc.type)}

              <h4 className="text-md font-semibold text-gray-800 mb-1">
                {doc.name}
              </h4>
              <p className="text-sm text-gray-500">Size: {doc.size}</p>
              <p className="text-sm text-gray-500">Date: {doc.date}</p>
              <p className="text-sm text-gray-500">Type: {doc.type}</p>
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                  />
                </svg>
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No documents available for this event.</p>
      )}
    </section>
  );
}
