import { FaCalendarPlus } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "../Components/Navbar";
import Calendar from "../Components/Calendar";
import EventPopup from "../Components/EventPopup";
import { useState } from "react";
import dayjs from "dayjs";
import { mockUser } from "../mockuser"; // Import the mock user data
import EventCard from "../Components/EventCard";

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth0();

  const events = [
    {
      type: "Wedding",
      title: "Emily & Jake’s Wedding",
      date: "2025-08-18T09:00:00",
      location: "Riverside Mansion",
      rsvpCurrent: 34,
      rsvpTotal: 46,
    },
    {
      type: "Conference",
      title: "Business Conference",
      date: "2025-08-18T11:00:00",
      location: "Wits Sport Conference Center",
      rsvpCurrent: 24,
      rsvpTotal: 46,
    },
    {
      type: "Party",
      title: "John’s 30th Birthday",
      date: "2025-08-26T15:00:00",
      location: "The Beach",
      rsvpCurrent: 33,
      rsvpTotal: 36,
    },
  ];

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
            {events.map((event, index) => (
              <EventCard key={index} event={event} />
            ))}
          </section>
        </section>
      </section>
    </section>
  );
};

export default HomePage;
