import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import dayjs from "dayjs";
import { useAuth0 } from "@auth0/auth0-react";

// Modals
import RSVPModal from "../components/RSVPModal";
import EditEventModal from "../components/EditEventModal";
import FloorPlanModal from "../components/FloorPlanModal";
import DocumentsModal from "../components/DocumentsModal";
import VendorsModal from "../components/VendorsModal";
import VenuesModal from "../components/VenuesModal";
import AddVenuesModal from "../components/AddVenuesModal";
import ScheduleModal from "../components/ScheduleModal";
import AddScheduleModal from "../components/AddScheduleModal";
import AddGuestsModal from "../components/AddGuestsModal";

// API
import { getAllEvents } from "../backend/api/EventData";
import { getVendors } from "../backend/api/EventVendor";
import { getGuests } from "../backend/api/EventGuest";

export default function EventDetails() {
  const { user } = useAuth0();
  const { id } = useParams();

  const [events, setEvents] = useState([]);
  const [guests, setGuests] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [documents, setDocuments] = useState([]);

  // Modal state
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [showAddGuestsModal, setShowAddGuestsModal] = useState(false);
  const [showVendorsModal, setShowVendorsModal] = useState(false);
  const [showVenuesModal, setShowVenuesModal] = useState(false);
  const [showAddVenuesModal, setShowAddVenuesModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [showFloorPlanModal, setShowFloorPlanModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);

  // Refs for scrolling
  const rsvpRef = useRef(null);
  const vendorsRef = useRef(null);
  const venuesRef = useRef(null);
  const scheduleRef = useRef(null);
  const floorPlanRef = useRef(null);
  const documentsRef = useRef(null);

  const scrollToRef = (ref) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  // Fetch all events for this user
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents(user.sub);
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, [user.sub]);

  const event = events.find((ev) => ev._id === id) || null;

  // Fetch related data when event changes
  useEffect(() => {
    if (!event?._id) return;

    const fetchData = async () => {
      try {
        const [guestsData, vendorsData] = await Promise.all([
          getGuests(event._id),
          getVendors(event._id),
        ]);
        setGuests(guestsData);
        setVendors(vendorsData);
        setSchedules([]);
        setDocuments([]); // placeholder until backend ready
      } catch (err) {
        console.error("Error fetching event data:", err);
      }
    };

    fetchData();
  }, [event?._id]);

  if (!event) return <p>Loading event details...</p>;

  const handleEditEventSave = (updated) => {
    Object.assign(event, updated);
    setShowEditEventModal(false);
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-sky-100 to-green-900 pb-8">
      <Navbar />

      {/* Event Overview */}
      <section className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow mt-8">
        <section className="flex justify-end mb-2">
          <button
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 text-sm font-semibold shadow flex items-center gap-2"
            type="button"
            onClick={() => setShowEditEventModal(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.213l-4 1 1-4 12.362-12.726z"
              />
            </svg>
            {event.location}
          </button>
        </section>

        <p className="text-gray-600 mb-6">{event.description}</p>

        {/* Overview Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
          <div className="bg-gray-50 rounded-lg shadow p-4">
            <h4 className="font-semibold">Total Guests</h4>
            <p className="text-2xl font-bold">{event.rsvpTotal}</p>
            <p className="text-sm text-gray-500">{event.rsvpCurrent} confirmed</p>
          </div>
          <div className="bg-gray-50 rounded-lg shadow p-4">
            <h4 className="font-semibold">Vendors</h4>
            <p className="text-2xl font-bold">{vendors.length}</p>
            <p className="text-sm text-gray-500">All categories</p>
          </div>
          <div className="bg-gray-50 rounded-lg shadow p-4">
            <h4 className="font-semibold">Documents</h4>
            <p className="text-2xl font-bold">{documents.length}</p>
            <p className="text-sm text-gray-500">Uploaded</p>
          </div>
          <div className="bg-gray-50 rounded-lg shadow p-4">
            <h4 className="font-semibold">Budget</h4>
            <p className="text-2xl font-bold">R{event.budget}</p>
            <p className="text-sm text-gray-500">Total allocated</p>
          </div>
        </section>
      </section>

      {/* Event Details & Tiles */}
      <section className="p-6 w-10/12 mx-auto bg-white rounded-lg shadow mt-8">
        <h2 className="text-3xl font-bold text-green-900 mb-2">{event.title}</h2>
        <span
          className={`px-3 py-1 rounded-full text-xs mb-2 ${
            event.type === "Wedding" ? "bg-pink-500 text-white" : "bg-gray-300"
          }`}
        >
          {event.type}
        </span>
        <p className="text-sm mb-2 font-semibold text-green-900">
          Date: {dayjs(event.date).format("DD MMM YYYY, HH:mm")}
        </p>
        <p className="text-sm mb-2 font-semibold text-green-900">
          Location: {event.location}
        </p>
        <p className="text-sm mb-2 font-semibold text-green-900">
          Budget: R{event.budget?.toLocaleString()}
        </p>
        <p className="mb-4 text-gray-700">{event.description}</p>

        {/* Tiles */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {/* RSVP */}
          <section
            className="bg-green-100 rounded-lg shadow p-6 cursor-pointer hover:bg-green-200 transition"
            onClick={() => {
              setShowRSVPModal(true);
              scrollToRef(rsvpRef);
            }}
          >
            <h3 className="text-lg font-semibold mb-2">RSVP</h3>
            <p className="text-xs mb-2">
              Progress: {event.rsvpCurrent}/{event.rsvpTotal}
            </p>
            <section className="bg-gray-300 h-2 rounded mb-2">
              <section
                className="bg-green-900 h-2 rounded"
                style={{
                  width: `${(event.rsvpCurrent / event.rsvpTotal) * 100}%`,
                }}
              />
            </section>
            <p className="text-xs text-green-900">Click to view guest list</p>
          </section>

          {/* Vendors */}
          <section
            className="bg-blue-100 rounded-lg shadow p-6 cursor-pointer hover:bg-blue-200 transition"
            onClick={() => {
              setShowVendorsModal(true);
              scrollToRef(vendorsRef);
            }}
          >
            <h3 className="text-lg font-semibold mb-2">Vendors</h3>
            <p className="text-xs mb-2">Total Vendors: {vendors.length}</p>
            <p className="text-xs text-blue-900 mt-2">Click to view vendor details</p>
          </section>

          {/* Venues */}
          <section
            className="bg-red-100 rounded-lg shadow p-6 cursor-pointer hover:bg-red-200 transition"
            onClick={() => {
              setShowVenuesModal(true);
              scrollToRef(venuesRef);
            }}
          >
            <h3 className="text-lg font-semibold mb-2">Venues</h3>
            <p className="text-xs mb-2">Manage venue options</p>
            <p className="text-xs text-red-900">Click to view venues</p>
          </section>

          {/* Schedule */}
          <section
            className="bg-yellow-100 rounded-lg shadow p-6 cursor-pointer hover:bg-yellow-200 transition"
            onClick={() => {
              setShowScheduleModal(true);
              scrollToRef(scheduleRef);
            }}
          >
            <h3 className="text-lg font-semibold mb-2">Schedule</h3>
            <p className="text-xs text-yellow-900">Click to view schedule</p>
          </section>

          {/* Floor Plan */}
          <section
            className="bg-pink-100 rounded-lg shadow p-6 cursor-pointer hover:bg-pink-200 transition"
            onClick={() => {
              setShowFloorPlanModal(true);
              scrollToRef(floorPlanRef);
            }}
          >
            <h3 className="text-lg font-semibold mb-2">Floor Plan</h3>
            <p className="text-xs mb-2">Venue layout and seating arrangement</p>
            <p className="text-xs text-pink-900">Click to view</p>
          </section>

          {/* Documents */}
          <section
            className="bg-purple-100 rounded-lg shadow p-6 cursor-pointer hover:bg-purple-200 transition"
            onClick={() => {
              setShowDocumentsModal(true);
              scrollToRef(documentsRef);
            }}
          >
            <h3 className="text-lg font-semibold mb-2">Documents</h3>
            <p className="text-xs mb-2">View event documents</p>
            <p className="text-xs text-purple-900">Click to view</p>
          </section>
        </section>

        {/* Modals */}
        {showEditEventModal && (
          <EditEventModal
            event={event}
            onClose={() => setShowEditEventModal(false)}
            onSave={handleEditEventSave}
          />
        )}
        {showRSVPModal && (
          <div ref={rsvpRef}>
            <RSVPModal guests={guests} onClose={() => setShowRSVPModal(false)} />
          </div>
        )}
        {showAddGuestsModal && (
          <AddGuestsModal
            eventId={event._id}
            onClose={() => setShowAddGuestsModal(false)}
          />
        )}
        {showVendorsModal && (
          <div ref={vendorsRef}>
            <VendorsModal
              vendors={vendors}
              eventId={event._id}
              onClose={() => setShowVendorsModal(false)}
            />
          </div>
        )}
        {showVenuesModal && (
          <div ref={venuesRef}>
            <VenuesModal
              onClose={() => setShowVenuesModal(false)}
              onAddVenue={() => setShowAddVenuesModal(true)}
            />
          </div>
        )}
        {showAddVenuesModal && (
          <AddVenuesModal
            eventId={event._id}
            onClose={() => setShowAddVenuesModal(false)}
          />
        )}
        {showScheduleModal && (
          <div ref={scheduleRef}>
            <ScheduleModal
              schedules={schedules}
              onClose={() => setShowScheduleModal(false)}
              onAddSchedule={() => setShowAddScheduleModal(true)}
            />
          </div>
        )}
        {showAddScheduleModal && (
          <AddScheduleModal
            eventId={event._id}
            onClose={() => setShowAddScheduleModal(false)}
          />
        )}
        {showFloorPlanModal && (
          <div ref={floorPlanRef}>
            <FloorPlanModal
              floorPlanUrl={event.floorPlanUrl}
              onClose={() => setShowFloorPlanModal(false)}
            />
          </div>
        )}
        {showDocumentsModal && (
          <div ref={documentsRef}>
            <DocumentsModal
              documents={documents}
              onClose={() => setShowDocumentsModal(false)}
            />
          </div>
        )}
      </section>
    </section>
  );
}
