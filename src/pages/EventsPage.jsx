import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import dayjs from "dayjs";

const mockEvents = [
  {
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
    type: "Birthday",
    title: "John’s 30th Birthday",
    date: "2025-08-26T15:00:00",
    location: "The Beach",
    rsvpCurrent: 33,
    rsvpTotal: 36,
    bgColor: "bg-blue-200",
    labelColor: "bg-blue-500",
  },
];


export default function EventsPage() {
  const [events, setEvents] = useState(mockEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const navigate = useNavigate();

  // Get unique event types for filter dropdown
  const eventTypes = ["All", ...Array.from(new Set(mockEvents.map(e => e.type)))];

  // Filter and search logic
  const filteredEvents = events.filter(event => {
    const matchesType = filterType === "All" || event.type === filterType;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || event.location.toLowerCase().includes(searchTerm.toLowerCase());
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
              onChange={e => setSearchTerm(e.target.value)}
              className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700"
            >
              {eventTypes.map(type => (
                <option key={type} value={type}>{type}</option>
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
            <p className="col-span-3 text-center text-gray-600">No events found.</p>
          ) : (
            filteredEvents.map((event, index) => (
              <section
                key={index}
                className={`${event.bgColor} p-6 rounded-lg shadow flex flex-col justify-between`}
              >
                <span
                  className={`${event.labelColor} text-white px-3 py-1 rounded-full text-xs w-fit mb-2`}
                >
                  {event.type}
                </span>
                <h4 className="text-lg font-bold mt-2 mb-1">{event.title}</h4>
                <p className="text-sm mb-1">
                  {dayjs(event.date).format("DD MMM YYYY, HH:mm")}
                </p>
                <p className="text-sm mb-2">{event.location}</p>
                <section className="bg-gray-300 h-1 rounded mt-1 mb-2">
                  <section
                    className="bg-green-900 h-1 rounded"
                    style={{
                      width: `${(event.rsvpCurrent / event.rsvpTotal) * 100}%`,
                    }}
                  ></section>
                </section>
                <p className="text-xs mb-2">
                  RSVP: {event.rsvpCurrent}/{event.rsvpTotal}
                </p>
                <section className="flex justify-between mt-3">
                  <button className="bg-green-800 text-white px-6 py-1 rounded hover:opacity-90" onClick={() => navigate(`/events/${index}`)}>View</button>
                  <button className="bg-red-600 text-white px-6 py-1 rounded hover:opacity-90">Delete</button>
                </section>
              </section>
            ))
          )}
        </section>
      </section>
    </section>
  );
}
