"use client"

import { FaCalendarPlus } from "react-icons/fa"
import { useAuth0 } from "@auth0/auth0-react"
import Navbar from "@/components/Navbar"
import Calendar from "@/components/CalendarBox"
import EventPopup from "@/components/EventPopup"
import EventCard from "@/components/EventCard"
import AIEventGeneratorModal from "@/components/AIEventGeneratorModal"
import { useEffect, useState } from "react"
import { getAllEvents, deleteEvent } from "@/backend/api/EventData"
import dayjs from "dayjs"
import { useNavigate } from "react-router-dom"
import { FiCalendar, FiClock, FiCheckCircle, FiTrendingUp } from "react-icons/fi"

const HomePage = () => {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAIModalOpen, setIsAIModalOpen] = useState(false)
  const { user, isAuthenticated } = useAuth0()
  const [events, setEvents] = useState([])
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    if (isAuthenticated && user) {
      getAllEvents(user.sub)
        .then((data) => setEvents(data))
        .catch((err) => console.error("Failed to fetch events:", err))
    }
  }, [isAuthenticated, user])

  const handleDayClick = (date) => {
    setSelectedDate(date)
    setIsModalOpen(true)
  }

  const handleEventCreated = () => {
    if (isAuthenticated && user) {
      getAllEvents(user.sub)
        .then((data) => setEvents(data))
        .catch((err) => console.error("Failed to fetch events:", err))
    }
  }

  const upcomingEvents = events.filter(
    (event) => dayjs(event.date).isAfter(dayjs(), "day") || dayjs(event.date).isSame(dayjs(), "day"),
  )

  const pastEvents = events.filter((event) => dayjs(event.date).isBefore(dayjs(), "day"))

  const eventsThisMonth = events.filter(
    (event) => dayjs(event.date).month() === dayjs().month() && dayjs(event.date).year() === dayjs().year(),
  )

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

  return (
    <section className="home-page min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50">
      <Navbar />
      <section className="p-4 sm:p-6 lg:p-10 min-h-screen font-sans">
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <h2 className="text-3xl lg:text-5xl font-bold text-teal-900 tracking-tight">
            Welcome back, <span className="text-teal-700">{user?.name}</span>!
          </h2>
          <div className="flex gap-3 flex-wrap">
            <button
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 flex items-center gap-2.5 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-base"
              onClick={() => setIsAIModalOpen(true)}
            >
              AI Generate Event
            </button>
            <button
              className="bg-teal-700 text-white px-6 py-3 flex items-center gap-2.5 rounded-xl hover:bg-teal-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-base"
              onClick={() => setIsModalOpen(true)}
            >
              <FaCalendarPlus className="text-lg" />
              Add New Event
            </button>
          </div>
        </section>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
          {/* Total Events */}
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center backdrop-blur-sm">
                <FiCalendar className="text-lg sm:text-2xl text-white" />
              </div>
              <span className="text-teal-100 text-xs sm:text-sm font-medium hidden sm:inline">Total</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-bold text-white mb-0.5 sm:mb-1">{events.length}</h3>
            <p className="text-teal-100 text-xs sm:text-sm font-medium">Total Events</p>
          </div>

          {/* Upcoming Events */}
          <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center backdrop-blur-sm">
                <FiClock className="text-lg sm:text-2xl text-white" />
              </div>
              <span className="text-cyan-100 text-xs sm:text-sm font-medium hidden sm:inline">Upcoming</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-bold text-white mb-0.5 sm:mb-1">{upcomingEvents.length}</h3>
            <p className="text-cyan-100 text-xs sm:text-sm font-medium">Upcoming</p>
          </div>

          {/* Past Events */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center backdrop-blur-sm">
                <FiCheckCircle className="text-lg sm:text-2xl text-white" />
              </div>
              <span className="text-emerald-100 text-xs sm:text-sm font-medium hidden sm:inline">Completed</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-bold text-white mb-0.5 sm:mb-1">{pastEvents.length}</h3>
            <p className="text-emerald-100 text-xs sm:text-sm font-medium">Past Events</p>
          </div>

          {/* This Month */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center backdrop-blur-sm">
                <FiTrendingUp className="text-lg sm:text-2xl text-white" />
              </div>
              <span className="text-blue-100 text-xs sm:text-sm font-medium hidden sm:inline">This Month</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-bold text-white mb-0.5 sm:mb-1">{eventsThisMonth.length}</h3>
            <p className="text-blue-100 text-xs sm:text-sm font-medium">This Month</p>
          </div>
        </section>

        {/* Modal with overlay */}
        {isModalOpen && (
          <>
            <section
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-200"
              onClick={() => setIsModalOpen(false)}
            ></section>
            <section className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <EventPopup onClose={() => setIsModalOpen(false)} selectedDate={selectedDate} />
            </section>
          </>
        )}

        {/* AI Event Generator Modal */}
        {isAIModalOpen && (
          <AIEventGeneratorModal onClose={() => setIsAIModalOpen(false)} onEventCreated={handleEventCreated} />
        )}

        <section className="flex gap-6 flex-col lg:flex-row">
          {/* Calendar */}
          <section className="flex-[1.3] bg-white p-5 sm:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
            <Calendar onDayClick={handleDayClick} />
          </section>

          {/* Upcoming Events */}
          <section className="flex-[0.7] bg-white p-6 sm:p-7 rounded-2xl shadow-xl border border-gray-100">
            <h3 className="mb-5 text-2xl sm:text-3xl font-bold text-center text-teal-900 tracking-tight">
              Upcoming Events
            </h3>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents
                  .slice(0, 3)
                  .map((event, index) => (
                    <EventCard key={index} event={event} setConfirmDeleteId={setConfirmDeleteId} />
                  ))
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCalendarPlus className="text-4xl text-teal-300" />
                  </div>
                  <p className="text-gray-600 text-lg font-medium">No upcoming events.</p>
                  <p className="text-gray-400 text-sm mt-2">Create your first event to get started!</p>
                </div>
              )}
            </div>

            {upcomingEvents.length > 3 && (
              <button
                className="mt-5 w-full bg-teal-700 text-white py-3 rounded-xl hover:bg-teal-800 font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                onClick={() => navigate("/events")}
              >
                See more...
              </button>
            )}
          </section>
        </section>

        {/* Delete Confirmation Modal */}
        {confirmDeleteId && (
          <>
            <section
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-200"
              onClick={() => setConfirmDeleteId(null)}
            ></section>
            <section className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full border-2 border-red-100 animate-in zoom-in duration-200">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-red-700 text-2xl font-bold mb-3">Cancel Event?</h3>
                <p className="mb-7 text-gray-600 leading-relaxed">
                  Are you sure you want to cancel this event? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    className="bg-red-600 text-white px-7 py-3 rounded-xl hover:bg-red-700 font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                    onClick={() => handleDelete(confirmDeleteId)}
                  >
                    Yes, Cancel
                  </button>
                  <button
                    className="bg-gray-200 text-gray-800 px-7 py-3 rounded-xl hover:bg-gray-300 font-semibold transition-all duration-200 shadow-sm"
                    onClick={() => setConfirmDeleteId(null)}
                  >
                    No, Go Back
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </section>
    </section>
  )
}

export default HomePage
