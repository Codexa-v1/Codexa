"use client"

import { useState } from "react"
import { addGuest, getGuests } from "../backend/api/EventGuest"
import { AiOutlineLoading, AiOutlineClose, AiOutlineUserAdd, AiOutlineUpload, AiOutlineDownload } from "react-icons/ai"

export default function AddGuestsModal({ onClose, onGuestsUpdated, eventId }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    rsvpStatus: "Pending",
    dietaryPreferences: "",
  })
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  function handleAddGuest(e) {
    e.preventDefault()
    if (!form.name || !form.email) return

    setGuests((prev) => [
      ...prev,
      {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone?.trim() || "",
        rsvpStatus: form.rsvpStatus || "Pending",
        dietaryPreferences: form.dietaryPreferences?.trim() || "",
      },
    ])

    setForm({
      name: "",
      phone: "",
      email: "",
      rsvpStatus: "Pending",
      dietaryPreferences: "",
    })
  }

  function handleCSVUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target.result
      const rows = text.split("\n").map((row) => row.split(","))
      const [header, ...dataRows] = rows

      const importedGuests = dataRows
        .map((row) => {
          if (row.length < 5) return null
          const guest = {
            name: row[0]?.trim(),
            phone: row[1]?.trim(),
            email: row[2]?.trim(),
            rsvpStatus: row[3]?.trim() || "Pending",
            dietaryPreferences: row[4]?.trim() || "",
          }
          return guest.name && guest.email ? guest : null
        })
        .filter(Boolean)

      setGuests((prev) => [...prev, ...importedGuests])
    }
    reader.readAsText(file)
  }

  async function handleSaveAll() {
    if (guests.length === 0) return

    const validGuests = guests.filter((g) => g && g.name && g.email)
    if (validGuests.length === 0) {
      alert("No valid guests to save.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const savedGuests = []
      for (const guest of validGuests) {
        const saved = await addGuest(eventId, guest)
        savedGuests.push(saved)
      }

      const updatedGuests = await getGuests(eventId)

      if (onGuestsUpdated) onGuestsUpdated(updatedGuests)
      setGuests([])
      window.location.reload()
      onClose()
    } catch (err) {
      setError(err.message || "Failed to save guests.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function downloadSampleCSV() {
    const sample = `name,phone,email,rsvpStatus,dietaryPreferences
Alice,1234567890,alice@email.com,Pending,Vegan
Bob,0987654321,bob@email.com,Declined,Gluten-free`
    const blob = new Blob([sample], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "guest_template.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6">
      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <AiOutlineLoading className="w-12 h-12 text-teal-500 animate-spin" />
          <span className="mt-4 text-white text-lg font-semibold">Saving guests...</span>
        </div>
      )}

      <section className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-4xl w-full relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
          onClick={onClose}
          aria-label="Close"
        >
          <AiOutlineClose className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl">
            <AiOutlineUserAdd className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Add New Guests</h3>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
        )}

        {/* Manual Guest Form */}
        <form onSubmit={handleAddGuest} className="space-y-4 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter guest name"
                className="px-4 py-2.5 border border-gray-300 rounded-xl w-full focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="guest@example.com"
                className="px-4 py-2.5 border border-gray-300 rounded-xl w-full focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="(123) 456-7890"
                className="px-4 py-2.5 border border-gray-300 rounded-xl w-full focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">RSVP Status</label>
              <select
                name="rsvpStatus"
                value={form.rsvpStatus}
                onChange={handleChange}
                className="px-4 py-2.5 border border-gray-300 rounded-xl w-full focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              >
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Declined">Declined</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Dietary Preferences</label>
            <textarea
              name="dietaryPreferences"
              value={form.dietaryPreferences}
              onChange={handleChange}
              placeholder="e.g., Vegan, Gluten-free, No nuts"
              rows={2}
              className="px-4 py-2.5 border border-gray-300 rounded-xl w-full focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 text-white font-medium hover:from-teal-700 hover:to-teal-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <AiOutlineUserAdd className="w-5 h-5" />
            Add Guest to List
          </button>
        </form>

        {/* CSV Upload Section */}
        <div className="border-t border-gray-200 pt-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <AiOutlineUpload className="w-5 h-5 text-teal-600" />
            <label className="block font-semibold text-gray-900">Bulk Import via CSV</label>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <input
              id="csvUpload"
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 file:cursor-pointer cursor-pointer"
            />
            <p className="text-xs text-gray-600">
              CSV format:{" "}
              <code className="bg-white px-2 py-0.5 rounded text-teal-700 font-mono">
                name,phone,email,rsvpStatus,dietaryPreferences
              </code>
            </p>
            <button
              type="button"
              onClick={downloadSampleCSV}
              className="text-teal-600 hover:text-teal-700 font-medium text-sm flex items-center gap-1.5 transition-colors"
            >
              <AiOutlineDownload className="w-4 h-4" />
              Download sample CSV template
            </button>
          </div>
        </div>

        {/* Guest Preview Table */}
        {guests.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              Guest List Preview
              <span className="px-2.5 py-0.5 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                {guests.length} {guests.length === 1 ? "guest" : "guests"}
              </span>
            </h4>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Phone</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">RSVP</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Dietary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {guests.map((g, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{g.name}</td>
                      <td className="px-4 py-3 text-gray-600">{g.email}</td>
                      <td className="px-4 py-3 text-gray-600">{g.phone || "-"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            g.rsvpStatus === "Accepted"
                              ? "bg-green-100 text-green-700"
                              : g.rsvpStatus === "Declined"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {g.rsvpStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{g.dietaryPreferences || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 text-white font-medium hover:from-teal-700 hover:to-teal-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSaveAll}
            disabled={loading || guests.length === 0}
          >
            {loading ? "Saving..." : `Save ${guests.length} ${guests.length === 1 ? "Guest" : "Guests"}`}
          </button>
        </div>
      </section>
    </section>
  )
}
