"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { FiCalendar, FiClock, FiMapPin, FiCheck, FiX, FiHelpCircle } from "react-icons/fi"
import { AiOutlineLoading } from "react-icons/ai"

const RSVPPage = () => {
  const params = useParams()
  const eventId = params?.eventId
  const guestId = params?.guestId

  const [rsvpStatus, setRsvpStatus] = useState("")
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState("")
  const [confirming, setConfirming] = useState(false)
  const [notification, setNotification] = useState(null)

  const API_URL = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const eventRes = await fetch(`${API_URL}/api/events/${eventId}`)
        const eventData = await eventRes.json()
        setEvent(eventData)

        const guestsRes = await fetch(`${API_URL}/api/guests/event/${eventId}`)
        const guestsData = await guestsRes.json()
        const guest = guestsData.find((g) => g._id === guestId)

        if (!guest) {
          throw new Error("Guest not found")
        }

        setRsvpStatus(guest.rsvpStatus)
        setSelectedStatus(guest.rsvpStatus)
      } catch (err) {
        showNotification("Failed to load event details", "error")
      } finally {
        setLoading(false)
      }
    }

    if (eventId && guestId) {
      fetchData()
    }
  }, [eventId, guestId])

  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleChange = (status) => {
    setSelectedStatus(status)
  }

  const handleConfirm = async () => {
    if (!selectedStatus) return

    setConfirming(true)
    try {
      const response = await fetch(`${API_URL}/api/guests/event/${eventId}/guest/${guestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rsvpStatus: selectedStatus }),
      })

      if (!response.ok) throw new Error("Failed to update RSVP")

      setRsvpStatus(selectedStatus)
      showNotification("RSVP updated successfully!", "success")
    } catch (err) {
      showNotification("Failed to update RSVP. Please try again.", "error")
    } finally {
      setConfirming(false)
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
          <p className="text-teal-700 font-medium">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <FiX className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-600">Unable to load event details. Please check your invitation link.</p>
        </div>
      </div>
    )
  }

  const statusOptions = [
    {
      value: "Accepted",
      label: "Accept",
      icon: FiCheck,
      color: "teal",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-500",
      textColor: "text-teal-700",
      hoverBg: "hover:bg-teal-100",
    },
    {
      value: "Declined",
      label: "Decline",
      icon: FiX,
      color: "red",
      bgColor: "bg-red-50",
      borderColor: "border-red-500",
      textColor: "text-red-700",
      hoverBg: "hover:bg-red-100",
    },
    {
      value: "Pending",
      label: "Maybe",
      icon: FiHelpCircle,
      color: "amber",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-500",
      textColor: "text-amber-700",
      hoverBg: "hover:bg-amber-100",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-100 py-12 px-4">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
          <div
            className={`rounded-xl shadow-2xl p-4 flex items-center gap-3 ${
              notification.type === "success" ? "bg-teal-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            {notification.type === "success" ? <FiCheck className="w-5 h-5" /> : <FiX className="w-5 h-5" />}
            <p className="font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {/* Event Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">You're Invited!</h1>
            <p className="text-teal-50 text-lg">{event.title}</p>
          </div>

          {/* Event Details */}
          <div className="p-8">
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <FiCalendar className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date</p>
                  <p className="text-gray-900 font-semibold">
                    {formatDateOnly(event.date)} - {formatDateOnly(event.endDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <FiClock className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Time</p>
                  <p className="text-gray-900 font-semibold">
                    {event.startTime} - {event.endTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="text-gray-900 font-semibold">{event.location}</p>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600">
                Current RSVP Status: <span className="font-bold text-gray-900">{rsvpStatus || "Not Responded"}</span>
              </p>
            </div>

            {/* RSVP Options */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Will you be attending?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {statusOptions.map((option) => {
                  const Icon = option.icon
                  const isSelected = selectedStatus === option.value

                  return (
                    <button
                      key={option.value}
                      onClick={() => handleChange(option.value)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? `${option.borderColor} ${option.bgColor} shadow-lg scale-105`
                          : `border-gray-200 bg-white ${option.hoverBg} hover:shadow-md`
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Icon className={`w-8 h-8 ${isSelected ? option.textColor : "text-gray-400"}`} />
                        <span className={`font-semibold ${isSelected ? option.textColor : "text-gray-600"}`}>
                          {option.label}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirm}
              disabled={confirming || !selectedStatus}
              className="w-full py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {confirming ? (
                <>
                  <AiOutlineLoading className="w-5 h-5 animate-spin" />
                  Confirming...
                </>
              ) : (
                <>
                  <FiCheck className="w-5 h-5" />
                  Confirm RSVP
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RSVPPage
