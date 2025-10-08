"use client"

import { GrClose } from "react-icons/gr"
import { useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { createEvent } from "@/backend/api/EventData.js"
import dayjs from "dayjs"
import { eventColors } from "@/utils/eventColors"

export default function EventPopup({ onClose, selectedDate }) {
  const todayStr = dayjs().format("YYYY-MM-DD")
  const { user } = useAuth0()

  const [category, setCategory] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [title, setTitle] = useState("")
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endDate, setEndDate] = useState("")
  const [endTime, setEndTime] = useState("")
  const [location, setLocation] = useState("")
  const [budget, setBudget] = useState("")
  const [capacity, setCapacity] = useState("")
  const [description, setDescription] = useState("")
  const [organizerName, setOrganizerName] = useState("")
  const [organizerContact, setOrganizerContact] = useState("")
  const [organizerEmail, setOrganizerEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleCreateEvent = async () => {
    if (!endDate) {
      setLoading(false)
      setError("End date is required.")
      return
    }
    if (startDate && dayjs(startDate).isBefore(todayStr)) {
      setLoading(false)
      setError("Start date cannot be in the past.")
      return
    }
    if (endDate && dayjs(endDate).isBefore(todayStr)) {
      setLoading(false)
      setError("End date cannot be in the past.")
      return
    }
    if (startDate && endDate && dayjs(endDate).isBefore(dayjs(startDate))) {
      setLoading(false)
      setError("End date cannot be before start date.")
      return
    }
    if (startDate === endDate && startTime && endTime && endTime <= startTime) {
      setLoading(false)
      setError("End time must be after start time if dates are the same.")
      return
    }
    setLoading(true)
    setError("")
    setSuccess(false)
    const startDateTime = startDate && startTime ? new Date(`${startDate}T${startTime}`) : null
    const endDateTime = endDate && endTime ? new Date(`${endDate}T${endTime}`) : null
    const eventPlanner = user?.sub || "demo@user.com"
    const eventData = {
      eventPlanner,
      title,
      date: startDateTime,
      endDate: endDateTime,
      location,
      budget,
      description,
      status: "Planning",
      capacity: capacity ? Number(capacity) : undefined,
      category: category === "other" ? newCategory : category,
      organizer: {
        name: organizerName,
        contact: organizerContact,
        email: organizerEmail,
      },
      startTime,
      endTime,
    }
    try {
      const res = await createEvent(eventData)
      setLoading(false)
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 2000)
    } catch (err) {
      setLoading(false)
      setError(err.message)
    }
  }

  return (
    <section>
      <section className="newEvent-wrapper z-1 bg-white p-6 sm:p-8 rounded-2xl shadow-2xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[85vh] overflow-y-auto border border-gray-100">
        <section className="newEvent space-y-5">
          <button
            className="absolute top-6 right-6 p-2 hover:bg-red-50 rounded-lg transition-colors duration-200 text-gray-600 hover:text-red-600"
            onClick={onClose}
          >
            <GrClose className="text-xl" />
          </button>

          <h2 className="text-3xl sm:text-4xl font-bold text-teal-800 text-center mb-6 tracking-tight">
            Add New Event
          </h2>

          {/* Category */}
          <section>
            <label htmlFor="category" className="block font-semibold text-gray-800 mb-2 text-sm">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              className="w-full border border-gray-300 rounded-lg p-3 mb-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {Object.keys(eventColors).map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            {category === "other" && (
              <input
                type="text"
                id="newCategory"
                placeholder="Add new category"
                className="w-full border border-gray-300 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                required
              />
            )}
          </section>

          {/* Event Title */}
          <section>
            <label htmlFor="title" className="block font-semibold text-gray-800 mb-2 text-sm">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              placeholder="Event Title"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </section>

          {/* Start & End Date & Time */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <section>
              <label htmlFor="startDate" className="block font-semibold text-gray-800 mb-2 text-sm">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                min={todayStr}
                value={selectedDate ? dayjs(selectedDate).format("YYYY-MM-DD") : startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </section>
            <section>
              <label htmlFor="startTime" className="block font-semibold text-gray-800 mb-2 text-sm">
                Start Time
              </label>
              <input
                type="time"
                id="startTime"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </section>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <section>
              <label htmlFor="endDate" className="block font-semibold text-gray-800 mb-2 text-sm">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                min={startDate ? startDate : todayStr}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </section>
            <section>
              <label htmlFor="endTime" className="block font-semibold text-gray-800 mb-2 text-sm">
                End Time
              </label>
              <input
                type="time"
                id="endTime"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </section>
          </section>

          {/* Location & Capacity */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <section>
              <label htmlFor="location" className="block font-semibold text-gray-800 mb-2 text-sm">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                placeholder="Location"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </section>
            <section>
              <label htmlFor="capacity" className="block font-semibold text-gray-800 mb-2 text-sm">
                Capacity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="capacity"
                placeholder="Capacity"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                value={capacity}
                min={1}
                inputMode="numeric"
                pattern="[0-9]*"
                onChange={(e) => {
                  const val = e.target.value
                  if (/^\d*$/.test(val)) setCapacity(val)
                }}
                required
              />
            </section>
          </section>

          <section>
            <label htmlFor="budget" className="block font-semibold text-gray-800 mb-2 text-sm">
              Budget <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="budget"
              placeholder="Budget"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
              value={budget}
              min={0}
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={(e) => {
                const val = e.target.value
                if (/^\d*$/.test(val)) setBudget(val)
              }}
              required
            />
          </section>

          {/* Description of Event */}
          <section>
            <label htmlFor="description" className="block font-semibold text-gray-800 mb-2 text-sm">
              Description of Event <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              placeholder="Description of the event..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 min-h-[100px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </section>

          {/* Event Organizer Details (optional) */}
          <section>
            <label className="block font-semibold text-gray-800 mb-2 text-sm">Event Organizer Details (optional)</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                id="organizerName"
                placeholder="Name"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                value={organizerName}
                onChange={(e) => setOrganizerName(e.target.value)}
              />
              <input
                type="text"
                id="organizerContact"
                placeholder="Contact Details"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                value={organizerContact}
                onChange={(e) => setOrganizerContact(e.target.value)}
              />
              <input
                type="email"
                id="organizerEmail"
                placeholder="Email"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                value={organizerEmail}
                onChange={(e) => setOrganizerEmail(e.target.value)}
              />
            </div>
          </section>

          {/* Submit Button */}
          <button
            className="bg-teal-700 text-white px-6 py-3.5 rounded-lg w-full hover:bg-teal-800 transition-all duration-200 font-semibold text-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleCreateEvent}
            disabled={loading}
          >
            {loading ? "Creating..." : "Add New Event"}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">{error}</div>
          )}

          {success && (
            <section className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm">
              <div className="bg-white border-2 border-teal-500 rounded-2xl shadow-2xl p-8 text-center max-w-md animate-in zoom-in duration-200">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-teal-700 text-2xl font-bold mb-2">Event Created Successfully!</h3>
                <p className="text-teal-600">Your event has been saved.</p>
              </div>
            </section>
          )}
        </section>
      </section>
    </section>
  )
}
