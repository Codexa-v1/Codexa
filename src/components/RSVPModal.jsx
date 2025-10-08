"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getGuests, deleteGuest } from "../backend/api/EventGuest"
import AddGuestsModal from "@/components/AddGuestsModal"
import EditGuestModal from "@/components/EditGuestModal"
import { FiX, FiSearch, FiDownload, FiRefreshCw, FiUserPlus, FiEdit2, FiTrash2, FiBell, FiMail } from "react-icons/fi"

export default function RSVPModal({ guests: initialGuests, onClose, eventId, onAddGuests }) {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [exportType, setExportType] = useState("CSV")
  const [guests, setGuests] = useState(initialGuests || [])
  const [showAddGuestsModal, setShowAddGuestsModal] = useState(false)
  const [editingGuest, setEditingGuest] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)

  // Fetch guests function (reusable)
  const fetchGuests = async () => {
    if (!eventId) return
    try {
      const data = await getGuests(eventId)
      setGuests(data)
    } catch (error) {
      console.error(error)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchGuests()
  }, [eventId])

  // Remove guest
  const handleRemoveGuest = async (guestId) => {
    if (!eventId) return
    if (!confirm("Are you sure you want to remove this guest?")) return
    try {
      await deleteGuest(eventId, guestId)
      fetchGuests()
    } catch (error) {
      console.error(error)
    }
  }

  // Remind a guest
  const handleRemindGuest = async (guestId) => {
    try {
      const res = await fetch(
        `https://planit-backend-amfkhqcgbvfhamhx.canadacentral-01.azurewebsites.net/api/guests/event/${eventId}/guest/${guestId}/remind`,
        { method: "POST" },
      )
      if (!res.ok) throw new Error("Failed to send reminder")
      alert("Reminder sent!")
    } catch (err) {
      console.error(err)
      alert("Failed to send reminder. Please try again.")
    }
  }

  // Re-invite a guest
  const handleReinviteGuest = async (guestId) => {
    try {
      const res = await fetch(
        `https://planit-backend-amfkhqcgbvfhamhx.canadacentral-01.azurewebsites.net/api/guests/event/${eventId}/guest/${guestId}/reinvite`,
        { method: "POST" },
      )
      if (!res.ok) throw new Error("Failed to re-invite guest")
      fetchGuests()
      alert("Guest re-invited!")
    } catch (err) {
      console.error(err)
      alert("Failed to re-invite guest. Please try again.")
    }
  }

  // Edit guest
  const handleEditGuest = (guest) => {
    setEditingGuest(guest)
    setShowEditModal(true)
  }

  const handleUpdateGuest = async (updatedGuest) => {
    try {
      const res = await fetch(
        `https://planit-backend-amfkhqcgbvfhamhx.canadacentral-01.azurewebsites.net/api/guests/event/${eventId}/guest/${updatedGuest._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedGuest),
        },
      )
      if (!res.ok) throw new Error("Failed to update guest")

      const updated = await res.json()
      setGuests((prev) => prev.map((g) => (g._id === updated.guest._id ? updated.guest : g)))
      setShowEditModal(false)
    } catch (err) {
      console.error("Error updating guest:", err)
      alert("Failed to update guest. Please try again.")
    }
  }

  // Filtering
  const filteredGuests = guests.filter((guest) => {
    const matchesStatus = filterStatus === "All" || guest.rsvpStatus === filterStatus
    const matchesSearch =
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.phone.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Export
  const handleExport = () => {
    if (exportType === "CSV") {
      const csvRows = [
        ["Name", "Email", "Mobile Number", "Status"],
        ...filteredGuests.map((g) => [g.name, g.email, g.phone, g.rsvpStatus]),
      ]
      const csvContent = csvRows
        .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(","))
        .join("\n")
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "guests.csv"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else {
      const jsonContent = JSON.stringify(filteredGuests, null, 2)
      const blob = new Blob([jsonContent], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "guests.json"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const acceptedCount = guests.filter((g) => g.rsvpStatus === "Accepted").length
  const acceptanceRate = guests.length > 0 ? (acceptedCount / guests.length) * 100 : 0

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        <section className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 max-w-7xl w-full relative max-h-[90vh] overflow-hidden flex flex-col">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full z-10"
            onClick={onClose}
          >
            <FiX className="w-6 h-6" />
          </button>

          <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 border-b border-gray-200 pb-3 sm:pb-4 pr-12">
            Guest List Management
          </h3>

          <section className="flex flex-col gap-3 mb-4 sm:mb-6">
            {/* Search Input */}
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter and Actions Row */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {/* Filter Dropdown */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="Accepted">Accepted</option>
                <option value="Pending">Pending</option>
                <option value="Declined">Declined</option>
              </select>

              {/* Action Buttons - Stack on mobile, row on larger screens */}
              <div className="flex flex-col sm:flex-row gap-2 sm:ml-auto">
                {/* Export Row */}
                <div className="flex gap-2">
                  <select
                    value={exportType}
                    onChange={(e) => setExportType(e.target.value)}
                    className="flex-1 sm:flex-none px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-sm"
                  >
                    <option value="CSV">CSV</option>
                    <option value="JSON">JSON</option>
                  </select>
                  <button
                    className="flex-1 sm:flex-none bg-teal-600 text-white px-4 py-2.5 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm text-sm"
                    onClick={handleExport}
                    type="button"
                  >
                    <FiDownload className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>

                {/* Refresh and Add Buttons Row */}
                <div className="flex gap-2">
                  <button
                    className="flex-none bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                    onClick={fetchGuests}
                    type="button"
                    title="Refresh"
                  >
                    <FiRefreshCw className="w-4 h-4" />
                    <span className="sm:hidden">Refresh</span>
                  </button>
                  <button
                    className="flex-1 sm:flex-none bg-teal-600 text-white px-4 py-2.5 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm text-sm whitespace-nowrap"
                    onClick={() => setShowAddGuestsModal(true)}
                    type="button"
                  >
                    <FiUserPlus className="w-4 h-4" />
                    <span>Add Guests</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="flex-1 overflow-auto rounded-lg border border-gray-200">
            <div className="min-w-[640px]">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-teal-50 to-cyan-50 sticky top-0">
                  <tr>
                    <th className="py-3 px-3 sm:px-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Name</th>
                    <th className="py-3 px-3 sm:px-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="py-3 px-3 sm:px-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                      Phone
                    </th>
                    <th className="py-3 px-3 sm:px-4 text-center text-xs sm:text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="py-3 px-3 sm:px-4 text-center text-xs sm:text-sm font-semibold text-gray-700 min-w-[200px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredGuests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <FiUserPlus className="w-12 h-12 text-gray-300" />
                          <p className="font-medium">No guests found</p>
                          <p className="text-sm">Try adjusting your search or filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredGuests.map((guest, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-900">{guest.name}</td>
                        <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-600">{guest.email}</td>
                        <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-600">{guest.phone}</td>
                        <td className="py-3 px-3 sm:px-4 text-center">
                          <span
                            className={`inline-flex px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                              guest.rsvpStatus === "Accepted"
                                ? "bg-green-100 text-green-700"
                                : guest.rsvpStatus === "Pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {guest.rsvpStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3 sm:px-4">
                          <div className="flex gap-1.5 justify-center items-center flex-wrap">
                            <button
                              className="bg-blue-50 text-blue-600 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors flex items-center gap-1 whitespace-nowrap"
                              onClick={() => handleEditGuest(guest)}
                            >
                              <FiEdit2 className="w-3 h-3" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button
                              className="bg-red-50 text-red-600 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors flex items-center gap-1 whitespace-nowrap"
                              onClick={() => handleRemoveGuest(guest._id)}
                            >
                              <FiTrash2 className="w-3 h-3" />
                              <span className="hidden sm:inline">Remove</span>
                            </button>
                            {guest.rsvpStatus === "Pending" && (
                              <button
                                className="bg-purple-50 text-purple-600 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-purple-100 transition-colors flex items-center gap-1 whitespace-nowrap"
                                onClick={() => handleRemindGuest(guest._id)}
                              >
                                <FiBell className="w-3 h-3" />
                                <span className="hidden sm:inline">Remind</span>
                              </button>
                            )}
                            {guest.rsvpStatus === "Declined" && (
                              <button
                                className="bg-gray-50 text-gray-600 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors flex items-center gap-1 whitespace-nowrap"
                                onClick={() => handleReinviteGuest(guest._id)}
                              >
                                <FiMail className="w-3 h-3" />
                                <span className="hidden sm:inline">Re-invite</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-700">RSVP Progress</h4>
              <p className="text-xs sm:text-sm text-gray-600">
                <span className="font-semibold text-teal-600">{acceptedCount}</span> / {guests.length} accepted
              </p>
            </div>
            <div className="bg-gray-200 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 to-cyan-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${acceptanceRate}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{acceptanceRate.toFixed(1)}% acceptance rate</p>
          </section>
        </section>
      </div>

      {/* AddGuestsModal */}
      {showAddGuestsModal && (
        <AddGuestsModal
          onClose={() => setShowAddGuestsModal(false)}
          eventId={eventId}
          onGuestsAdded={(newGuests) => {
            setGuests([...guests, ...newGuests])
            if (onAddGuests) onAddGuests(newGuests)
          }}
        />
      )}

      {/* EditGuestModal */}
      {showEditModal && editingGuest && (
        <EditGuestModal guest={editingGuest} onClose={() => setShowEditModal(false)} onSave={handleUpdateGuest} />
      )}
    </>
  )
}
