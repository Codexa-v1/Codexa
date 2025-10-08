"use client"

import { useState, useEffect } from "react"
import { eventColors } from "@/utils/eventColors"
import { FaCalendarPlus } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import Navbar from "@/components/Navbar"
import EventPopup from "@/components/EventPopup"
import dayjs from "dayjs"
import { useAuth0 } from "@auth0/auth0-react"
import { getAllEvents, deleteEvent } from "@/backend/api/EventData"

export default function EventsPage() {
  const { user, isAuthenticated, isLoading } = useAuth0()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [events, setEvents] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("All")
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [activeTab, setActiveTab] = useState("upcoming")
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated && user) {
      getAllEvents(user.sub)
        .then((data) => setEvents(data))
        .catch((err) => console.error(err))
    }
  }, [isAuthenticated, user])

  const eventCategories = ["All", ...Array.from(new Set(events.map((e) => e.category)))]

  const filteredEvents = events.filter((event) => {
    const matchesType = filterType === "All" || event.category === filterType
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesSearch
  })

  const upcomingEvents = filteredEvents.filter(
    (event) => dayjs(event.date).isAfter(dayjs(), "day") || dayjs(event.date).isSame(dayjs(), "day"),
  )

  const pastEvents = filteredEvents.filter((event) => dayjs(event.date).isBefore(dayjs(), "day"))

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id)
      setEvents((prev) => prev.filter((e) => e._id !== id))
      setConfirmDeleteId(null)
    } catch (err) {
      alert("Error cancelling event: " + err.message)
      setConfirmDeleteId(null)
    }
  }

  const getEventStatus = (date) => {
    const today = dayjs()
    const eventDate = dayjs(date)

    if (eventDate.isSame(today, "day")) return { text: "Ongoing", color: "bg-amber-500" }
    if (eventDate.isAfter(today, "day")) return { text: "Open", color: "bg-teal-600" }
    return { text: "Closed", color: "bg-slate-400" }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-100 flex items-center justify-center">
        <div className="text-teal-700 text-xl font-medium">Loading...</div>
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-100">
      <Navbar />
      <section className="p-6 md:p-8 max-w-7xl mx-auto min-h-screen font-sans w-full">
        {/* Header and Controls */}
        <section className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-10 gap-6">
          <h2 className="text-4xl font-bold text-teal-900 tracking-tight">All Events</h2>
          <section className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-teal-200 bg-white/80 backdrop-blur-sm 
                       focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                       shadow-sm hover:shadow-md transition-all duration-200 placeholder:text-slate-400"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-teal-200 bg-white/80 backdrop-blur-sm 
                       focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                       shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              {eventCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <button
              className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-2.5 
                       flex items-center justify-center gap-2 rounded-xl font-medium
                       hover:from-teal-700 hover:to-teal-800 shadow-lg hover:shadow-xl 
                       transform hover:-translate-y-0.5 transition-all duration-200"
              onClick={() => setIsModalOpen(true)}
            >
              <FaCalendarPlus className="text-lg" />
              Add New Event
            </button>
          </section>
        </section>

        {/* Tabs */}
        <section className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === "upcoming"
                ? "bg-teal-600 text-white shadow-lg shadow-teal-200"
                : "bg-white/60 backdrop-blur-sm text-teal-700 hover:bg-white/80 shadow-sm"
            }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === "past"
                ? "bg-teal-600 text-white shadow-lg shadow-teal-200"
                : "bg-white/60 backdrop-blur-sm text-teal-700 hover:bg-white/80 shadow-sm"
            }`}
          >
            Past Events
          </button>
        </section>

        {/* Events Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === "upcoming" ? upcomingEvents : pastEvents).length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="text-slate-500 text-lg">No events found.</p>
            </div>
          ) : (
            (activeTab === "upcoming" ? upcomingEvents : pastEvents).map((event) => {
              const { bgColor, labelColor } = eventColors[event.category] || eventColors.Other
              const status = getEventStatus(event.date)

              return (
                <div
                  key={event._id}
                  className={`${bgColor} p-6 rounded-2xl shadow-lg flex flex-col justify-between 
                            transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl
                            border border-white/20 backdrop-blur-sm`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span
                      className={`${labelColor} text-white px-3 py-1.5 rounded-full text-xs font-semibold
                                shadow-md`}
                    >
                      {event.category}
                    </span>
                    <span
                      className={`${status.color} text-white px-3 py-1.5 rounded-full text-xs font-semibold
                                shadow-md`}
                    >
                      {status.text}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold mt-2 mb-2 text-slate-800 line-clamp-2">{event.title}</h4>
                  <p className="text-sm mb-1.5 text-slate-600 font-medium">
                    {dayjs(event.date).format("DD MMM YYYY, HH:mm")}
                  </p>
                  <p className="text-sm mb-4 text-slate-600 line-clamp-1">{event.location}</p>

                  {/* Actions */}
                  <div className="flex gap-3 mt-auto pt-4 border-t border-white/30">
                    <button
                      className="flex-1 bg-teal-700 text-white px-4 py-2.5 rounded-xl font-medium
                               hover:bg-teal-800 shadow-md hover:shadow-lg
                               transform hover:-translate-y-0.5 transition-all duration-200"
                      onClick={() => navigate(`/events/${event._id}`)}
                    >
                      View Event
                    </button>
                    <button
                      className="flex-1 bg-red-500 text-white px-4 py-2.5 rounded-xl font-medium
                               hover:bg-red-600 shadow-md hover:shadow-lg
                               transform hover:-translate-y-0.5 transition-all duration-200"
                      onClick={() => setConfirmDeleteId(event._id)}
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Cancel Confirmation */}
                  {confirmDeleteId === event._id && (
                    <section className="fixed inset-0 flex items-center justify-center z-50 p-4">
                      <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setConfirmDeleteId(null)}
                      ></div>
                      <div
                        className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full relative z-10
                                    border-2 border-red-100 animate-in fade-in zoom-in duration-200"
                      >
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-red-700 text-2xl font-bold mb-3">Cancel Event?</h3>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                          Are you sure you want to cancel this event? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                          <button
                            className="flex-1 bg-red-600 text-white px-6 py-3 rounded-xl font-medium
                                     hover:bg-red-700 shadow-lg hover:shadow-xl
                                     transform hover:-translate-y-0.5 transition-all duration-200"
                            onClick={() => handleDelete(confirmDeleteId)}
                          >
                            Yes, Cancel Event
                          </button>
                          <button
                            className="flex-1 bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-medium
                                     hover:bg-slate-300 shadow-md hover:shadow-lg
                                     transform hover:-translate-y-0.5 transition-all duration-200"
                            onClick={() => setConfirmDeleteId(null)}
                          >
                            Go Back
                          </button>
                        </div>
                      </div>
                    </section>
                  )}
                </div>
              )
            })
          )}
        </section>

        {/* Modal */}
        {isModalOpen && (
          <>
            <section
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsModalOpen(false)}
            ></section>
            <section className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <EventPopup onClose={() => setIsModalOpen(false)} />
            </section>
          </>
        )}
      </section>
    </section>
  )
}
