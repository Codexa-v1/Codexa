import React, { useState, useEffect } from "react";
import RSVPModal from "../components/RSVPModal";
import EditEventModal from "../components/EditEventModal";
import FloorPlanModal from "../components/FloorPlanModal";
import DocumentsModal from "../components/DocumentsModal";
import VendorsModal from "../components/VendorsModal";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import dayjs from "dayjs";
import { useAuth0 } from "@auth0/auth0-react";
import { getAllEvents } from "../backend/api/EventData";
import { getVendors } from "../backend/api/EventVendor";
import { getGuests } from '../backend/api/EventGuest';

export default function EventDetails() {
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  function handleEditEventSave(updated) {
    Object.assign(event, updated);
    setShowEditEventModal(false);
  }

  const { user, isAuthenticated, isLoading } = useAuth0();
  const { id } = useParams();
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      getAllEvents(user.sub)
        .then(async (data) => {
          const eventsWithDetails = await Promise.all(
            data.map(async (ev) => {
              let vendors = [];
              let guests = [];
              try {
                vendors = await getVendors(ev._id);
              } catch (err) {
                console.error(`Failed to fetch vendors for event ${ev._id}:`, err);
              }
              try {
                guests = await getGuests(ev._id);
              } catch (err) {
                console.error(`Failed to fetch guests for event ${ev._id}:`, err);
              }
              return {
                ...ev,
                vendors,
                guests,
              };
            })
          );
          setEvents(eventsWithDetails);

          const currentEvent = eventsWithDetails.find(ev => ev._id.toString() === id);
          setEvent(currentEvent || null);
        })
        .catch(err => console.error(err));
    }
  }, [isAuthenticated, user, id]);


  const navigate = useNavigate();
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [showVendorsModal, setShowVendorsModal] = useState(false);
  const [showFloorPlanModal, setShowFloorPlanModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);

  // Demo floor plan and documents
  const floorPlanUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80";

  const documents = [
    { name: "Venue Contract.pdf", url: "https://example.com/venue-contract.pdf" },
    { name: "Catering Menu.docx", url: "https://example.com/catering-menu.docx" },
    { name: "Event Schedule.xlsx", url: "https://example.com/event-schedule.xlsx" },
  ];

  if (!event) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-100 to-green-900">
        <Navbar />
        <section className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow mt-8 text-center">
          <h2 className="text-2xl font-bold text-red-700 mb-2">Event Not Found</h2>
          <button className="bg-green-900 text-white px-4 py-2 rounded hover:bg-green-700" onClick={() => navigate('/events')}>Back to Events</button>
        </section>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-sky-100 to-green-900">
      <Navbar />
      <section className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow mt-8">
        <section className="flex justify-end mb-2">
          <button
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 text-sm font-semibold shadow flex items-center gap-2"
            type="button"
            onClick={() => setShowEditEventModal(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.213l-4 1 1-4 12.362-12.726z" />
            </svg>
            Edit Event
          </button>
        </section>
      {showEditEventModal && (
        <EditEventModal event={event} onClose={() => setShowEditEventModal(false)} onSave={handleEditEventSave} />
      )}
  <h2 className="text-3xl font-bold text-green-900 mb-2">{event.title}</h2>
  <span className={`px-3 py-1 rounded-full text-xs mb-2 ${event.type === "Wedding" ? "bg-pink-500 text-white" : "bg-gray-300"}`}>{event.type}</span>
  <p className="text-sm mb-2 font-semibold text-green-900">Date: {dayjs(event.date).format("DD MMM YYYY, HH:mm")}</p>
  <p className="text-sm mb-2 font-semibold text-green-900">Location: {event.location}</p>
  <p className="text-sm mb-2 font-semibold text-green-900">Budget: R{event.budget?.toLocaleString()}</p>
  <p className="mb-4 text-gray-700">{event.description}</p>
        {/* Tiles */}
        <section className="grid grid-cols-2 gap-6 mb-8">
          <section className="bg-green-100 rounded-lg shadow p-6 cursor-pointer hover:bg-green-200 transition" onClick={() => setShowRSVPModal(true)}>
            <h3 className="text-lg font-semibold mb-2">RSVP</h3>
            <p className="text-xs mb-2">Progress: {event.rsvpCurrent}/{event.rsvpTotal}</p>
            <section className="bg-gray-300 h-2 rounded mb-2">
              <section
                className="bg-green-900 h-2 rounded"
                style={{ width: `${(event.rsvpCurrent / event.rsvpTotal) * 100}%` }}
              ></section>
            </section>
            <p className="text-xs text-green-900">Click to view guest list</p>
          </section>
          <section className="bg-blue-100 rounded-lg shadow p-6 cursor-pointer hover:bg-blue-200 transition" onClick={() => setShowVendorsModal(true)}>
            <h3 className="text-lg font-semibold mb-2">Vendors</h3>
            <p className="text-xs mb-2">Total Vendors: {event.vendors.length}</p>
            <p className="text-xs text-blue-900 mt-2">Click to view vendor details</p>
          </section>
          {/* Floor Plan Tile */}
          <section className="bg-yellow-100 rounded-lg shadow p-6 cursor-pointer hover:bg-yellow-200 transition" onClick={() => setShowFloorPlanModal(true)}>
            <h3 className="text-lg font-semibold mb-2">Floor Plan</h3>
            <p className="text-xs mb-2">View the venue layout and seating arrangement.</p>
            <p className="text-xs text-yellow-900">Click to view floor plan</p>
          </section>
          {/* Documents Tile */}
          <section className="bg-purple-100 rounded-lg shadow p-6 cursor-pointer hover:bg-purple-200 transition" onClick={() => setShowDocumentsModal(true)}>
            <h3 className="text-lg font-semibold mb-2">Documents</h3>
            <p className="text-xs mb-2">View all event-related documents.</p>
            <p className="text-xs text-purple-900">Click to view documents</p>
          </section>
        </section>

        {/* RSVP Modal */}
        {/* Floor Plan Modal */}
        {showFloorPlanModal && (
          <FloorPlanModal floorPlanUrl={event.floorPlanUrl} onClose={() => setShowFloorPlanModal(false)} />
        )}

        {/* Documents Modal */}
        {showDocumentsModal && (
          <DocumentsModal documents={documents} onClose={() => setShowDocumentsModal(false)} />
        )}
        {showRSVPModal && (
          <RSVPModal guests={event.guests || []} onClose={() => setShowRSVPModal(false)} />
        )}

        {/* Vendors Modal */}
        {showVendorsModal && (
          <VendorsModal vendors={event.vendors || []} onClose={() => setShowVendorsModal(false)} />
        )}

      </section>
    </section>
  );
}
