"use client"

import { useState } from "react"
import { updateEvent } from "@/backend/api/EventData"
import { FiX, FiCalendar, FiClock, FiMapPin, FiDollarSign, FiTag, FiFileText, FiSave } from "react-icons/fi"
import { AiOutlineLoading } from "react-icons/ai"

export default function EditEventModal({ event, onClose, onSave }) {
  function formatBudget(val) {
    if (!val) return ""
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const today = new Date()
  const todayStr = today.toISOString().split("T")[0]
  const eventStarted = new Date(event.date) < today

  const [form, setForm] = useState({
    title: event.title || "",
    category: event.category || "",
    date: event.date || "",
    endDate: event.endDate || "",
    startTime: event.startTime || "",
    endTime: event.endTime || "",
    location: event.location || "",
    budget: event.budget || "",
    description: event.description || "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setError("") // Clear error when user types
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const startDate = new Date(form.date)
    const endDate = new Date(form.endDate)

    // Prevent end date before start date
    if (endDate < startDate) {
      setError("End date cannot be before start date.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const updateData = { ...form }

      // If the original event was in the past and the new date is in the future, set status to "Planning"
      const originalEventDate = new Date(event.date)
      const newEventDate = new Date(form.date)
      const wasInPast = originalEventDate < today
      const isNowInFuture = newEventDate >= today

      if (wasInPast && isNowInFuture) {
        updateData.status = "Planning"
      }

      await updateEvent(event._id, updateData)
      if (onSave) onSave(updateData)
      onClose()
    } catch (err) {
      console.error("Error updating event:", err)
      setError("Failed to update event. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-2 sm:px-4">
      <section className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-3xl w-full relative max-h-[95vh] overflow-y-auto">
        {/* Gradient accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 rounded-t-2xl" />

        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
          onClick={onClose}
          disabled={loading}
        >
          <FiX size={24} />
        </button>

        <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-800">
          Edit Event Details
        </h3>

        {eventStarted && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <div className="text-amber-600 mt-0.5">⚠️</div>
            <div>
              <p className="text-sm font-semibold text-amber-800">Event Already Started or Has Passed</p>
              <p className="text-xs text-amber-700 mt-1">
                This event has already started or is in the past. Please review changes carefully.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <div className="text-red-600 mt-0.5">✕</div>
            <div>
              <p className="text-sm font-semibold text-red-800">Error</p>
              <p className="text-xs text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FiTag className="inline mr-2" />
                Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Event title"
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Category */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FiTag className="inline mr-2" />
                Category
              </label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                placeholder="Event category"
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Start Date */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FiCalendar className="inline mr-2" />
                Start Date
              </label>
              <input
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                type="date"
                min={todayStr}
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* End Date */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FiCalendar className="inline mr-2" />
                End Date
              </label>
              <input
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
                type="date"
                disabled={loading}
                min={form.date || todayStr}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Start Time */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FiClock className="inline mr-2" />
                Start Time
              </label>
              <input
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                required
                type="time"
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* End Time */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FiClock className="inline mr-2" />
                End Time
              </label>
              <input
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                required
                type="time"
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Location */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FiMapPin className="inline mr-2" />
                Location
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                placeholder="Event location"
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Budget */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FiDollarSign className="inline mr-2" />
                Budget
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">R</span>
                <input
                  name="budget"
                  value={formatBudget(form.budget)}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/,/g, "")
                    handleChange({ target: { name: "budget", value: raw } })
                  }}
                  required
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  disabled={loading}
                  className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FiFileText className="inline mr-2" />
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Event description (optional)"
              disabled={loading}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              className="px-6 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 shadow-lg hover:shadow-xl"
              }`}
            >
              {loading ? (
                <>
                  <AiOutlineLoading className="animate-spin" size={18} />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </section>
  )
}
