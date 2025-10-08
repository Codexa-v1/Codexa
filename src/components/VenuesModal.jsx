"use client"

import { useState, useEffect } from "react"
import NewVenueModal from "@/components/AddVenuesModal"
import EditVenueModal from "@/components/EditVenueModal"
import { getVenues, deleteVenue } from "@/backend/api/EventVenue"
import { getEvent } from "@/backend/api/EventData"
import {
  FiX,
  FiPlus,
  FiRefreshCw,
  FiMapPin,
  FiPhone,
  FiMail,
  FiUsers,
  FiDollarSign,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi"

export default function VenuesModal({ eventId, onClose, onVenuesUpdated }) {
  const [venues, setVenues] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCapacity, setFilterCapacity] = useState("All")
  const [showNewVenueModal, setShowNewVenueModal] = useState(false)
  const [editingVenue, setEditingVenue] = useState(null)
  const [loading, setLoading] = useState(false)
  const [eventBudget, setEventBudget] = useState(0)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  useEffect(() => {
    if (!eventId) return
    const fetchEvent = async () => {
      try {
        const event = await getEvent(eventId)
        setEventBudget(event.budget || 0)
      } catch (err) {
        console.error("Error fetching event:", err)
        setEventBudget(0)
      }
    }
    fetchEvent()
  }, [eventId])

  useEffect(() => {
    if (!eventId) return
    const fetchVenues = async () => {
      setLoading(true)
      try {
        const data = await getVenues(eventId)
        setVenues(data)
      } catch (err) {
        console.error("Error fetching venues:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchVenues()
  }, [eventId, showNewVenueModal, editingVenue])

  const filteredVenues = venues.filter((venue) => {
    const matchesCapacity =
      filterCapacity === "All" ||
      (filterCapacity === "Small" && venue.capacity < 50) ||
      (filterCapacity === "Medium" && venue.capacity >= 50 && venue.capacity < 200) ||
      (filterCapacity === "Large" && venue.capacity >= 200)

    const matchesSearch =
      venue.venueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.venueAddress?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesCapacity && matchesSearch
  })

  const handleRemoveVenue = async (venueId) => {
    try {
      await deleteVenue(eventId, venueId)
      const updatedVenues = venues.filter((v) => v._id !== venueId)
      setVenues(updatedVenues)
      if (onVenuesUpdated) onVenuesUpdated(updatedVenues)
      setShowDeleteConfirm(null)
    } catch (err) {
      console.error("Failed to delete venue:", err)
    }
  }

  const handleRefresh = async () => {
    setLoading(true)
    try {
      const data = await getVenues(eventId)
      setVenues(data)
    } catch (err) {
      console.error("Error refreshing venues:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <section className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full relative max-h-[90vh] overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiMapPin className="text-white text-2xl" />
              <h3 className="text-2xl font-bold text-white">Venues</h3>
            </div>
            <button className="text-white hover:bg-white/20 rounded-full p-2 transition-colors" onClick={onClose}>
              <FiX className="text-2xl" />
            </button>
          </div>

          <section className="px-8 py-6 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Search by name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
              <select
                value={filterCapacity}
                onChange={(e) => setFilterCapacity(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all md:w-48"
              >
                <option value="All">All Capacities</option>
                <option value="Small">Small (&lt;50)</option>
                <option value="Medium">Medium (50–199)</option>
                <option value="Large">Large (200+)</option>
              </select>
              <button
                className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-3 rounded-xl hover:from-teal-700 hover:to-teal-800 font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                type="button"
                onClick={() => setShowNewVenueModal(true)}
              >
                <FiPlus className="text-lg" />
                Add Venue
              </button>
              <button
                className="bg-white border-2 border-teal-600 text-teal-600 px-6 py-3 rounded-xl hover:bg-teal-50 font-semibold transition-all flex items-center justify-center gap-2"
                type="button"
                onClick={handleRefresh}
                disabled={loading}
              >
                <FiRefreshCw className={`text-lg ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </section>

          <section className="flex-1 overflow-y-auto px-8 py-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <FiRefreshCw className="text-teal-600 text-4xl animate-spin" />
              </div>
            ) : filteredVenues.length === 0 ? (
              <div className="text-center py-12">
                <FiMapPin className="text-gray-300 text-6xl mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No venues found for this event.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVenues.map((venue, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between relative bg-white hover:border-teal-300"
                  >
                    <span
                      className={`absolute top-4 right-4 text-xs font-semibold px-3 py-1.5 rounded-full ${
                        venue.venueStatus === "Contacted" ? "bg-teal-100 text-teal-700" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {venue.venueStatus || "Not Contacted"}
                    </span>

                    <div className="mb-4 pr-24">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{venue.venueName}</h3>
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <FiMapPin className="mt-0.5 flex-shrink-0" />
                        <p>{venue.venueAddress}</p>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm text-gray-700 mb-6">
                      <div className="flex items-center gap-2">
                        <FiPhone className="text-teal-600" />
                        <span className="font-medium">Phone:</span>
                        <span>{venue.venuePhone || "-"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMail className="text-teal-600" />
                        <span className="font-medium">Email:</span>
                        <span className="truncate">{venue.venueEmail || "-"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiUsers className="text-teal-600" />
                        <span className="font-medium">Capacity:</span>
                        <span>{venue.capacity || "-"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiDollarSign className="text-teal-600" />
                        <span className="font-medium">Cost:</span>
                        <span className="font-semibold text-teal-700">
                          {venue.venueCost != null ? `R ${venue.venueCost.toLocaleString()}` : "-"}
                        </span>
                      </div>
                      {venue.notes && (
                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-xs text-gray-600 italic">{venue.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        onClick={() => setEditingVenue(venue)}
                      >
                        <FiEdit2 />
                        Edit
                      </button>
                      <button
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        onClick={() => setShowDeleteConfirm(venue._id)}
                      >
                        <FiTrash2 />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </section>
      </section>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <FiTrash2 className="text-red-600 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Venue?</h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to remove this venue? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-all shadow-lg"
                onClick={() => handleRemoveVenue(showDeleteConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewVenueModal && (
        <NewVenueModal
          eventId={eventId}
          onClose={() => setShowNewVenueModal(false)}
          onVenuesUpdated={(updatedVenues) => {
            setVenues(updatedVenues)
            if (onVenuesUpdated) onVenuesUpdated(updatedVenues)
          }}
        />
      )}

      {editingVenue && (
        <EditVenueModal
          venue={editingVenue}
          eventId={eventId}
          eventBudget={eventBudget}
          onClose={() => setEditingVenue(null)}
          onSave={() => {
            setEditingVenue(null)
            handleRefresh()
          }}
        />
      )}
    </>
  )
}
