import React, { useState } from "react";
import RSVPModal from "../components/RSVPModal";
import EditEventModal from "../components/EditEventModal";
import FloorPlanModal from "../components/FloorPlanModal";
import DocumentsModal from "../components/DocumentsModal";
import VendorsModal from "../components/VendorsModal";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import dayjs from "dayjs";

// Use same mockEvents as EventsPage for demo
const mockEvents = [
  {
    _id: "789",
    type: "Wedding",
    title: "Emily & Jake’s Wedding",
    date: "2025-08-18T09:00:00",
    location: "Riverside Mansion",
    rsvpCurrent: 34,
    rsvpTotal: 46,
    vendors: [
      {
        name: "Floral Designs",
        vendorType: "Florist",
        contactPerson: "Jane Flowers",
        phone: "012-345-6789",
        email: "floral@email.com",
        website: "https://floraldesigns.com",
        address: "123 Flower St, Cityville",
        location: "Main Hall",
        rating: 5,
        notes: "Specializes in wedding bouquets.",
      },
      {
        name: "DJ Mike",
        vendorType: "Music",
        contactPerson: "Mike Johnson",
        phone: "098-765-4321",
        email: "dj.mike@email.com",
        website: "https://djmike.com",
        address: "456 Music Ave, Cityville",
        location: "Dance Floor",
        rating: 4,
        notes: "Has own sound equipment.",
      },
      {
        name: "Catering Co.",
        vendorType: "Catering",
        contactPerson: "Sarah Chef",
        phone: "011-223-3445",
        email: "catering@email.com",
        website: "https://cateringco.com",
        address: "789 Food Rd, Cityville",
        location: "Dining Area",
        rating: 5,
        notes: "Can accommodate vegan options.",
      },
    ],
    description: "Join us for a beautiful wedding celebration!",
    budget: 120000,
  },
  {
    _id: "456",
    type: "Conference",
    title: "Business Conference",
    date: "2025-08-18T11:00:00",
    location: "Wits Sport Conference Center",
    rsvpCurrent: 24,
    rsvpTotal: 46,
    vendors: [
      {
        name: "AV Solutions",
        vendorType: "Audio/Visual",
        contactPerson: "Alex Vision",
        phone: "021-334-5566",
        email: "av@email.com",
        website: "https://avsolutions.com",
        address: "321 AV Blvd, Cityville",
        location: "Conference Room",
        rating: 4,
        notes: "Provides projectors and microphones.",
      },
      {
        name: "Catering Co.",
        vendorType: "Catering",
        contactPerson: "Sarah Chef",
        phone: "011-223-3445",
        email: "catering@email.com",
        website: "https://cateringco.com",
        address: "789 Food Rd, Cityville",
        location: "Dining Area",
        rating: 5,
        notes: "Can accommodate vegan options.",
      },
    ],
    description: "Annual business conference for networking and learning.",
    budget: 80000,
  },
  {
    _id: "123",
    type: "Birthday",
    title: "John’s 30th Birthday",
    date: "2025-08-26T15:00:00",
    location: "The Beach",
    rsvpCurrent: 33,
    rsvpTotal: 36,
    vendors: [
      {
        name: "Beach Party Rentals",
        vendorType: "Equipment",
        contactPerson: "Sandy Beach",
        phone: "022-445-6677",
        email: "beachparty@email.com",
        website: "https://beachpartyrentals.com",
        address: "654 Beach Rd, Seaville",
        location: "Beach Area",
        rating: 5,
        notes: "Offers full beach setup.",
      },
      {
        name: "DJ Mike",
        vendorType: "Music",
        contactPerson: "Mike Johnson",
        phone: "098-765-4321",
        email: "dj.mike@email.com",
        website: "https://djmike.com",
        address: "456 Music Ave, Cityville",
        location: "Dance Floor",
        rating: 4,
        notes: "Has own sound equipment.",
      },
    ],
    description: "Celebrate John's milestone birthday by the sea!",
    budget: 25000,
  },
];

