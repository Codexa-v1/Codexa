import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Navbar from "../components/Navbar";
import { useAuth0 } from "@auth0/auth0-react";

// Modals
import RSVPModal from "../components/RSVPModal";
import EditEventModal from "../components/EditEventModal";
import VendorsModal from "../components/VendorsModal";
import VenuesModal from "../components/VenuesModal";
import AddVenuesModal from "../components/AddVenuesModal";
import ScheduleModal from "../components/ScheduleModal";
import AddScheduleModal from "../components/AddScheduleModal";
import FloorPlanModal from "../components/FloorPlanModal";
import DocumentsModal from "../components/DocumentsModal";
import AddGuestsModal from "../components/AddGuestsModal";

// Backend API
import { getAllEvents } from "../backend/api/EventData";
import { getVendors } from "../backend/api/EventVendor";
import { getGuests } from "../backend/api/EventGuest";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth0();

  // Event & related data
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState(null);
  const [guests, setGuests] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [documents, setDocuments] = useState([]);
  
  // Tabs & modals
  const [activeTab, setActiveTab] = useState("overview");
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [showAddVenuesModal, setShowAddVenuesModal] = useState(false);
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);

  // Fetch events and select current
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const allEvents = await getAllEvents(user.sub); // adjust if Auth0 user id needed
        setEvents(allEvents);
        const ev = allEvents.find((e) => e._id === id);
        if (ev) setEvent(ev);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, [id]);

  // Fetch event-related data
  useEffect(() => {
    if (!event?._id) return;

    const fetchData = async () => {
      try {
        const [guestData, vendorData] = await Promise.all([
          getGuests(event._id),
          getVendors(event._id),
        ]);
        setGuests(guestData);
        setVendors(vendorData);
        setSchedules([]); // placeholder until backend ready
        setDocuments([]); // placeholder until backend ready
      } catch (err) {
        console.error("Error fetching event data:", err);
      }
    };

    fetchData();
  }, [event?._id]);

  const handleEditEventSave = (updated) => {
    Object.assign(event, updated);
    setShowEditEventModal(false);
  };

  const handleSendInvites = (eventId) => {
    const link = `${window.location.origin}/rsvp/${eventId}`;
    const shareData = {
      title: event.title,
      text: `You're invited to ${event.title} on ${dayjs(event.date).format(
        "DD MMM YYYY, HH:mm"
      )} at ${event.location}.\n\nConfirm attendance here:\n${link}`,
      url: link,
    };
    if (navigator.share) {
      navigator.share(shareData).catch((err) => console.error("Share failed:", err));
    } else {
      navigator.clipboard.writeText(link);
      alert("Link copied to clipboard!");
    }
  };

  if (!event) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-100 to-green-900">
        <Navbar />
        <section className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow mt-8 text-center">
          <h2 className="text-2xl font-bold text-red-700 mb-2">Event Not Found</h2>
          <button
            className="bg-green-900 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => navigate("/events")}
          >
            Back to Events
          </button>
        </section>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-sky-100 to-green-900 pb-8">
      <Navbar />

      {/* Event Header */}
      <section className="p-6 w-10/12 mx-auto bg-white rounded-lg shadow mt-8">
        <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <section className="flex flex-wrap items-center gap-2">
            <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {event.type}
            </span>
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
              Active
            </span>
            <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
              {dayjs(event.date).diff(dayjs(), "day")} days to go
            </span>
          </section>
          <section className="flex gap-2">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm font-semibold shadow flex items-center gap-2"
              type="button"
              onClick={() => handleSendInvites(event._id)}
            >
              Send Invite
            </button>
            <button
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 text-sm font-semibold shadow flex items-center gap-2"
              type="button"
              onClick={() => setShowEditEventModal(true)}
            >
              Edit Event
            </button>
          </section>
        </section>
        {showEditEventModal && (
          <EditEventModal
            event={event}
            onClose={() => setShowEditEventModal(false)}
            onSave={handleEditEventSave}
          />
        )}
        <h2 className="text-3xl font-bold text-green-900 mb-2">{event.title}</h2>
        <section className="flex flex-wrap items-center gap-4 text-sm text-gray-700 mb-3">
          <p>{dayjs(event.date).format("DD MMM YYYY, HH:mm")}</p>
          <p>{event.location}</p>
        </section>
        <p className="text-gray-600 mb-6">{event.description}</p>

        {/* Overview Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
          <div className="bg-gray-50 rounded-lg shadow p-4 hover:bg-gray-100 cursor-pointer">
            <h4 className="font-semibold">Total Guests</h4>
            <p className="text-2xl font-bold">{event.rsvpTotal}</p>
            <p className="text-sm text-gray-500">{event.rsvpCurrent} confirmed</p>
          </div>
          <div className="bg-gray-50 rounded-lg shadow p-4 hover:bg-gray-100 cursor-pointer">
            <h4 className="font-semibold">Vendors</h4>
            <p className="text-2xl font-bold">{vendors.length}</p>
            <p className="text-sm text-gray-500">All categories</p>
          </div>
          <div className="bg-gray-50 rounded-lg shadow p-4 hover:bg-gray-100 cursor-pointer">
            <h4 className="font-semibold">Documents</h4>
            <p className="text-2xl font-bold">{documents.length}</p>
            <p className="text-sm text-gray-500">Uploaded</p>
          </div>
          <div className="bg-gray-50 rounded-lg shadow p-4 hover:bg-gray-100 cursor-pointer">
            <h4 className="font-semibold">Budget</h4>
            <p className="text-2xl font-bold">R{event.budget}</p>
            <p className="text-sm text-gray-500">Total allocated</p>
          </div>
        </section>
      </section>

      {/* Tabs Navigation */}
      <section className="p-6 w-10/12 mx-auto bg-white rounded-lg shadow mt-8">
        <section className="flex justify-between mb-6 bg-gray-100 rounded-lg">
          {["overview","rsvp","vendors","venues","schedule","floor","documents"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 ${
                activeTab === tab ? "text-green-700 font-bold" : "text-gray-500"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, " $1")}
            </button>
          ))}
        </section>

        {/* Tab Content */}
        <section className="display">
          {activeTab === "overview" && (
            <section className="grid grid-cols-2 gap-6 mb-8">
              {/* RSVP Card */}
              <section
                className="bg-green-100 rounded-lg shadow p-6 cursor-pointer hover:bg-green-200 transition"
                onClick={() => setActiveTab("rsvp")}
              >
                <h3 className="text-lg font-semibold mb-2">RSVP Progress</h3>
                <p className="text-xs mb-2">
                  Progress: {event.rsvpCurrent}/{event.rsvpTotal}
                </p>
                <section className="bg-gray-300 h-2 rounded mb-2">
                  <section
                    className="bg-green-900 h-2 rounded"
                    style={{ width: `${(event.rsvpCurrent / event.rsvpTotal) * 100}%` }}
                  ></section>
                </section>
                <p className="text-xs text-green-900">Click to view guest list</p>
              </section>

              {/* Vendors Card */}
              <section
                className="bg-blue-100 rounded-lg shadow p-6 cursor-pointer hover:bg-blue-200 transition"
                onClick={() => setActiveTab("vendors")}
              >
                <h3 className="text-lg font-semibold mb-2">Vendors</h3>
                <p className="text-xs mb-2">Total Vendors: {vendors.length}</p>
                <p className="text-xs text-blue-900 mt-2">Click to view vendor details</p>
              </section>

              {/* Venues Card */}
              <section
                className="bg-red-100 rounded-lg shadow p-6 cursor-pointer hover:bg-red-200 transition"
                onClick={() => setActiveTab("venues")}
              >
                <h3 className="text-lg font-semibold mb-2">Venues</h3>
                <p className="text-xs mb-2">Manage venue options</p>
                <p className="text-xs text-red-900">Click to view venues</p>
              </section>

              {/* Schedule Card */}
              <section
                className="bg-yellow-100 rounded-lg shadow p-6 cursor-pointer hover:bg-yellow-200 transition"
                onClick={() => setActiveTab("schedule")}
              >
                <h3 className="text-lg font-semibold mb-2">Schedule</h3>
                <p className="text-xs text-yellow-900">Click to view schedule</p>
              </section>

              {/* Floor Plan Card */}
              <section
                className="bg-pink-100 rounded-lg shadow p-6 cursor-pointer hover:bg-pink-200 transition"
                onClick={() => setActiveTab("floor")}
              >
                <h3 className="text-lg font-semibold mb-2">Floor Plan</h3>
                <p className="text-xs mb-2">Venue layout and seating arrangement</p>
                <p className="text-xs text-pink-900">Click to view</p>
              </section>

              {/* Documents Card */}
              <section
                className="bg-purple-100 rounded-lg shadow p-6 cursor-pointer hover:bg-purple-200 transition"
                onClick={() => setActiveTab("documents")}
              >
                <h3 className="text-lg font-semibold mb-2">Documents</h3>
                <p className="text-xs mb-2">View event documents</p>
                <p className="text-xs text-purple-900">Click to view</p>
              </section>
            </section>
          )}

          {/* Tab Modals */}
          {activeTab === "rsvp" && <RSVPModal eventId={event._id} guests={guests} onClose={() => setActiveTab("overview")} />}
          {activeTab === "vendors" && <VendorsModal vendors={vendors} onClose={() => setActiveTab("overview")} />}
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
            />
          )}
          {showAddScheduleModal && (
            <AddScheduleModal eventId={event._id} onClose={() => setShowAddScheduleModal(false)} />
          )}
          {activeTab === "floor" && <FloorPlanModal floorPlanUrl={event.floorPlanUrl} onClose={() => setActiveTab("overview")} />}
          {activeTab === "documents" && <DocumentsModal documents={documents} onClose={() => setActiveTab("overview")} />}
        </section>
      </section>
    </section>
  );
}
