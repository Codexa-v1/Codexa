"use client"

import { useState, useEffect } from "react"
import { updateVenue, getVenues } from "@/backend/api/EventVenue"
import { getEventVendorDetails } from "@/backend/api/EventVendor"
import { FiX, FiUsers, FiDollarSign, FiAlertCircle, FiFileText } from "react-icons/fi"
import { AiOutlineLoading } from "react-icons/ai"

export default function EditVenueModal({ venue, eventId, eventBudget, onClose, onSave }) {
  const [form, setForm] = useState({
    venueName: venue.venueName || "",
    venueAddress: venue.venueAddress || "",
    venueEmail: venue.venueEmail || "",
    venuePhone: venue.venuePhone || "",
    capacity: venue.capacity || 0,
    venueCost: venue.venueCost || 0,
    venueStatus: venue.venueStatus || "Pending",
    notes: venue.notes || "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [remainingBudget, setRemainingBudget] = useState(eventBudget || 0)

  useEffect(() => {
    const fetchRemaining = async () => {
      try {
        const venues = await getVenues(eventId)
        const vendors = await getEventVendorDetails(eventId)

        const totalVenueCost =
          venues.reduce((sum, v) => sum + (Number.parseFloat(v.venueCost) || 0), 0) -
          (Number.parseFloat(venue.venueCost) || 0)

        const totalVendorCost = vendors.reduce((sum, v) => sum + Number.parseFloat(v.eventVendor?.vendorCost || 0), 0)
        console.log("Total vendor cost:", totalVendorCost)

        const remaining = eventBudget - totalVenueCost - totalVendorCost
        setRemainingBudget(Math.max(Math.round(remaining * 100) / 100, 0))
      } catch (err) {
        console.error("Error fetching venues:", err)
        setRemainingBudget(eventBudget || 0)
      }
    }

    fetchRemaining()
  }, [eventId, eventBudget, venue.venueCost])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const numericCost = Number.parseFloat(form.venueCost) || 0

    if (numericCost > remainingBudget) {
      setError(`Cost exceeds remaining event budget: R${remainingBudget.toFixed(2)}`)
      setLoading(false)
      return
    }

    try {
      await updateVenue(eventId, venue._id, {
        ...form,
        capacity: Number(form.capacity),
        venueCost: numericCost,
        notes: form.notes.trim() || "",
      })
      if (onSave) onSave()
      onClose()
    } catch (err) {
      console.error("Error updating venue:", err)
      setError(err.message || "Failed to update venue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] px-4">
      <section className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6 flex items-center justify-between rounded-t-2xl">
          <h3 className="text-2xl font-bold text-white">Edit Venue</h3>
          <button className="text-white hover:bg-white/20 rounded-full p-2 transition-colors" onClick={onClose}>
            <FiX className="text-2xl" />
          </button>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-start gap-3">
              <FiAlertCircle className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 rounded-full p-2">
                <FiDollarSign className="text-amber-600 text-xl" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-900">Remaining Budget</p>
                <p className="text-2xl font-bold text-amber-700">
                  R{remainingBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Capacity</label>
                <div className="relative">
                  <FiUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    name="capacity"
                    value={form.capacity}
                    onChange={handleChange}
                    min={0}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cost (R)</label>
                <div className="relative">
                  <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    name="venueCost"
                    value={form.venueCost}
                    onChange={handleChange}
                    min={0}
                    step="0.01"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  name="venueStatus"
                  value={form.venueStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                >
                  <option value="">Choose a status</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Unavailable">Unavailable</option>
                  <option value="Declined">Declined</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                <div className="relative">
                  <FiFileText className="absolute left-4 top-4 text-gray-400" />
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Add any additional notes..."
                    rows={4}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <section className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={loading || remainingBudget <= 0}
              >
                {loading ? (
                  <>
                    <AiOutlineLoading className="animate-spin" />
                    Saving...
                  </>
                ) : remainingBudget <= 0 ? (
                  "Budget Full"
                ) : (
                  "Save Changes"
                )}
              </button>
            </section>
          </form>
        </div>
      </section>
    </section>
  )
}