export default function EventDetails() {
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  function handleEditEventSave(updated) {
    Object.assign(event, updated);
    setShowEditEventModal(false);
  }

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
      navigator
        .share(shareData)
        .catch((err) => console.error("Share failed:", err));
    } else {
      navigator.clipboard.writeText(link);
      alert("Link copied to clipboard!");
    }
  };

  const { id } = useParams();
  const navigate = useNavigate();
  const event = mockEvents.find((e) => e._id === id) || null;
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [showVendorsModal, setShowVendorsModal] = useState(false);
  const [showFloorPlanModal, setShowFloorPlanModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Demo floor plan and documents
  const floorPlanUrl =
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80";
  const documents = [
    {
      name: "Venue Contract.pdf",
      size: "850 KB",
      date: "2025-02-10",
      type: "DOCX",
      url: "https://example.com/venue-contract.pdf",
    },
    {
      name: "Guest List",
      size: "220 KB",
      date: "2025-02-20",
      type: "XLSX",
      url: "#",
    },
    {
      name: "Catering Menu.docx",
      size: "1.1 MB",
      date: "2025-02-10",
      type: "PDF",
      url: "https://example.com/catering-menu.docx",
    },
    {
      name: "Event Schedule.xlsx",
      size: "650 KB",
      date: "2025-02-10",
      type: "PDF",
      url: "https://example.com/event-schedule.xlsx",
    },
  ];
  // Example guest data for RSVP modal
  // Add more guests for scrollability test
  const guests = [
    {
      name: "Alice Smith",
      status: "Accepted",
      email: "alice@email.com",
      mobile: "0812345678",
    },
    {
      name: "Bob Johnson",
      status: "Pending",
      email: "bob@email.com",
      mobile: "0823456789",
    },
    {
      name: "Carol Lee",
      status: "Declined",
      email: "carol@email.com",
      mobile: "0834567890",
    },
    {
      name: "David Kim",
      status: "Accepted",
      email: "david@email.com",
      mobile: "0845678901",
    },
    {
      name: "Ella Brown",
      status: "Pending",
      email: "ella@email.com",
      mobile: "0856789012",
    },
    {
      name: "Frank Green",
      status: "Accepted",
      email: "frank@email.com",
      mobile: "0867890123",
    },
    {
      name: "Grace White",
      status: "Declined",
      email: "grace@email.com",
      mobile: "0878901234",
    },
    {
      name: "Henry Black",
      status: "Accepted",
      email: "henry@email.com",
      mobile: "0889012345",
    },
    {
      name: "Ivy Blue",
      status: "Pending",
      email: "ivy@email.com",
      mobile: "0890123456",
    },
    {
      name: "Jack Red",
      status: "Accepted",
      email: "jack@email.com",
      mobile: "0801234567",
    },
    {
      name: "Kara Silver",
      status: "Accepted",
      email: "kara@email.com",
      mobile: "0812345679",
    },
    {
      name: "Liam Gold",
      status: "Pending",
      email: "liam@email.com",
      mobile: "0823456790",
    },
    {
      name: "Mia Violet",
      status: "Accepted",
      email: "mia@email.com",
      mobile: "0834567901",
    },
    {
      name: "Noah Orange",
      status: "Declined",
      email: "noah@email.com",
      mobile: "0845679012",
    },
    {
      name: "Olivia Indigo",
      status: "Accepted",
      email: "olivia@email.com",
      mobile: "0856789023",
    },
    {
      name: "Paul Teal",
      status: "Pending",
      email: "paul@email.com",
      mobile: "0867890234",
    },
    {
      name: "Quinn Lime",
      status: "Accepted",
      email: "quinn@email.com",
      mobile: "0878902345",
    },
    {
      name: "Ruby Rose",
      status: "Accepted",
      email: "ruby@email.com",
      mobile: "0889012456",
    },
    {
      name: "Sam Moss",
      status: "Pending",
      email: "sam@email.com",
      mobile: "0890123567",
    },
    {
      name: "Tina Jade",
      status: "Accepted",
      email: "tina@email.com",
      mobile: "0801234578",
    },
    {
      name: "Uma Pearl",
      status: "Accepted",
      email: "uma@email.com",
      mobile: "0812345680",
    },
    {
      name: "Victor Ash",
      status: "Pending",
      email: "victor@email.com",
      mobile: "0823456801",
    },
    {
      name: "Wendy Sky",
      status: "Accepted",
      email: "wendy@email.com",
      mobile: "0834568012",
    },
    {
      name: "Xander Stone",
      status: "Declined",
      email: "xander@email.com",
      mobile: "0845678123",
    },
    {
      name: "Yara Dawn",
      status: "Accepted",
      email: "yara@email.com",
      mobile: "0856788134",
    },
    {
      name: "Zane Frost",
      status: "Pending",
      email: "zane@email.com",
      mobile: "0867891345",
    },
  ];

  if (!event) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-100 to-green-900">
        <Navbar />
        <section className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow mt-8 text-center">
          <h2 className="text-2xl font-bold text-red-700 mb-2">
            Event Not Found
          </h2>
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
              <svg
                className="w-5 h-5 text-gray-600 hover:text-blue-600 cursor-pointer transform -rotate-45"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
              </svg>
              Send Invite
            </button>
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
        <h2 className="text-3xl font-bold text-green-900 mb-2">
          {event.title}
        </h2>

        <section className="flex flex-wrap items-center gap-4 text-sm text-gray-700 mb-3">
          <p className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-green-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 4h10M5 11h14M5 19h14M5 15h14"
              />
            </svg>
            {dayjs(event.date).format("DD MMM YYYY, HH:mm")}
          </p>
          <p className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-green-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3
                  -3 1.343-3 3 1.343 3 3 3z
                  M12 22s8-6.268 8-12a8 8 0 10-16 0c0 5.732 8 12 8 12z"
              />
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
                    style={{
                      width: `${(event.rsvpCurrent / event.rsvpTotal) * 100}%`,
                    }}
                  ></section>
                </section>
                <p className="text-xs text-green-900">
                  Click to view guest list
                </p>
              </section>

              {/* Vendors Card */}
              <section
                className="bg-blue-100 rounded-lg shadow p-6 cursor-pointer hover:bg-blue-200 transition"
                onClick={() => setActiveTab("vendors")}
              >
                <h3 className="text-lg font-semibold mb-2">Vendors</h3>
                <p className="text-xs mb-2">
                  Total Vendors: {event.vendors.length}
                </p>
                <p className="text-xs text-blue-900 mt-2">
                  Click to view vendor details
                </p>
              </section>
            </section>
          )}

          {activeTab === "rsvp" && (
            <RSVPModal
              guests={guests}
              onClose={() => setActiveTab("overview")}
            />
          )}
          {activeTab === "vendors" && (
            <VendorsModal
              vendors={event.vendors}
              onClose={() => setActiveTab("overview")}
            />
          )}
          {activeTab === "floor" && (
            <FloorPlanModal
              floorPlanUrl={floorPlanUrl}
              onClose={() => setActiveTab("overview")}
            />
          )}
          {activeTab === "documents" && (
            <DocumentsModal
              documents={documents}
              onClose={() => setActiveTab("overview")}
            />
          )}
        </section>
      </section>
    </section>
  );
}
