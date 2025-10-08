"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiCheckCircle,
  FiUser,
  FiMail,
  FiPhone,
} from "react-icons/fi"
import { AiOutlineLoading } from "react-icons/ai"

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL

export default function InvitePage() {
  const { eventId } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  const [guestData, setGuestData] = useState({
    name: "",
    email: "",
    phone: "",
    rsvpStatus: "Pending",
    dietaryPreferences: "",
  })

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/events/${eventId}`)
        if (!res.ok) throw new Error("Failed to load event")
        const data = await res.json()
        setEvent(data)
      } catch (err) {
        console.error("Failed to load event", err)
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [eventId])

  const handleChange = (e) => {
    setGuestData({
      ...guestData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/guests/event/${eventId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...guestData, eventId }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        if (res.status === 400 && errorText.includes("duplicate key")) {
          alert("This email has already RSVP'd for the event.")
        } else {
          alert("Failed to submit RSVP")
        }
        return
      }

      setSuccess(true)
    } catch (err) {
      console.error(err)
      alert("Failed to submit RSVP")
    } finally {
      setSubmitting(false)
    }
  }

  const formatDateOnly = (isoString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(isoString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <AiOutlineLoading className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-teal-700 font-medium">Loading invitation...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-100 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <p className="text-gray-700 text-lg">Event not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {success ? (
          // Success screen
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center backdrop-blur-sm bg-white/90">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FiCheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              RSVP Confirmed!
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed">
              Thank you for confirming your attendance for{" "}
              <span className="font-semibold text-teal-700">{event.title}</span>. We look forward to seeing you there!
            </p>
          </div>
        ) : (
          // RSVP Form screen
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm bg-white/90">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-8 md:p-10 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">You're Invited!</h1>
              <p className="text-2xl font-semibold text-teal-50">{event.title}</p>
            </div>

            {/* Event Details */}
            <div className="p-8 md:p-10 space-y-4 border-b border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiCalendar className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Date</p>
                  <p className="text-gray-900 font-semibold">
                    {formatDateOnly(event.date)} - {formatDateOnly(event.endDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiClock className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Time</p>
                  <p className="text-gray-900 font-semibold">
                    {event.startTime} - {event.endTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Location</p>
                  <p className="text-gray-900 font-semibold">{event.location}</p>
                </div>
              </div>
            </div>

            {/* RSVP Form */}
            <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Please RSVP</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiUser className="inline w-4 h-4 mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={guestData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiMail className="inline w-4 h-4 mr-2" />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  value={guestData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiPhone className="inline w-4 h-4 mr-2" />
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={guestData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dietary Preferences (Optional)
                </label>
                <input
                  type="text"
                  name="dietaryPreferences"
                  placeholder="e.g., Vegetarian, Gluten-free, etc."
                  value={guestData.dietaryPreferences}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>

              {/* RSVP Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Will you attend? *</label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-3 px-6 py-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-teal-500 transition-all has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50">
                    <input
                      type="radio"
                      name="rsvpStatus"
                      value="Accepted"
                      checked={guestData.rsvpStatus === "Accepted"}
                      onChange={handleChange}
                      className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-teal-700 font-semibold">Accept</span>
                  </label>

                  <label className="flex items-center gap-3 px-6 py-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-red-500 transition-all has-[:checked]:border-red-500 has-[:checked]:bg-red-50">
                    <input
                      type="radio"
                      name="rsvpStatus"
                      value="Declined"
                      checked={guestData.rsvpStatus === "Declined"}
                      onChange={handleChange}
                      className="w-4 h-4 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-red-700 font-semibold">Decline</span>
                  </label>

                  <label className="flex items-center gap-3 px-6 py-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-amber-500 transition-all has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50">
                    <input
                      type="radio"
                      name="rsvpStatus"
                      value="Pending"
                      checked={guestData.rsvpStatus === "Pending"}
                      onChange={handleChange}
                      className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-amber-700 font-semibold">Maybe</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <AiOutlineLoading className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit RSVP"
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
