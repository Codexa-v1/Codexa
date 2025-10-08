"use client"

import { useState } from "react"
import { FiX, FiZap, FiEdit3, FiSave } from "react-icons/fi"
import { AiOutlineLoading } from "react-icons/ai"
import { useAuth0 } from "@auth0/auth0-react"
import { createEvent } from "@/backend/api/EventData.js"
import dayjs from "dayjs"

export default function AIEventGeneratorModal({ onClose, selectedDate }) {
  const { user } = useAuth0()
  const todayStr = dayjs().format("YYYY-MM-DD")

  const [prompt, setPrompt] = useState("")
  const [generating, setGenerating] = useState(false)
  const [generatedEvent, setGeneratedEvent] = useState(null)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  // Form state for editing generated event
  const [editedEvent, setEditedEvent] = useState(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please describe your event")
      return
    }

    setGenerating(true)
    setError("")
    setGeneratedEvent(null)

    try {
      const response = await fetch("/api/generate-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          startDate: selectedDate ? dayjs(selectedDate).format("YYYY-MM-DD") : null,
          endDate: null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate event")
      }

      const data = await response.json()
      setGeneratedEvent(data.event)
      setEditedEvent(data.event)
    } catch (err) {
      setError(err.message || "Failed to generate event. Please try again.")
    } finally {
      setGenerating(false)
    }
  }

  const handleCreateEvent = async () => {
    if (!editedEvent) return

    setSaving(true)
    setError("")

    const startDate = selectedDate
      ? dayjs(selectedDate).format("YYYY-MM-DD")
      : dayjs().add(1, "day").format("YYYY-MM-DD")
    const endDate = startDate // Default to same day, user can edit later

    const startDateTime = new Date(`${startDate}T${editedEvent.startTime}`)
    const endDateTime = new Date(`${endDate}T${editedEvent.endTime}`)

    const eventData = {
      eventPlanner: user?.sub || "demo@user.com",
      title: editedEvent.title,
      date: startDateTime,
      endDate: endDateTime,
      location: editedEvent.location,
      budget: editedEvent.budget,
      description: editedEvent.description,
      status: "Planning",
      capacity: editedEvent.capacity,
      category: editedEvent.category,
      organizer: {
        name: editedEvent.organizerName || "",
        contact: editedEvent.organizerContact || "",
        email: editedEvent.organizerEmail || "",
      },
      startTime: editedEvent.startTime,
      endTime: editedEvent.endTime,
    }

    try {
      await createEvent(eventData)
      setSaving(false)
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
        window.location.reload() // Refresh to show new event
      }, 2000)
    } catch (err) {
      setSaving(false)
      setError(err.message || "Failed to create event")
    }
  }

  return (
    <>
      <section
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={onClose}
      ></section>

      <section className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[85vh] overflow-y-auto z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-2xl relative">
            <button
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 text-white"
              onClick={onClose}
            >
              <FiX className="text-xl" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <FiZap className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">AI Event Generator</h2>
                <p className="text-purple-100 text-sm mt-1">Describe your event and let AI do the planning</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Prompt Input */}
            {!generatedEvent && (
              <div className="space-y-4">
                <label className="block font-semibold text-gray-800 text-sm">Describe Your Event</label>
                <textarea
                  className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 min-h-[120px] resize-none"
                  placeholder="Example: Create a birthday party for my daughter's 10th birthday next Saturday. We're expecting about 50 kids and adults. Budget around $2000. Include games, food, and entertainment."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={generating}
                />

                <button
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-full justify-center"
                  onClick={handleGenerate}
                  disabled={generating || !prompt.trim()}
                >
                  {generating ? (
                    <>
                      <AiOutlineLoading className="animate-spin text-xl" />
                      Generating Event...
                    </>
                  ) : (
                    <>
                      <FiZap className="text-lg" />
                      Generate Event with AI
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Generated Event Preview/Edit */}
            {generatedEvent && editedEvent && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <FiEdit3 className="text-purple-600" />
                    Review & Edit Event Details
                  </h3>
                  <button
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                    onClick={() => {
                      setGeneratedEvent(null)
                      setEditedEvent(null)
                      setPrompt("")
                    }}
                  >
                    Start Over
                  </button>
                </div>

                {/* Editable Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-2 text-sm">Title</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      value={editedEvent.title}
                      onChange={(e) => setEditedEvent({ ...editedEvent, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-2 text-sm">Category</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      value={editedEvent.category}
                      onChange={(e) => setEditedEvent({ ...editedEvent, category: e.target.value })}
                    >
                      <option value="wedding">Wedding</option>
                      <option value="birthday">Birthday</option>
                      <option value="corporate">Corporate</option>
                      <option value="conference">Conference</option>
                      <option value="party">Party</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-2 text-sm">Location</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      value={editedEvent.location}
                      onChange={(e) => setEditedEvent({ ...editedEvent, location: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-2 text-sm">Capacity</label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      value={editedEvent.capacity}
                      onChange={(e) => setEditedEvent({ ...editedEvent, capacity: Number.parseInt(e.target.value) })}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-2 text-sm">Budget</label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      value={editedEvent.budget}
                      onChange={(e) => setEditedEvent({ ...editedEvent, budget: Number.parseInt(e.target.value) })}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-2 text-sm">Start Time</label>
                    <input
                      type="time"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      value={editedEvent.startTime}
                      onChange={(e) => setEditedEvent({ ...editedEvent, startTime: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-2 text-sm">End Time</label>
                    <input
                      type="time"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      value={editedEvent.endTime}
                      onChange={(e) => setEditedEvent({ ...editedEvent, endTime: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">Description</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[100px]"
                    value={editedEvent.description}
                    onChange={(e) => setEditedEvent({ ...editedEvent, description: e.target.value })}
                  />
                </div>

                {/* Organizer Details */}
                <div className="border-t pt-4">
                  <label className="block font-semibold text-gray-700 mb-3 text-sm">Organizer Details (Optional)</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Name"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      value={editedEvent.organizerName || ""}
                      onChange={(e) => setEditedEvent({ ...editedEvent, organizerName: e.target.value })}
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      value={editedEvent.organizerEmail || ""}
                      onChange={(e) => setEditedEvent({ ...editedEvent, organizerEmail: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Contact"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      value={editedEvent.organizerContact || ""}
                      onChange={(e) => setEditedEvent({ ...editedEvent, organizerContact: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-full justify-center"
                  onClick={handleCreateEvent}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <AiOutlineLoading className="animate-spin text-xl" />
                      Creating Event...
                    </>
                  ) : (
                    <>
                      <FiSave className="text-lg" />
                      Create Event
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                {error}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Success Modal */}
      {success && (
        <section className="fixed inset-0 flex items-center justify-center z-[60] bg-black/20 backdrop-blur-sm">
          <div className="bg-white border-2 border-teal-500 rounded-2xl shadow-2xl p-8 text-center max-w-md animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-teal-700 text-2xl font-bold mb-2">Event Created Successfully!</h3>
            <p className="text-teal-600">Your AI-generated event has been saved.</p>
          </div>
        </section>
      )}
    </>
  )
}
