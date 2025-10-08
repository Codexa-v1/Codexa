"use client"

import { useState } from "react"
import { FiClock, FiX, FiSave } from "react-icons/fi"
import { AiOutlineLoading } from "react-icons/ai"
import { createEventSchedule, updateEventSchedule } from "@/backend/api/EventSchedule"

export default function AddScheduleModal({ eventId, onClose, initialData, onSaved }) {
  const [form, setForm] = useState(
    initialData || { description: "", startTime: "", endTime: "" }
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setError("")
  }

  const handleSave = async () => {
    if (!form.description.trim()) return setError("Description is required")
    if (!form.startTime || !form.endTime) return setError("Start time and end time are required")
    if (form.startTime >= form.endTime) return setError("End time must be after start time")

    setSaving(true)
    try {
      if (initialData?._id) await updateEventSchedule(eventId, initialData._id, form)
      else await createEventSchedule(eventId, form)

      if (onSaved) onSaved() // refresh schedule in parent modal
      onClose()
    } catch (err) {
      console.error(err)
      setError("Failed to save schedule item. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <FiClock className="text-white text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-white">{initialData ? "Edit" : "Add"} Schedule Item</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter schedule item description"
              rows={3}
              className="w-full border-2 border-gray-200 px-4 py-2.5 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time *</label>
              <input type="time" name="startTime" value={form.startTime} onChange={handleChange} className="w-full border-2 border-gray-200 px-4 py-2.5 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"/>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">End Time *</label>
              <input type="time" name="endTime" value={form.endTime} onChange={handleChange} className="w-full border-2 border-gray-200 px-4 py-2.5 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"/>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium" disabled={saving}>
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed" disabled={saving}>
            {saving ? <><AiOutlineLoading className="text-lg animate-spin"/> Saving...</> : <><FiSave className="text-lg"/> Save</>}
          </button>
        </div>
      </div>
    </div>
  )
}
