import { FaCalendarPlus } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";
import navbar from "../components/navbar";
import Calendar from "../components/calendar";
import EventPopup from "../components/eventPopup";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth0();
  const [events, setEvents] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Fetch events for the logged in user from backend
      fetch(
        `http://localhost:3000/api/events?userId=${encodeURIComponent(user.sub)}`
      )
        .then((res) => res.json())
        .then((data) => setEvents(data))
        .catch((err) => console.error("Failed to fetch events:", err));
    }
  }, [isAuthenticated, user]);

  return (
    <section className="home-page min-h-screen bg-gradient-to-b from-sky-100 to-green-900">
  <navbar />
      <section className="p-6 bg-gradient-to-b from-sky-100 to-green-900 min-h-screen font-sans">
        {/* Header */}
        <section className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-green-900">
            Welcome back, {user.name}!
          </h2>
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

        {/* Main Content */}
        <section className="flex gap-6 mt-6 flex-col lg:flex-row">
          {/* Calendar */}
          <section className="flex-[1.3] bg-white p-3 rounded-lg shadow">
            <Calendar />
          </section>

          {/* Upcoming Events */}
          <section className="flex-[0.7] bg-white p-4 rounded-lg shadow">
            <h3 className="mb-3 text-xl font-semibold text-center text-green-900">
              Upcoming Events
            </h3>
            {Array.isArray(events) && events.length > 0 ? (
              events.slice(0, 3).map((event, index) => (
                <section
                  key={index}
                  className={`${event.bgColor || 'bg-gray-100'} p-4 rounded-lg shadow mb-4`}
                >
                  <span
                    className={`${event.labelColor || 'bg-gray-500'} text-white px-3 py-1 rounded-full text-xs`}
                  >
                    {event.category || event.type || 'Event'}
                  </span>
                  <h4 className="text-lg font-bold mt-2">{event.title}</h4>
                  <p className="text-sm">
                    {event.date ? (typeof event.date === 'string' ? dayjs(event.date).format("DD MMM YYYY") : dayjs(event.date).format("DD MMM YYYY")) : ''}
                  </p>
                  <p className="text-sm">{event.location}</p>

                  <p className="text-xs mt-3">RSVP Progress</p>
                  <section className="bg-gray-300 h-1 rounded mt-1">
                    <section
                      className="bg-green-900 h-1 rounded"
                      style={{
                        width: `${event.rsvpCurrent && event.rsvpTotal ? (event.rsvpCurrent / event.rsvpTotal) * 100 : 0}%`,
                      }}
                    ></section>
                  </section>
                  <p className="text-xs mt-1">
                    {event.rsvpCurrent || 0}/{event.rsvpTotal || 0}
                  </p>

                  {/* View and Cancel buttons */}
                  <section className="flex justify-between mt-3">
                    <button
                      className="bg-green-800 text-white px-6 py-1 rounded hover:opacity-90"
                      onClick={() => {/* TODO: handle view event */}}
                    >
                      View
                    </button>
                    <button
                      className="bg-red-600 text-white px-6 py-1 rounded hover:opacity-90"
                      onClick={() => setConfirmDeleteId(event._id)}
                    >
                      Cancel
                    </button>
                  </section>
                </section>
              ))
            ) : (
              <p className="text-center text-gray-500">No events found.</p>
            )}
            {Array.isArray(events) && events.length > 3 && (
              <button
                className="mt-2 w-full bg-green-700 text-white py-2 rounded hover:bg-green-900 font-semibold"
                onClick={() => navigate("/events")}
              >
                See more...
              </button>
            )}
          </section>
        </section>

        {/* Confirmation Popup for Deleting Event */}
        {confirmDeleteId && (
          <section className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white border border-red-600 rounded-lg shadow-lg p-6 text-center">
              <h3 className="text-red-700 text-xl font-bold mb-2">Cancel Event?</h3>
              <p className="mb-4">Are you sure you want to cancel this event? This action cannot be undone.</p>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded mr-2"
                onClick={async () => {
                  try {
                    const res = await fetch(`http://localhost:3000/api/events/${confirmDeleteId}`, {
                      method: "DELETE",
                    });
                    if (!res.ok) throw new Error("Failed to delete event");
                    setConfirmDeleteId(null);
                    // Optionally refresh events list
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
      </section>
    </section>
  );
};

export default HomePage;
