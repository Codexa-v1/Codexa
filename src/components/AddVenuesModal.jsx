"use client"

import { useState } from "react"
import { addVenue, getVenues } from "@/backend/api/EventVenue"
import { FiX, FiPlus, FiMapPin, FiMail, FiPhone, FiFileText } from "react-icons/fi"
import { AiOutlineLoading } from "react-icons/ai"

export default function AddVenuesModal({ eventId, onClose, onVenuesUpdated }) {
  const [form, setForm] = useState({
    venueName: "",
    venueAddress: "",
    venueEmail: "",
    venuePhone: "",
    notes: "",
  })
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleAddVenue = (e) => {
    e.preventDefault()
    const { venueName, venueAddress, venueEmail, venuePhone } = form
    if (!venueName || !venueAddress || !venueEmail || !venuePhone) return

    setVenues((prev) => [
      ...prev,
      {
        venueName: venueName.trim(),
        venueAddress: venueAddress.trim(),
        venueEmail: venueEmail.trim(),
        venuePhone: venuePhone.trim(),
        capacity: 0,
        venueCost: 0,
        venueStatus: "Pending",
        notes: form.notes?.trim() || "",
      },
    ])

    setForm({
      venueName: "",
      venueAddress: "",
      venueEmail: "",
      venuePhone: "",
      notes: "",
    })
  }

  const handleSaveAll = async () => {
    if (venues.length === 0) return
    setLoading(true)
    setError(null)

    try {
      for (const venue of venues) {
        await addVenue(eventId, venue)
      }
      const updatedVenues = await getVenues(eventId)
      if (onVenuesUpdated) onVenuesUpdated(updatedVenues)

      setVenues([])
      onClose()
    } catch (err) {
      console.error("Error adding venues:", err)
      setError(err.message || "Failed to save venues.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] px-4">
      <section className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full relative max-h-[95vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6 flex items-center justify-between sticky top-0 z-10 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <FiMapPin className="text-white text-2xl" />
            <h3 className="text-2xl font-bold text-white">Add New Venue(s)</h3>
          </div>
          <button className="text-white hover:bg-white/20 rounded-full p-2 transition-colors" onClick={onClose}>
            <FiX className="text-2xl" />
          </button>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">{error}</div>
          )}

          <form onSubmit={handleAddVenue} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Venue Name *</label>
                <div className="relative">
                  <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    name="venueName"
                    value={form.venueName}
                    onChange={handleChange}
                    placeholder="Enter venue name"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Venue Address *</label>
                <div className="relative">
                  <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    name="venueAddress"
                    value={form.venueAddress}
                    onChange={handleChange}
                    placeholder="Enter venue address"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    name="venueEmail"
                    type="email"
                    value={form.venueEmail}
                    onChange={handleChange}
                    placeholder="venue@example.com"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    name="venuePhone"
                    type="tel"
                    value={form.venuePhone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes (Optional)</label>
                <div className="relative">
                  <FiFileText className="absolute left-4 top-4 text-gray-400" />
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Add any additional notes..."
                    rows={3}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <FiPlus className="text-lg" />
              Add Venue to List
            </button>
          </form>

          {venues.length > 0 && (
            <section className="mt-8">
              <h4 className="font-bold text-lg mb-4 text-gray-900">Venue List Preview ({venues.length})</h4>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-teal-50 to-teal-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-teal-900">Name</th>
                      <th className="px-4 py-3 text-left font-semibold text-teal-900">Address</th>
                      <th className="px-4 py-3 text-left font-semibold text-teal-900">Email</th>
                      <th className="px-4 py-3 text-left font-semibold text-teal-900">Phone</th>
                      <th className="px-4 py-3 text-left font-semibold text-teal-900">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {venues.map((v, i) => (
                      <tr key={i} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">{v.venueName}</td>
                        <td className="px-4 py-3">{v.venueAddress}</td>
                        <td className="px-4 py-3">{v.venueEmail}</td>
                        <td className="px-4 py-3">{v.venuePhone}</td>
                        <td className="px-4 py-3 text-gray-600">{v.notes || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <section className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
            <button
              type="button"
              className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              onClick={handleSaveAll}
              disabled={loading || venues.length === 0}
            >
              {loading ? (
                <>
                  <AiOutlineLoading className="animate-spin text-lg" />
                  Saving...
                </>
              ) : (
                `Save All Venues (${venues.length})`
              )}
            </button>
          </section>
        </div>
      </section>
    </section>
  )
}
