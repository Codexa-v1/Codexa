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
  const { user } = useAuth0();
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  function handleEditEventSave(updated) {
    Object.assign(event, updated);
    setShowEditEventModal(false);
  }

  // Need to get all events for this user
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents(user.sub);
        setEvents(data); // store in array (state)
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, []);

  const { id } = useParams();
  const navigate = useNavigate();
  const event = events.find((ev) => ev._id === id) || {};

  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [showAddGuestsModal, setShowAddGuestsModal] = useState(false);
  const [showVendorsModal, setShowVendorsModal] = useState(false);
  const [showFloorPlanModal, setShowFloorPlanModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);

  // Demo floor plan and documents
  const documents = [
    { name: "Venue Contract.pdf", url: "https://example.com/venue-contract.pdf" },
    { name: "Catering Menu.docx", url: "https://example.com/catering-menu.docx" },
    { name: "Event Schedule.xlsx", url: "https://example.com/event-schedule.xlsx" },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-b from-sky-100 to-green-900 pb-8">
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
            {event.location}
          </button>
        </section>

        <p className="text-gray-600 mb-6">{event.description}</p>

        {/* Overview Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4 ">
          <div className="bg-gray-50 rounded-lg shadow p-4 hover:bg-gray-100 cursor-pointer">
            <h4 className="font-semibold">Total Guests</h4>
            <p className="text-2xl font-bold">{event.rsvpTotal}</p>
            <p className="text-sm text-gray-500">
              {event.rsvpCurrent} confirmed
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg shadow p-4 hover:bg-gray-100 cursor-pointer">
            <h4 className="font-semibold">Vendors</h4>
            <p className="text-2xl font-bold">{event.vendors?.length || 0}</p>
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

      <section className="p-6 w-10/12 mx-auto bg-white rounded-lg shadow mt-8">
        {/* Navigation */}
        <section className="flex justify-between mb-6 bg-gray-100 rounded-lg">
          {/* activeTab is referenced but not defined in your code, 
              leaving it as-is would throw an error. */}
          {/* FIX: define activeTab state */}
          {/* Example: const [activeTab, setActiveTab] = useState("overview"); */}
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
            <p className="text-xs mb-2">Total Vendors: {event.vendors?.length || 0}</p>
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

        {/* Modals */}
        {showFloorPlanModal && (
          <FloorPlanModal floorPlanUrl={event.floorPlanUrl} onClose={() => setShowFloorPlanModal(false)} />
        )}

        {showDocumentsModal && (
          <DocumentsModal documents={documents} onClose={() => setShowDocumentsModal(false)} />
        )}
        {showRSVPModal && (
          <RSVPModal guests={[]} onClose={() => setShowRSVPModal(false)} />
        )}

        {showVendorsModal && (
          <VendorsModal vendors={event.vendors} onClose={() => setShowVendorsModal(false)} />
        )}
      </section>
    </section>
  );
}
