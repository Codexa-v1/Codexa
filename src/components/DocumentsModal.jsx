import React, { useEffect, useState, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import DocumentUpload from "@/components/DocumentUpload";

export default function DocumentsModal({ onClose, eventId }) {
  const { user, isAuthenticated } = useAuth0();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search, filter, sort state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [sortOption, setSortOption] = useState("date-desc");

  const fetchDocuments = useCallback(async () => {
    if (!isAuthenticated || !user?.sub || !eventId) return;
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

      const uniqueDocs = Array.from(
        new Map(allDocs.map(d => [`${d.name}-${d.type}`, d])).values()
      );

      setDocuments(uniqueDocs);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, eventId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Delete a document
  const handleDelete = async (doc) => {
    if (!confirm(`Are you sure you want to delete "${doc.name}"?`)) return;

    try {
      const res = await fetch(
        `https://planit-backend-amfkhqcgbvfhamhx.canadacentral-01.azurewebsites.net/api/azure/delete-user-document`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.sub,
            eventId,
            docType: doc.type,
            fileName: doc.name,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to delete document");

      // Refresh list
      fetchDocuments();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete document. Please try again.");
    }
  };

  // Apply search, filter, and sort
  const filteredDocs = documents
    .filter(doc => filterType === "All" ? true : doc.type === filterType)
    .filter(doc => doc.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === "name-asc") return a.name.localeCompare(b.name);
      if (sortOption === "name-desc") return b.name.localeCompare(a.name);
      if (sortOption === "type-asc") return a.type.localeCompare(b.type);
      if (sortOption === "type-desc") return b.type.localeCompare(a.type);
      if (sortOption === "date-asc") return new Date(a.date) - new Date(b.date);
      if (sortOption === "date-desc") return new Date(b.date) - new Date(a.date);
      return 0;
    });

  return (
    <section className="bg-white rounded-lg shadow-lg p-8 w-full relative">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        onClick={onClose}
      >
        &times;
      </button>

      <h3 className="text-xl font-bold mb-4 text-green-900">Your Documents</h3>

      {/* Search + Filter + Sort controls */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-2 flex-1 min-w-[150px]"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border rounded p-2"
        >
          <option value="All">All Types</option>
          <option value="FloorPlan">Floor Plan</option>
          <option value="Agenda">Agenda</option>
          <option value="Budget">Budget</option>
          <option value="VendorContract">Vendor Contract</option>
          <option value="Photos">Photos</option>
          <option value="Other">Other</option>
        </select>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border rounded p-2"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="name-asc">Name (A–Z)</option>
          <option value="name-desc">Name (Z–A)</option>
          <option value="type-asc">Type (A–Z)</option>
          <option value="type-desc">Type (Z–A)</option>
        </select>
      </div>

      {loading ? (
        <p>Loading documents...</p>
      ) : filteredDocs.length === 0 ? (
        <p className="text-gray-500">No documents found.</p>
      ) : (
        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-gray-700">Type</th>
              <th className="px-4 py-2 text-left text-gray-700">Date</th>
              <th className="px-4 py-2 text-left text-gray-700">Download</th>
              <th className="px-4 py-2 text-left text-gray-700">Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.map((doc, idx) => (
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
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(doc)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-6">
        <DocumentUpload 
          userId={user?.sub} 
          eventId={eventId} 
          onUploadSuccess={fetchDocuments} 
        />
      </div>
    </section>
  );
}
