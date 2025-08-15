import React, { useState } from "react";
import RSVPModal from "../components/RSVPModal";
import FloorPlanModal from "../components/FloorPlanModal";
import DocumentsModal from "../components/DocumentsModal";
import VendorsModal from "../components/VendorsModal";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import dayjs from "dayjs";

// Use same mockEvents as EventsPage for demo
const mockEvents = [
  {
    type: "Wedding",
    title: "Emily & Jake’s Wedding",
    date: "2025-08-18T09:00:00",
    location: "Riverside Mansion",
    rsvpCurrent: 34,
    rsvpTotal: 46,
    vendors: [
      { name: "Floral Designs", service: "Florist" },
      { name: "DJ Mike", service: "Music" },
      { name: "Catering Co.", service: "Catering" },
    ],
    description: "Join us for a beautiful wedding celebration!",
  },
  {
    type: "Conference",
    title: "Business Conference",
    date: "2025-08-18T11:00:00",
    location: "Wits Sport Conference Center",
    rsvpCurrent: 24,
    rsvpTotal: 46,
    vendors: [
      { name: "AV Solutions", service: "Audio/Visual" },
      { name: "Catering Co.", service: "Catering" },
    ],
    description: "Annual business conference for networking and learning.",
  },
  {
    type: "Birthday",
    title: "John’s 30th Birthday",
    date: "2025-08-26T15:00:00",
    location: "The Beach",
    rsvpCurrent: 33,
    rsvpTotal: 36,
    vendors: [
      { name: "Beach Party Rentals", service: "Equipment" },
      { name: "DJ Mike", service: "Music" },
    ],
    description: "Celebrate John's milestone birthday by the sea!",
  },
];


export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = mockEvents[id] || null;
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

  return (
    <section className="min-h-screen bg-gradient-to-b from-sky-100 to-green-900">
      <Navbar />
      <section className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow mt-8">
        <h2 className="text-3xl font-bold text-green-900 mb-2">{event.title}</h2>
        <span className={`px-3 py-1 rounded-full text-xs mb-2 ${event.type === "Wedding" ? "bg-pink-500 text-white" : "bg-gray-300"}`}>{event.type}</span>
        <p className="text-sm mb-1">{dayjs(event.date).format("DD MMM YYYY, HH:mm")}</p>
        <p className="text-sm mb-2">Location: {event.location}</p>
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
            <ul className="list-disc pl-4 text-sm">
              {event.vendors.map((vendor, idx) => (
                <li key={idx}>{vendor.name} - {vendor.service}</li>
              ))}
            </ul>
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
