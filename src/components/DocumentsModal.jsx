"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import DocumentUpload from "@/components/DocumentUpload"
import { FiX, FiSearch, FiDownload, FiTrash2, FiFile, FiAlertCircle } from "react-icons/fi"
import { AiOutlineLoading } from "react-icons/ai"

export default function DocumentsModal({ onClose, eventId }) {
  const { user, isAuthenticated } = useAuth0()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  // Search, filter, sort state
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("All")
  const [sortOption, setSortOption] = useState("date-desc")

  // Delete confirmation state
  const [deleteDoc, setDeleteDoc] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchDocuments = useCallback(async () => {
    if (!isAuthenticated || !user?.sub || !eventId) return
    setLoading(true)
    try {
      const docTypes = ["FloorPlan", "Agenda", "Budget", "VendorContract", "Photos", "Other"]
      const allDocs = []

      for (const type of docTypes) {
        const res = await fetch(
          `https://planit-backend-amfkhqcgbvfhamhx.canadacentral-01.azurewebsites.net/api/azure/list-user-documents?userId=${encodeURIComponent(
            user.sub,
          )}&eventId=${encodeURIComponent(eventId)}&docType=${type}`,
        )
        if (!res.ok) continue
        const data = await res.json()
        allDocs.push(...data)
      }

      const uniqueDocs = Array.from(new Map(allDocs.map((d) => [`${d.name}-${d.type}`, d])).values())

      setDocuments(uniqueDocs)
    } catch (err) {
      console.error("Failed to fetch documents:", err)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, user, eventId])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  // Delete a document
  const handleDeleteConfirm = async () => {
    if (!deleteDoc) return

    setDeleting(true)
    try {
      const res = await fetch(
        `https://planit-backend-amfkhqcgbvfhamhx.canadacentral-01.azurewebsites.net/api/azure/delete-user-document`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.sub,
            eventId,
            docType: deleteDoc.type,
            fileName: deleteDoc.name,
          }),
        },
      )

      if (!res.ok) throw new Error("Failed to delete document")

      // Refresh list
      fetchDocuments()
      setDeleteDoc(null)
    } catch (err) {
      console.error("Delete error:", err)
      alert("Failed to delete document. Please try again.")
    } finally {
      setDeleting(false)
    }
  }

  // Apply search, filter, and sort
  const filteredDocs = documents
    .filter((doc) => (filterType === "All" ? true : doc.type === filterType))
    .filter((doc) => doc.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === "name-asc") return a.name.localeCompare(b.name)
      if (sortOption === "name-desc") return b.name.localeCompare(a.name)
      if (sortOption === "type-asc") return a.type.localeCompare(b.type)
      if (sortOption === "type-desc") return b.type.localeCompare(a.type)
      if (sortOption === "date-asc") return new Date(a.date) - new Date(b.date)
      if (sortOption === "date-desc") return new Date(b.date) - new Date(a.date)
      return 0
    })

  return (
    <section className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-2 sm:px-4">
      <section className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-6xl w-full relative max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-700 to-cyan-700 bg-clip-text text-transparent flex items-center gap-2">
            <FiFile className="text-teal-600" />
            Event Documents
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FiX size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Search + Filter + Sort controls */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
          <div className="flex-1 min-w-[200px] relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
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
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="name-asc">Name (A–Z)</option>
            <option value="name-desc">Name (Z–A)</option>
            <option value="type-asc">Type (A–Z)</option>
            <option value="type-desc">Type (Z–A)</option>
          </select>
        </div>

        {/* Documents Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <AiOutlineLoading className="animate-spin text-teal-600" size={32} />
            <span className="ml-3 text-gray-600">Loading documents...</span>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="text-center py-12">
            <FiFile className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-gray-500">No documents found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 mb-6">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-teal-50 to-cyan-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-teal-900">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-teal-900">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-teal-900">Date</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-teal-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDocs.map((doc, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900">{doc.name}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                        {doc.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{new Date(doc.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                          title="Download"
                        >
                          <FiDownload size={18} />
                        </a>
                        <button
                          onClick={() => setDeleteDoc(doc)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Upload Section */}
        <DocumentUpload userId={user?.sub} eventId={eventId} onUploadSuccess={fetchDocuments} />
      </section>

      {/* Delete Confirmation Modal */}
      {deleteDoc && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <FiAlertCircle className="text-red-600" size={24} />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Delete Document</h4>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">"{deleteDoc.name}"</span>? This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteDoc(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <AiOutlineLoading className="animate-spin" size={18} />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
