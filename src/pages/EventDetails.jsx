import React, { useState, useEffect } from "react";
import RSVPModal from "../components/RSVPModal";
import EditEventModal from "../components/EditEventModal";
import FloorPlanModal from "../components/FloorPlanModal";
import DocumentsModal from "../components/DocumentsModal";
import VendorsModal from "../components/VendorsModal";
import NewGuestModal from "../components/AddGuestsModal"; // Your AddGuests modal
import VenuesModal from "../components/VenuesModal";
import AddVenuesModal from "../components/AddVenuesModal"
import ScheduleModal from "../components/ScheduleModal"
import AddScheduleModal from "../components/AddScheduleModal";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import dayjs from "dayjs";
import { useAuth0 } from "@auth0/auth0-react";
import { getAllEvents } from "../backend/api/EventData";
import { getVendors } from "../backend/api/EventVendor";
import { getGuests } from '../backend/api/EventGuest';

export default function EventDetails() {
  const { user, isAuthenticated } = useAuth0();
  const { id } = useParams();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState(null);

  // Modal state
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [showAddVenuesModal, setShowAddVenuesModal] = useState(false);
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [showAddGuestsModal, setShowAddGuestsModal] = useState(false);
  const [showVendorsModal, setShowVendorsModal] = useState(false);
  const [showFloorPlanModal, setShowFloorPlanModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showVenuesModal, setShowVenuesModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);


  // Fetch events with vendors and guests
  useEffect(() => {
    if (isAuthenticated && user) {
      getAllEvents(user.sub)
        .then(async (data) => {
          const eventsWithDetails = await Promise.all(
            data.map(async (ev) => {
              let vendors = [], guests = [];
              try { vendors = await getVendors(ev._id); } catch (err) { console.error(err); }
              try { guests = await getGuests(ev._id); } catch (err) { console.error(err); }
              return { ...ev, vendors, guests };
            })
          );
          setEvents(eventsWithDetails);
          const currentEvent = eventsWithDetails.find(ev => ev._id.toString() === id);
          setEvent(currentEvent || null);
        })
        .catch(err => console.error(err));
    }
  }, [isAuthenticated, user, id]);

  // Handlers
  function handleEditEventSave(updated) {
    setEvent(prev => ({ ...prev, ...updated }));
    setShowEditEventModal(false);
  }

  function handleAddGuestsSave(newGuests) {
    setEvent(prev => ({
      ...prev,
      guests: [...(prev.guests || []), ...newGuests]
    }));
    setShowAddGuestsModal(false);
  }

  if (!event) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-100 to-green-900">
        <Navbar />
        <section className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow mt-8 text-center">
          <h2 className="text-2xl font-bold text-red-700 mb-2">Event Not Found</h2>
          <button
            className="bg-green-900 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => navigate('/events')}
          >
            Back to Events
          </button>
        </section>
      </section>
    );
  }

  // Sample documents
  const documents = [
    { name: "Venue Contract.pdf", url: "https://example.com/venue-contract.pdf" },
    { name: "Catering Menu.docx", url: "https://example.com/catering-menu.docx" },
    { name: "Event Schedule.xlsx", url: "https://example.com/event-schedule.xlsx" },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-b from-sky-100 to-green-900">
      <Navbar />
      <section className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow mt-8">

        {/* Edit Event Button */}
        <section className="flex justify-end mb-2">
          <button
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 text-sm font-semibold shadow flex items-center gap-2"
            onClick={() => setShowEditEventModal(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.213l-4 1 1-4 12.362-12.726z"/>
            </svg>
            Edit Event
          </button>
        </section>

        {/* Event Details */}
        <h2 className="text-3xl font-bold text-green-900 mb-2">{event.title}</h2>
        <span className={`px-3 py-1 rounded-full text-xs mb-2 ${event.category ? "bg-pink-500 text-white" : "bg-gray-300"}`}>
          {event.category || "Uncategorized"}
        </span>
        <p className="text-sm mb-2 font-semibold text-green-900">Date: {dayjs(event.date).format("DD MMM YYYY, HH:mm")}</p>
        <p className="text-sm mb-2 font-semibold text-green-900">Location: {event.location}</p>
        <p className="text-sm mb-2 font-semibold text-green-900">Budget: R{event.budget?.toLocaleString()}</p>
        <p className="mb-4 text-gray-700">{event.description}</p>

        {/* Tiles */}
        <section className="grid grid-cols-2 gap-6 mb-8">
          <section className="bg-green-100 rounded-lg shadow p-6 cursor-pointer hover:bg-green-200 transition"
                   onClick={() => setShowRSVPModal(true)}>
            <h3 className="text-lg font-semibold mb-2">RSVP</h3>
            <p className="text-xs mb-2">Progress: {event.rsvpCurrent}/{event.rsvpTotal}</p>
            <section className="bg-gray-300 h-2 rounded mb-2">
              <section className="bg-green-900 h-2 rounded"
                       style={{ width: `${(event.rsvpCurrent / event.rsvpTotal) * 100}%` }}/>
            </section>
            <p className="text-xs text-green-900">Click to view guest list</p>
          </section>

          <section className="bg-blue-100 rounded-lg shadow p-6 cursor-pointer hover:bg-blue-200 transition"
                   onClick={() => setShowVendorsModal(true)}>
            <h3 className="text-lg font-semibold mb-2">Vendors</h3>
            <p className="text-xs mb-2">Total Vendors: {event.vendors.length}</p>
            <p className="text-xs text-blue-900 mt-2">Click to view vendor details</p>
          </section>

          <section className="bg-yellow-100 rounded-lg shadow p-6 cursor-pointer hover:bg-yellow-200 transition"
                   onClick={() => setShowFloorPlanModal(true)}>
            <h3 className="text-lg font-semibold mb-2">Floor Plan</h3>
            <p className="text-xs mb-2">View the venue layout and seating arrangement.</p>
            <p className="text-xs text-yellow-900">Click to view floor plan</p>
          </section>

          <section className="bg-purple-100 rounded-lg shadow p-6 cursor-pointer hover:bg-purple-200 transition"
                   onClick={() => setShowDocumentsModal(true)}>
            <h3 className="text-lg font-semibold mb-2">Documents</h3>
            <p className="text-xs mb-2">View all event-related documents.</p>
            <p className="text-xs text-purple-900">Click to view documents</p>
          </section>

          <section
            className="bg-red-100 rounded-lg shadow p-6 cursor-pointer hover:bg-red-200 transition"
            onClick={() => setShowVenuesModal(true)}
          >
            <h3 className="text-lg font-semibold mb-2">Venues</h3>
            <p className="text-xs mb-2">Current Venue: {event.venue?.name || "Not Set"}</p>
            <p className="text-xs text-red-900">Click to view venue details</p>
          </section>

          <section
            className="bg-indigo-100 rounded-lg shadow p-6 cursor-pointer hover:bg-indigo-200 transition"
            onClick={() => setShowScheduleModal(true)}
          >
            <h3 className="text-lg font-semibold mb-2">Schedule</h3>
            <p className="text-xs mb-2">
              {event.schedule?.length
                ? `${event.schedule.length} items`
                : "No schedule added"}
            </p>
            <p className="text-xs text-indigo-900">Click to view schedule</p>
          </section>
        </section>

        {/* Modals */}
        {showEditEventModal && (
          <EditEventModal event={event} onClose={() => setShowEditEventModal(false)} onSave={handleEditEventSave}/>
        )}

        {showRSVPModal && (
          <RSVPModal
            guests={event.guests || []}
            onClose={() => setShowRSVPModal(false)}
            onAddGuests={() => setShowAddGuestsModal(true)}
          />
        )}

        {showAddGuestsModal && (
          <NewGuestModal
            eventId={event._id} // Pass the current event's ID
            onClose={() => setShowAddGuestsModal(false)} // Close the modal
            onGuestsUpdated={(updatedGuests) => {
              // Update event state immediately
              setEvent(prev => ({
                ...prev,
                guests: updatedGuests
              }));
            }}
          />
        )}

       {showVendorsModal && (
        <VendorsModal
          vendors={event.vendors || []}
          eventId={event._id}   // ✅ Pass the event’s _id
          onClose={() => setShowVendorsModal(false)}
        />
      )}

        {showFloorPlanModal && (
          <FloorPlanModal floorPlanUrl={event.floorplan} onClose={() => setShowFloorPlanModal(false)}/>
        )}

        {showDocumentsModal && (
          <DocumentsModal documents={documents} onClose={() => setShowDocumentsModal(false)}/>
        )}

        {showVenuesModal && (
          <VenuesModal
            venues={event.venues || []}
            eventId={event._id}
            onClose={() => setShowVenuesModal(false)}
            onAddVenues={() => setShowAddVenuesModal(true)} // open add modal on top
          />
        )}

        {showAddVenuesModal && (
          <AddVenuesModal
            eventId={event._id}
            onClose={() => setShowAddVenuesModal(false)}
            onVenuesUpdated={(updatedVenues) => {
              setEvent(prev => ({
                ...prev,
                venues: updatedVenues
              }));
            }}
          />
        )}


        {showScheduleModal && (
          <ScheduleModal
            schedule={event.schedule}
            onClose={() => setShowScheduleModal(false)}
            onAddSchedule={() => setShowAddScheduleModal(true)} // open add/edit modal
          />
        )}

        {showAddScheduleModal && (
          <AddScheduleModal
            eventId={event._id}
            onClose={() => setShowAddScheduleModal(false)}
            onScheduleUpdated={(updatedSchedule) => {
              setEvent(prev => ({
                ...prev,
                schedule: updatedSchedule
              }));
            }}
          />
        )}

      </section>
    </section>
  );
}