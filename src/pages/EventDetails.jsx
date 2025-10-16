"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import dayjs from "dayjs"
import Navbar from "@/components/Navbar"
import { useAuth0 } from "@auth0/auth0-react"
import { FiAlertCircle, FiRefreshCw, FiSend, FiEdit3, FiLoader } from "react-icons/fi"

// Backend API
import { getAllEvents } from "@/backend/api/EventData"

import RSVPModal from "@/components/RSVPModal";
import EditEventModal from "@/components/EditEventModal";
import VendorsModal from "@/components/VendorsModal";
import VenuesModal from "@/components/VenuesModal";
import AddVenuesModal from "@/components/AddVenuesModal";
import ScheduleModal from "@/components/ScheduleModal";
import AddScheduleModal from "@/components/AddScheduleModal";
import FloorPlanModal from "@/components/FloorPlanModal";
import DocumentsModal from "@/components/DocumentsModal";
import WeatherCard from "@/components/WeatherCard";
import MemoriesModal from "@/components/MemoriesModal"; // <-- Add this import

import { updateEvent } from "@/backend/api/EventData";
import { getVenues } from "@/backend/api/EventVenue";
import { getVendors, getEventVendorDetails } from "@/backend/api/EventVendor";
import { getGuests } from "@/backend/api/EventGuest";
import { getDocuments } from "@/backend/api/EventDocuments";

