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
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  function handleEditEventSave(updated) {
    Object.assign(event, updated);
    setShowEditEventModal(false);
  }
  const { id } = useParams();
  const navigate = useNavigate();
  const event = mockEvents[id] || null;
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [showAddGuestsModal, setShowAddGuestsModal] = useState(false);
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
  // Example guest data for RSVP modal
  // Add more guests for scrollability test
  const guests = [
    { name: "Alice Smith", status: "Accepted", email: "alice@email.com", mobile: "0812345678" },
    { name: "Bob Johnson", status: "Pending", email: "bob@email.com", mobile: "0823456789" },
    { name: "Carol Lee", status: "Declined", email: "carol@email.com", mobile: "0834567890" },
    { name: "David Kim", status: "Accepted", email: "david@email.com", mobile: "0845678901" },
    { name: "Ella Brown", status: "Pending", email: "ella@email.com", mobile: "0856789012" },
    { name: "Frank Green", status: "Accepted", email: "frank@email.com", mobile: "0867890123" },
    { name: "Grace White", status: "Declined", email: "grace@email.com", mobile: "0878901234" },
    { name: "Henry Black", status: "Accepted", email: "henry@email.com", mobile: "0889012345" },
    { name: "Ivy Blue", status: "Pending", email: "ivy@email.com", mobile: "0890123456" },
    { name: "Jack Red", status: "Accepted", email: "jack@email.com", mobile: "0801234567" },
    { name: "Kara Silver", status: "Accepted", email: "kara@email.com", mobile: "0812345679" },
    { name: "Liam Gold", status: "Pending", email: "liam@email.com", mobile: "0823456790" },
    { name: "Mia Violet", status: "Accepted", email: "mia@email.com", mobile: "0834567901" },
    { name: "Noah Orange", status: "Declined", email: "noah@email.com", mobile: "0845679012" },
    { name: "Olivia Indigo", status: "Accepted", email: "olivia@email.com", mobile: "0856789023" },
    { name: "Paul Teal", status: "Pending", email: "paul@email.com", mobile: "0867890234" },
    { name: "Quinn Lime", status: "Accepted", email: "quinn@email.com", mobile: "0878902345" },
    { name: "Ruby Rose", status: "Accepted", email: "ruby@email.com", mobile: "0889012456" },
    { name: "Sam Moss", status: "Pending", email: "sam@email.com", mobile: "0890123567" },
    { name: "Tina Jade", status: "Accepted", email: "tina@email.com", mobile: "0801234578" },
    { name: "Uma Pearl", status: "Accepted", email: "uma@email.com", mobile: "0812345680" },
    { name: "Victor Ash", status: "Pending", email: "victor@email.com", mobile: "0823456801" },
    { name: "Wendy Sky", status: "Accepted", email: "wendy@email.com", mobile: "0834568012" },
    { name: "Xander Stone", status: "Declined", email: "xander@email.com", mobile: "0845678123" },
    { name: "Yara Dawn", status: "Accepted", email: "yara@email.com", mobile: "0856788134" },
    { name: "Zane Frost", status: "Pending", email: "zane@email.com", mobile: "0867891345" },
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

  // Sample documents
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
          </p>
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
            <p className="text-2xl font-bold">{event.vendors.length}</p>
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
          <button
            className={`px-4 py-2 ${
              activeTab === "overview"
                ? "text-green-700 font-bold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "rsvp"
                ? "text-green-700 font-bold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("rsvp")}
          >
            View RSVP List
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "vendors"
                ? "text-green-700 font-bold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("vendors")}
          >
            View Vendors
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "floor"
                ? "text-green-700 font-bold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("floor")}
          >
            View Floor Plan
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "documents"
                ? "text-green-700 font-bold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("documents")}
          >
            View Documents
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
          <FloorPlanModal floorPlanUrl={floorPlanUrl} onClose={() => setShowFloorPlanModal(false)} />
        )}

        {/* Documents Modal */}
        {showDocumentsModal && (
          <DocumentsModal documents={documents} onClose={() => setShowDocumentsModal(false)} />
        )}
        {showRSVPModal && (
          <RSVPModal guests={guests} onClose={() => setShowRSVPModal(false)} />
        )}

        {/* Vendors Modal */}
        {showVendorsModal && (
          <VendorsModal vendors={event.vendors} onClose={() => setShowVendorsModal(false)} />
        )}

      </section>
    </section>
  );
}