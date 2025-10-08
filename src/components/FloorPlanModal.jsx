"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import FloorPlanUpload from "@/components/FloorPlanUpload"
import { FiX, FiDownload, FiTrash2, FiFile, FiImage } from "react-icons/fi"
import { AiOutlineLoading } from "react-icons/ai"

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL

export default function FloorPlanModal({ eventId, onClose }) {
  const { user, isAuthenticated } = useAuth0()
  const [floorPlans, setFloorPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const fetchFloorPlans = useCallback(async () => {
    if (!isAuthenticated || !user?.sub || !eventId) return
    setLoading(true)

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/azure/list-user-documents?userId=${encodeURIComponent(
          user.sub,
        )}&eventId=${encodeURIComponent(eventId)}`,
      )

      if (!res.ok) throw new Error("Failed to fetch floor plans")

      const data = await res.json()
      const floorPlanFiles = data.filter((f) => f.type === "FloorPlan")
      const uniqueFiles = Array.from(new Map(floorPlanFiles.map((f) => [f.name, f])).values())

      setFloorPlans(uniqueFiles)
    } catch (err) {
      console.error("Error fetching floor plans:", err)
      setFloorPlans([])
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, user, eventId])

  useEffect(() => {
    fetchFloorPlans()
  }, [fetchFloorPlans])

  const handleDelete = async (fPlan) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/azure/delete-user-document`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.sub,
            eventId,
            docType: "FloorPlan",
            fileName: fPlan.name,
          }),
        },
      )

      if (!res.ok) throw new Error("Failed to delete floor plan")

      setDeleteConfirm(null)
      fetchFloorPlans()
    } catch (err) {
      console.error("Delete error:", err)
      alert("Failed to delete floor plan. Please try again.")
    }
  }

  return (
    <>
      <section className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-6xl relative backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg">
              <FiImage className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Floor Plans
            </h3>
          </div>
          <button
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            onClick={onClose}
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Floor Plans Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AiOutlineLoading className="w-12 h-12 text-teal-600 animate-spin mb-4" />
            <p className="text-gray-500">Loading floor plans...</p>
          </div>
        ) : floorPlans.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {floorPlans.map((fPlan) => {
              const isPDF = fPlan.url.split("?")[0].toLowerCase().endsWith(".pdf")

              return (
                <div
                  key={fPlan.name}
                  className="border border-gray-200 rounded-xl shadow-md hover:shadow-xl p-4 flex flex-col justify-between bg-gradient-to-br from-white to-gray-50 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Header with name and actions */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      {isPDF ? (
                        <FiFile className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <FiImage className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span className="font-semibold text-gray-800 text-sm break-words">{fPlan.name}</span>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 ml-2">
                      <a
                        href={fPlan.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-all duration-200"
                        title="Download"
                      >
                        <FiDownload className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => setDeleteConfirm(fPlan)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Preview */}
                  {isPDF ? (
                    <a
                      href={fPlan.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 flex items-center justify-center gap-2 px-4 py-8 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 font-medium rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-200 group"
                    >
                      <FiFile className="w-8 h-8 text-teal-600 group-hover:scale-110 transition-transform duration-200" />
                      <span className="text-sm">View PDF</span>
                    </a>
                  ) : (
                    <img
                      src={fPlan.url || "/placeholder.svg"}
                      alt={fPlan.name}
                      className="mt-2 rounded-lg h-48 w-full object-cover border border-gray-200"
                    />
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 mb-8">
            <FiImage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No floor plans available for this event.</p>
          </div>
        )}

        {/* Upload Section */}
        <div className="mt-6">
          <FloorPlanUpload userId={user?.sub} eventId={eventId} onUploadSuccess={fetchFloorPlans} />
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <FiTrash2 className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Delete Floor Plan</h4>
                <p className="text-gray-600 text-sm">
                  Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