export default function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth0()

  const [loading, setLoading] = useState(true)
  // Event & related data
  const [events, setEvents] = useState([])
  const [event, setEvent] = useState(null)
  const [guests, setGuests] = useState([])
  const [vendors, setVendors] = useState([])
  const [venues, setVenues] = useState([])
  const [schedules, setSchedules] = useState([])
  const [documents, setDocuments] = useState([])
  const [memories, setMemories] = useState([]); // <-- Add memories state

  // Tabs & modals
  const [activeTab, setActiveTab] = useState("overview")
  const [showEditEventModal, setShowEditEventModal] = useState(false)
  const [showAddVenuesModal, setShowAddVenuesModal] = useState(false)
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false)
  const [showPastEventModal, setShowPastEventModal] = useState(false)

  // Fetch events and select current
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const allEvents = await getAllEvents(user.sub)
        setEvents(allEvents)
        const ev = allEvents.find((e) => e._id === id)
        if (ev) {
          setEvent(ev)
          if (dayjs(ev.date).isBefore(dayjs(), "day")) {
            setShowPastEventModal(true)
          }
        }
      } catch (err) {
        console.error("Error fetching events:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [id, user.sub])

  // Fetch event-related data
  useEffect(() => {
    if (!event?._id) return

    const fetchData = async () => {
      try {
        const [guestData, vendorData, documentData, venueData] = await Promise.all([
          getGuests(event._id),
          getEventVendorDetails(event._id),
          getDocuments(user.sub, event._id),
          getVenues(event._id)
        ]);
        setGuests(guestData);
        setVendors(vendorData);
        setDocuments(documentData);
        setVenues(venueData);
        setSchedules([]) // placeholder until backend ready
      } catch (err) {
        console.error("Error fetching event data:", err)
      }
    }

    fetchData()
  }, [event?._id, user.sub])

  // Example: fetch memories when event changes (optional, if you have a backend)
  // useEffect(() => {
  //   if (!event?._id) return;
  //   getMemories(event._id).then(setMemories).catch(console.error);
  // }, [event?._id]);

  const handleEditEventSave = (updated) => {
    setEvent((prev) => ({ ...prev, ...updated }))
    setShowPastEventModal(false)
  }

  const handleSendInvites = (eventId) => {
    const link = `${window.location.origin}/invite/${eventId}`
    const shareData = {
      title: event.title,
      text: `You're invited to ${event.title} on ${dayjs(event.date).format(
        "DD MMM YYYY, HH:mm",
      )} at ${event.location}.\n\nConfirm attendance here:\n${link}`,
      url: link,
    }
    if (navigator.share) {
      navigator.share(shareData).catch((err) => console.error("Share failed:", err))
    } else {
      navigator.clipboard.writeText(link)
      alert("Link copied to clipboard!")
    }
  }

  const refreshData = async () => {
    if (!event?._id) return
    try {
      const [guestData, vendorData, documentData, venueData] = await Promise.all([
        getGuests(event._id),
        getEventVendorDetails(event._id),
        getDocuments(user.sub, event._id),
        getVenues(event._id)
      ]);
      setGuests(guestData);
      setVendors(vendorData);
      setDocuments(documentData);
      setVenues(venueData);
      setSchedules([]) // placeholder until backend ready
    } catch (err) {
      console.error("Error refreshing event data:", err)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    refreshData()
  }

  const handleClosePastEvent = async () => {
    try {
      const updated = await updateEvent(event._id, { status: "Completed" });
      setEvent(updated);
      setShowPastEventModal(false)
    } catch (err) {
      console.error("Failed to complete event:", err)
    }
  }

  const handleReopenEvent = async () => {
    try {
      const updated = await updateEvent(event._id, { status: "Planning" });
      setEvent(updated);
      setShowPastEventModal(false)
      setShowEditEventModal(true)
    } catch (err) {
      console.error("Failed to reopen event:", err)
    }
  }

  if (loading) {
    return (
      <section className="min-h-screen flex flex-col bg-gradient-to-br from-cyan-50 via-teal-50 to-teal-100">
        <Navbar />
        <section className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiLoader className="w-8 h-8 text-teal-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Event...</h2>
            <p className="text-gray-600">Please wait while we fetch the event details.</p>
          </div>
        </section>
      </section>
    )
  }

  if (!event) {
    return (
      <section className="min-h-screen flex flex-col bg-gradient-to-br from-cyan-50 via-teal-50 to-teal-100">
        <Navbar />
        <section className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
            <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <button
              className="bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              onClick={() => navigate("/events")}
            >
              Back to Events
            </button>
          </div>
        </section>
      </section>
    )
  }

  const daysToGo = dayjs(event.date).diff(dayjs(), "day")
  const acceptedGuests = guests.filter((g) => g.rsvpStatus === "Accepted").length
  const declinedGuests = guests.filter((g) => g.rsvpStatus === "Declined").length
  const pendingGuests = guests.filter((g) => g.rsvpStatus === "Pending").length
  const guestCount = guests.length

  const totalVendorCost = vendors.reduce((sum, v) => {
    const cost = v.eventVendor?.vendorCost ?? 0
    return sum + (typeof cost === "string" ? Number.parseFloat(cost) : cost)
  }, 0)

  const totalVenueCost = venues.reduce((sum, v) => {
    const cost = v.venueCost ?? 0
    return sum + (typeof cost === "string" ? Number.parseFloat(cost) : cost)
  }, 0)

  const totalUsed = totalVendorCost + totalVenueCost
  const remaining = event.budget - totalUsed

  return (
    <section className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-teal-100 pb-12">
      <Navbar />

      {/* Past Event Confirmation Modal */}
      {showPastEventModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Past Event Detected</h3>
            <p className="text-gray-600 mb-8 text-center leading-relaxed">
              This event has already passed. Do you want to confirm it as closed, or re-open it with a new date?
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold"
                onClick={handleClosePastEvent}
              >
                Confirm Closing
              </button>
              <button
                className="flex-1 bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                onClick={handleReopenEvent}
              >
                Re-open / Postpone
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Header */}
      <section className="max-w-7xl mx-auto px-6 mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Badges and Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md">
                {event.category}
              </span>
              <span className="bg-teal-100 text-teal-800 text-sm font-semibold px-4 py-2 rounded-full">
                {event.status}
              </span>
              <span className="bg-amber-100 text-amber-800 text-sm font-semibold px-4 py-2 rounded-full">
                {daysToGo === 0
                  ? "Tomorrow"
                  : daysToGo === 1
                  ? "1 day left"
                  : daysToGo < 0
                  ? "Closed"
                  : `${daysToGo} days to go`}
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
                type="button"
                onClick={refreshData}
              >
                <FiRefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                className="bg-rose-500 text-white px-5 py-2.5 rounded-xl hover:bg-rose-600 transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
                type="button"
                onClick={() => handleSendInvites(event._id)}
              >
                <FiSend className="w-4 h-4" />
                Send Invite
              </button>
              <button
                className="bg-teal-600 text-white px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
                type="button"
                onClick={() => setShowEditEventModal(true)}
              >
                <FiEdit3 className="w-4 h-4" />
                Edit Event
              </button>
            </div>
          </div>

          {showEditEventModal && (
            <EditEventModal
              event={event}
              onClose={() => setShowEditEventModal(false)}
              onSave={handleEditEventSave}
            />
          )}

          {/* Event Title and Details */}
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">{event.title}</h2>
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-4">
            <p className="font-medium">{dayjs(event.date).format("DD MMM YYYY")}</p>
            <p className="font-medium">
              {event.startTime} - {event.endTime}
            </p>
            <p className="font-medium">{event.location}</p>
          </div>
          <p className="text-gray-700 leading-relaxed mb-8">{event.description}</p>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border border-teal-200">
              <h4 className="font-semibold text-gray-700 mb-2">Total Guests</h4>
              <p className="text-3xl font-bold text-teal-700 mb-2">{guestCount || 0}</p>
              <p className="text-sm text-gray-600">
                Accepted: {acceptedGuests} | Declined: {declinedGuests} | Pending: {pendingGuests}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border border-blue-200">
              <h4 className="font-semibold text-gray-700 mb-2">Vendors</h4>
              <p className="text-3xl font-bold text-blue-700 mb-2">{vendors.length}</p>
              <p className="text-sm text-gray-600">All categories</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border border-purple-200">
              <h4 className="font-semibold text-gray-700 mb-2">Documents</h4>
              <p className="text-3xl font-bold text-purple-700 mb-2">{documents.length}</p>
              <p className="text-sm text-gray-600">Uploaded</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border border-emerald-200">
              <h4 className="font-semibold text-gray-700 mb-2">Budget</h4>
              <p className="text-3xl font-bold text-emerald-700 mb-2">R{event.budget || 0}</p>
              <p className="text-sm text-gray-600">Total allocated</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border border-amber-200">
              <h4 className="font-semibold text-gray-700 mb-2">Budget Usage</h4>
              {event.budget ? (
                <>
                  <p className="text-3xl font-bold text-amber-700 mb-2">R{totalUsed.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Remaining: R{remaining.toFixed(2)}</p>
                </>
              ) : (
                <p className="text-sm text-gray-600">No budget set</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="max-w-7xl mx-auto px-6 mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Tabs Navigation */}
          <div className="flex flex-wrap gap-2 mb-8 bg-gray-50 p-2 rounded-xl">
            {[
              { key: "overview", label: "Overview", color: "teal" },
              { key: "rsvp", label: "RSVP", color: "teal" },
              { key: "vendors", label: "Vendors", color: "blue" },
              { key: "venues", label: "Venues", color: "rose" },
              { key: "schedule", label: "Schedule", color: "amber" },
              { key: "floor", label: "Floor Plan", color: "pink" },
              { key: "documents", label: "Documents", color: "purple" },
              { key: "memories", label: "Memories", color: "lime" }, // <-- Change to lime
            ].map((tab) => (
              <button
                key={tab.key}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === tab.key ? `bg-${tab.color}-600 text-white shadow-md` : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => handleTabChange(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* RSVP Card */}
              <div
                className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl transition-all duration-200 border border-teal-200"
                onClick={() => setActiveTab("rsvp")}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">RSVP Progress</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Progress: {acceptedGuests}/{guests.length || 0}
                </p>
                <div className="bg-gray-200 h-3 rounded-full mb-3 overflow-hidden">
                  <div
                    className="bg-teal-600 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${guests.length > 0 ? (acceptedGuests / guests.length) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm text-teal-700 font-medium">Click to view guest list</p>
              </div>

              {/* Weather Card Placeholder */}
              <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl shadow-md p-6 border border-sky-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Event Day Forecast</h3>
                <p className="text-sm text-gray-600">Weather forecast will appear here</p>
                  <WeatherCard eventDate={event.date} location={event.location} />
              </div>

              {/* Vendors Card */}
              <div
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl transition-all duration-200 border border-blue-200"
                onClick={() => setActiveTab("vendors")}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">Vendors</h3>
                <p className="text-sm text-gray-600 mb-3">Total Vendors: {vendors.length}</p>
                <p className="text-sm text-blue-700 font-medium">Click to view vendor details</p>
              </div>

              {/* Venues Card */}
              <div
                className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl transition-all duration-200 border border-rose-200"
                onClick={() => setActiveTab("venues")}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">Venues</h3>
                <p className="text-sm text-gray-600 mb-3">Manage venue options</p>
                <p className="text-sm text-rose-700 font-medium">Click to view venues</p>
              </div>

              {/* Schedule Card */}
              <div
                className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl transition-all duration-200 border border-amber-200"
                onClick={() => setActiveTab("schedule")}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">Schedule</h3>
                <p className="text-sm text-amber-700 font-medium">Click to view schedule</p>
              </div>

              {/* Floor Plan Card */}
              <div
                className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl transition-all duration-200 border border-pink-200"
                onClick={() => setActiveTab("floor")}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">Floor Plan</h3>
                <p className="text-sm text-gray-600 mb-3">Venue layout and seating arrangement</p>
                <p className="text-sm text-pink-700 font-medium">Click to view</p>
              </div>

              {/* Documents Card */}
              <div
                className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl transition-all duration-200 border border-purple-200"
                onClick={() => setActiveTab("documents")}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">Documents</h3>
                <p className="text-sm text-gray-600 mb-3">View event documents</p>
                <p className="text-sm text-purple-700 font-medium">Click to view</p>
              </div>

              {/* Memories Card */}
              <div
                className="bg-gradient-to-br from-lime-50 to-lime-100 rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl transition-all duration-200 border border-lime-200"
                onClick={() => setActiveTab("memories")}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">Memories</h3>
                <p className="text-sm text-gray-600 mb-3">
                  {memories.length > 0
                    ? `Total Memories: ${memories.length}`
                    : "No memories uploaded yet"}
                </p>
                <p className="text-sm text-lime-700 font-medium">Click to view and add photos and files from your event</p>
              </div>
            </div>
          )}

          {activeTab === "rsvp" && (
            <RSVPModal eventId={event._id} guests={guests} onClose={() => setActiveTab("overview")} />
          )}
          {activeTab === "vendors" && (
            <VendorsModal vendors={vendors} eventId={event._id} onClose={() => setActiveTab("overview")} />
          )}
          {activeTab === "venues" && (
            <VenuesModal
              eventId={event._id}
              onClose={() => setActiveTab("overview")}
              onAddVenues={() => setShowAddVenuesModal(true)}
            />
          )}
          {showAddVenuesModal && (
            <AddVenuesModal eventId={event._id} onClose={() => setShowAddVenuesModal(false)} />
          )}
          {activeTab === "schedule" && (
            <ScheduleModal
              schedules={schedules}
              onClose={() => setActiveTab("overview")}
              onAddSchedule={() => setShowAddScheduleModal(true)}
              eventId={event._id}
            />
          )}
          {showAddScheduleModal && (
            <AddScheduleModal eventId={event._id} onClose={() => setShowAddScheduleModal(false)} />
          )}
          {activeTab === "floor" && (
            <FloorPlanModal eventId={event._id} floorPlanUrl={event.floorPlanUrl} onClose={() => setActiveTab("overview")} />
          )}
          {activeTab === "documents" && (
            <DocumentsModal eventId={event._id} documents={documents} onClose={() => setActiveTab("overview")} />
          )}
          {activeTab === "memories" && (
            <MemoriesModal eventId={event._id} memories={memories} onClose={() => setActiveTab("overview")} />
          )}
        </div>
      </section>
    </section>
  )
}
