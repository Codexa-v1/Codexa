import React, { useState, useEffect } from "react";
import { eventColors } from "@/utils/eventColors";
import { FaCalendarPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import EventPopup from "@/components/EventPopup";
import dayjs from "dayjs";
import { useAuth0 } from "@auth0/auth0-react";
import { getAllEvents, deleteEvent } from "../backend/api/EventData";

export default function EventsPage() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const navigate = useNavigate();

  // Fetch events once user is loaded
  useEffect(() => {
    if (isAuthenticated && user) {
      getAllEvents(user.sub)
        .then((data) => setEvents(data))
        .catch((err) => console.error(err));
    }
  }, [isAuthenticated, user]);

  // Get unique event categories for filter dropdown
  const eventCategories = ["All", ...Array.from(new Set(events.map((e) => e.category)))];

  // Filter and search logic
  const filteredEvents = events.filter((event) => {
    const matchesType = filterType === "All" || event.category === filterType;
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <section className="min-h-screen bg-gradient-to-b from-sky-100 to-green-900">
      <Navbar />
      <section className="p-6 max-w-screen-xl mx-auto min-h-screen font-sans w-full">
        {/* Header and Controls */}
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
              {eventCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <button
              className="bg-green-900 text-white px-4 py-2 flex items-center gap-2 rounded-md hover:bg-green-700"
              onClick={() => setIsModalOpen(true)}
            >
              <FaCalendarPlus />
              Add New Event
            </button>
          </section>

          {/* Modal with overlay */}
          {isModalOpen && (
            <>
              <section
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
                onClick={() => setIsModalOpen(false)}
              ></section>
              <section className="fixed inset-0 flex items-center justify-center z-50">
                <EventPopup onClose={() => setIsModalOpen(false)} />
              </section>
            </>
          )}
        </section>

        {/* Events Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length === 0 ? (
            <p className="col-span-3 text-center text-gray-600">No events found.</p>
          ) : (
            filteredEvents.map((event) => {
              const { bgColor, labelColor } =
                eventColors[event.category] || eventColors.Other;

              return (
                <div
                  key={event._id}
                  className={`${bgColor} p-6 rounded-lg shadow flex flex-col justify-between 
                              transform transition-transform duration-200 hover:scale-105 hover:shadow-xl`}
                >
                  <span
                    className={`${labelColor} text-white px-3 py-1 rounded-full text-xs w-fit mb-2`}
                  >
                    {event.category}
                  </span>
                  <h4 className="text-lg font-bold mt-2 mb-1">{event.title}</h4>
                  <p className="text-sm mb-1">
                    {dayjs(event.date).format("DD MMM YYYY, HH:mm")}
                  </p>
                  <p className="text-sm mb-2">{event.location}</p>

                  {/* RSVP Progress Bar */}
                  <div className="bg-gray-300 h-1 rounded mt-1 mb-2">
                    <div
                      className="bg-green-900 h-1 rounded"
                      style={{
                        width: `${(event.rsvpCurrent / event.rsvpTotal) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs mb-2">
                    RSVP: {event.rsvpCurrent}/{event.rsvpTotal}
                  </p>

                  {/* Actions */}
                  <div className="flex justify-between mt-3">
                    <button
                      className="bg-green-800 text-white px-6 py-1 rounded hover:opacity-90"
                      onClick={() => navigate(`/events/${event._id}`)}
                    >
                      View
                    </button>
                    <button
                      className="bg-red-600 text-white px-6 py-1 rounded hover:opacity-90"
                      onClick={() => setConfirmDeleteId(event._id)}
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Cancel Confirmation */}
                  {confirmDeleteId === event._id && (
                    <section className="fixed inset-0 flex items-center justify-center z-50">
                      <div className="bg-white border border-red-600 rounded-lg shadow-lg p-6 text-center">
                        <h3 className="text-red-700 text-xl font-bold mb-2">
                          Cancel Event?
                        </h3>
                        <p className="mb-4">
                          Are you sure you want to cancel this event? This action cannot be undone.
                        </p>
                        <button
                          className="bg-red-600 text-white px-4 py-2 rounded mr-2"
                          onClick={async () => {
                            try {
                              const res = await deleteEvent(confirmDeleteId);
                              setConfirmDeleteId(null);
                              window.location.reload();
                            } catch (err) {
                              alert("Error cancelling event: " + err.message);
                              setConfirmDeleteId(null);
                            }
                          }}
                        >
                          Yes, Cancel
                        </button>
                        <button
                          className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                          onClick={() => setConfirmDeleteId(null)}
                        >
                          No, Go Back
                        </button>
                      </div>
                    </section>
                  )}
                </div>
              );
            })
          )}
        </section>
      </section>
    </section>
  );
}
