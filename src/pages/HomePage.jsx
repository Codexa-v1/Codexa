"use client"

import { FaCalendarPlus } from "react-icons/fa"
import { useAuth0 } from "@auth0/auth0-react"
import Navbar from "@/components/Navbar"
import Calendar from "@/components/CalendarBox"
import EventPopup from "@/components/EventPopup"
import EventCard from "@/components/EventCard"
import { useEffect, useState } from "react"
import { getAllEvents, deleteEvent } from "@/backend/api/EventData" // Updated import
import dayjs from "dayjs"
import { useNavigate } from "react-router-dom"

const HomePage = () => {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
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

  // When a day is clicked in the calendar
  const handleDayClick = (date) => {
    setSelectedDate(date)
    setIsModalOpen(true)
  }

  // Filter only upcoming events
  const upcomingEvents = events.filter(
    (event) => dayjs(event.date).isAfter(dayjs(), "day") || dayjs(event.date).isSame(dayjs(), "day"),
  )

  // Delete event and refresh list
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
    <section className="home-page min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-100">
      <Navbar />
      <section className="p-4 sm:p-6 lg:p-8 min-h-screen font-sans">
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-teal-900 tracking-tight">Welcome back, {user?.name}!</h2>
          <button
            className="bg-teal-800 text-white px-5 py-2.5 flex items-center gap-2 rounded-lg hover:bg-teal-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
            onClick={() => setIsModalOpen(true)}
          >
            <FaCalendarPlus className="text-lg" />
            Add New Event
          </button>
        </section>

        {/* Modal with overlay */}
        {isModalOpen && (
          <>
            <section
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
              onClick={() => setIsModalOpen(false)}
            ></section>
            <section className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <EventPopup onClose={() => setIsModalOpen(false)} selectedDate={selectedDate} />
            </section>
          </>
        )}

        <section className="flex gap-6 flex-col lg:flex-row">
          {/* Calendar */}
          <section className="flex-[1.3] bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Calendar onDayClick={handleDayClick} />
          </section>

          <section className="flex-[0.7] bg-white p-5 sm:p-6 rounded-xl shadow-lg">
            <h3 className="mb-4 text-2xl font-bold text-center text-teal-900 tracking-tight">Upcoming Events</h3>
            <div className="space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents
                  .slice(0, 3)
                  .map((event, index) => (
                    <EventCard key={index} event={event} setConfirmDeleteId={setConfirmDeleteId} />
                  ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No upcoming events.</p>
                  <p className="text-gray-400 text-sm mt-2">Create your first event to get started!</p>
                </div>
              )}
            </div>

            {upcomingEvents.length > 3 && (
              <button
                className="mt-4 w-full bg-teal-700 text-white py-2.5 rounded-lg hover:bg-teal-800 font-semibold transition-colors duration-200 shadow-sm hover:shadow-md"
                onClick={() => navigate("/events")}
              >
                See more...
              </button>
            )}
          </section>
        </section>

        {confirmDeleteId && (
          <>
            <section
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
              onClick={() => setConfirmDeleteId(null)}
            ></section>
            <section className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 text-center max-w-md w-full border-2 border-red-100">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-red-700 text-2xl font-bold mb-3">Cancel Event?</h3>
                <p className="mb-6 text-gray-600 leading-relaxed">
                  Are you sure you want to cancel this event? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 font-semibold transition-colors duration-200 shadow-sm hover:shadow-md"
                    onClick={() => handleDelete(confirmDeleteId)}
                  >
                    Yes, Cancel
                  </button>
                  <button
                    className="bg-gray-200 text-gray-800 px-6 py-2.5 rounded-lg hover:bg-gray-300 font-semibold transition-colors duration-200"
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
