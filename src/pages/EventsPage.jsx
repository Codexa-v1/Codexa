import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import dayjs from "dayjs";
import EventCard from "../components/EventCard";

const mockEvents = [
  {
    _id: "789",
    type: "Wedding",
    title: "Emily & Jake’s Wedding",
    date: "2025-08-18T09:00:00",
    location: "Riverside Mansion",
    rsvpCurrent: 34,
    rsvpTotal: 46,
    bgColor: "bg-pink-200",
    labelColor: "bg-pink-500",
  },
  {
    _id: "456",
    type: "Conference",
    title: "Business Conference",
    date: "2025-08-18T11:00:00",
    location: "Wits Sport Conference Center",
    rsvpCurrent: 24,
    rsvpTotal: 46,
    bgColor: "bg-yellow-200",
    labelColor: "bg-yellow-700",
  },
  {
    _id: "123",
    type: "Birthday",
    title: "John’s 30th Birthday",
    date: "2025-08-26T15:00:00",
    location: "The Beach",
    rsvpCurrent: 33,
    rsvpTotal: 36,
    bgColor: "bg-blue-200",
    labelColor: "bg-blue-500",
  },
  {
    _id: "446",
    type: "Conference",
    title: "Business Conference",
    date: "2025-08-18T11:00:00",
    location: "Wits Sport Conference Center",
    rsvpCurrent: 24,
    rsvpTotal: 46,
    bgColor: "bg-yellow-200",
    labelColor: "bg-yellow-700",
  },
];

export default function EventsPage() {
  const [events] = useState(mockEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const navigate = useNavigate();

  // Get unique event types for filter dropdown
  const eventTypes = [
    "All",
    ...Array.from(new Set(mockEvents.map((e) => e.type))),
  ];

  // Filter and search logic
  const filteredEvents = events.filter((event) => {
    const matchesType = filterType === "All" || event.type === filterType;
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <section className="min-h-screen bg-gradient-to-b from-sky-100 to-green-900">
      <Navbar />
      <section className="p-6 bg-gradient-to-b from-sky-100 to-green-900 min-h-screen font-sans w-full">
        <section className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-green-900">All Events</h2>
          <section className="flex flex-col md:flex-row gap-2 items-center">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700"
            >
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <button
              className="bg-green-900 text-white px-4 py-2 flex items-center gap-2 rounded-md hover:bg-green-700"
              // onClick={openCreateEventModal}
            >
              + Add New Event
            </button>
          </section>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length === 0 ? (
            <p className="col-span-3 text-center text-gray-600">
              No events found.
            </p>
          ) : (
            filteredEvents.map((event, index) => (
              <EventCard key={index} event={event} />
            ))
          )}
        </section>
      </section>
    </section>
  );
}
