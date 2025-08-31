import { FaCalendarPlus } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "../components/Navbar";
import Calendar from "../components/CalendarBox";
import EventPopup from "../components/EventPopup";
import EventCard from "../components/EventCard";
import { useEffect, useState } from "react";
import { deleteEvent, getAllEvents } from "../backend/api/EventData";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, isAuthenticated } = useAuth0();
  const [events, setEvents] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Fetch events for the logged in user from backend
      getAllEvents(user.sub)
        .then((data) => setEvents(data))
        .catch((err) => console.error("Failed to fetch events:", err));
    }
  }, [isAuthenticated, user]);

  // When a day is clicked in the calendar
  const handleDayClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  return (
    <section className="home-page min-h-screen bg-gradient-to-b from-sky-100 to-green-900">
      <Navbar />
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
              <EventPopup
                onClose={() => setIsModalOpen(false)}
                selectedDate={selectedDate}
              />
            </section>
          </>
        )}

        {/* Main Content */}
        <section className="flex gap-6 mt-6 flex-col lg:flex-row">
          {/* Calendar */}
          <section className="flex-[1.3] bg-white p-3 rounded-lg shadow">
            <Calendar onDayClick={handleDayClick} />
          </section>

          {/* Upcoming Events */}
          <section className="flex-[0.7] bg-white p-4 rounded-lg shadow">
            <h3 className="mb-3 text-xl font-semibold text-center text-green-900">
              Upcoming Events
            </h3>
            {Array.isArray(events) && events.length > 0 ? (
              events
                .slice(0, 3)
                .map((event, index) => <EventCard key={index} event={event} setConfirmDeleteId={setConfirmDeleteId} />)
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
              <h3 className="text-red-700 text-xl font-bold mb-2">
                Cancel Event?
              </h3>
              <p className="mb-4">
                Are you sure you want to cancel this event? This action cannot
                be undone.
              </p>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded mr-2"
                onClick={async () => {
                  try {
                    const res = await deleteEvent(confirmDeleteId);
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
