"use client"

import { useState, useEffect } from "react"
import { FiClock, FiDownload, FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi"
import { AiOutlineLoading } from "react-icons/ai"
import { getSchedule, deleteEventSchedule } from "@/backend/api/EventSchedule"
import AddScheduleModal from "@/components/AddScheduleModal"

const API_URL = import.meta.env.VITE_BACKEND_URL

export default function ScheduleModal({ eventId, onClose }) {
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [activeSchedule, setActiveSchedule] = useState(null) // Add/Edit

  const fetchSchedule = async () => {
    try {
      setLoading(true)
      const data = await getSchedule(eventId)
      const sorted = data.sort((a, b) => {
        const [aHour, aMin] = a.startTime.split(":").map(Number)
        const [bHour, bMin] = b.startTime.split(":").map(Number)
        return aHour !== bHour ? aHour - bHour : aMin - bMin
      })
      setSchedule(sorted)
    } catch (error) {
      console.error("Error fetching schedule:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchedule()
  }, [eventId])

  const handleExportWord = async () => {
    setExporting(true)
    try {
      let eventDetails = {}
      try {
        const res = await fetch(`${API_URL}/api/events/${eventId}`)
        if (res.ok) eventDetails = await res.json()
      } catch (err) {
        console.error(err)
      }

      const formattedDate = eventDetails.date ? new Date(eventDetails.date).toLocaleDateString() : ""

      const { Document, Packer, Paragraph, Table, TableRow, TableCell } = await import("docx")
      const scheduleTable = new Table({
        rows: [
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Time")] }),
              new TableCell({ children: [new Paragraph("Description")] }),
            ],
          }),
          ...schedule.map(
            (item) =>
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(`${item.startTime} – ${item.endTime}`)] }),
                  new TableCell({ children: [new Paragraph(item.description)] }),
                ],
              }),
          ),
        ],
      })

      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({ text: `Event Title: ${eventDetails.title || ""}`, heading: "Heading1" }),
              new Paragraph({ text: `Date: ${formattedDate}` }),
              new Paragraph({ text: `Location: ${eventDetails.location || ""}` }),
              new Paragraph({ text: `Description: ${eventDetails.description || ""}` }),
              new Paragraph({ text: "Schedule:", heading: "Heading2" }),
              scheduleTable,
            ],
          },
        ],
      })

      Packer.toBlob(doc).then((blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "EventSchedule.docx"
        a.click()
        URL.revokeObjectURL(url)
      })
    } catch (error) {
      console.error("Error exporting to Word:", error)
    } finally {
      setExporting(false)
    }
  }

  const handleRemoveSchedule = async (scheduleId) => {
    try {
      await deleteEventSchedule(eventId, scheduleId)
      setDeleteConfirm(null)
      fetchSchedule()
    } catch (error) {
      console.error("Error removing schedule item:", error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <FiClock className="text-white text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-white">Event Schedule</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 border-b border-gray-200 flex gap-3">
          <button
            onClick={() => setActiveSchedule({})}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all shadow-md hover:shadow-lg font-medium"
          >
            <FiPlus className="text-lg" /> Add Schedule Item
          </button>
          <button
            onClick={handleExportWord}
            disabled={exporting || schedule.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-teal-600 text-teal-700 rounded-lg hover:bg-teal-50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? <AiOutlineLoading className="text-lg animate-spin" /> : <FiDownload className="text-lg" />}
            {exporting ? "Exporting..." : "Export to Word"}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AiOutlineLoading className="text-4xl text-teal-600 animate-spin mb-3" />
              <p className="text-gray-500">Loading schedule...</p>
            </div>
          ) : schedule.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-teal-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiClock className="text-3xl text-teal-600" />
              </div>
              <p className="text-gray-600 font-medium">No schedule items added yet.</p>
              <p className="text-gray-500 text-sm mt-1">Click "Add Schedule Item" to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {schedule.map((item, idx) => (
                <div
                  key={item._id || idx}
                  className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-2">{item.description}</p>
                      <div className="flex items-center gap-2 text-sm text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg w-fit">
                        <FiClock className="text-base" />
                        <span className="font-medium">
                          {item.startTime} – {item.endTime}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors" onClick={() => setActiveSchedule(item)} title="Edit">
                        <FiEdit2 className="text-lg" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" onClick={() => setDeleteConfirm(item._id)} title="Remove">
                        <FiTrash2 className="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <FiTrash2 className="text-red-600 text-xl" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Delete Schedule Item</h4>
            </div>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this schedule item? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-md font-medium"
                onClick={() => handleRemoveSchedule(deleteConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Schedule Modal */}
      {activeSchedule && (
      <AddScheduleModal
        eventId={eventId}
        initialData={activeSchedule._id ? activeSchedule : null}
        onClose={() => setActiveSchedule(undefined)}
        onSaved={fetchSchedule}
      />
)}
    </div>
  )
}
