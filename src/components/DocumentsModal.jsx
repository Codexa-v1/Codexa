import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import DocumentUpload from "@/components/DocumentUpload";

export default function DocumentsModal({ onClose, eventId }) {
  const { user, isAuthenticated } = useAuth0();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user?.sub || !eventId) return;

    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const docTypes = ["FloorPlan", "Agenda", "Budget", "VendorContract", "Photos", "Other"];
        const allDocs = [];

        for (const type of docTypes) {
          const res = await fetch(
            `https://planit-backend-amfkhqcgbvfhamhx.canadacentral-01.azurewebsites.net/api/azure/list-user-documents?userId=${encodeURIComponent(
              user.sub
            )}&eventId=${encodeURIComponent(eventId)}&docType=${type}`
          );
          if (!res.ok) continue;
          const data = await res.json();
          allDocs.push(...data);
        }

        setDocuments(allDocs);
      } catch (err) {
        console.error("Failed to fetch documents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [isAuthenticated, user, eventId]);

  return (
    <section className="bg-white rounded-lg shadow-lg p-8 w-full relative">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        onClick={onClose}
      >
        &times;
      </button>

      <h3 className="text-xl font-bold mb-4 text-green-900">Your Documents</h3>

      {loading ? (
        <p>Loading documents...</p>
      ) : documents.length === 0 ? (
        <p className="text-gray-500">No documents uploaded yet.</p>
      ) : (
        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-gray-700">Type</th>
              <th className="px-4 py-2 text-left text-gray-700">Date</th>
              <th className="px-4 py-2 text-left text-gray-700">Download</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2">{doc.name}</td>
                <td className="px-4 py-2">{doc.type}</td>
                <td className="px-4 py-2">{new Date(doc.date).toLocaleString()}</td>
                <td className="px-4 py-2">
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-6">
        {/* Pass userId + eventId into DocumentUpload */}
        <DocumentUpload userId={user?.sub} eventId={eventId} />
      </div>
    </section>
  );
}
