  import { FaCalendarPlus } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "../components/Navbar";
import Calendar from "../components/Calendar";
import EventPopup from "../components/EventPopup";
import { useState } from "react";
import dayjs from "dayjs";
import { mockUser } from "../mockuser"; // Import the mock user data

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
      bgColor: "bg-pink-200",
      labelColor: "bg-pink-500",
      buttons: [
        { text: "View", color: "bg-green-800" },
        { text: "Cancel", color: "bg-red-600" },
      ],
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
      buttons: [
        { text: "View", color: "bg-green-800" },
        { text: "Cancel", color: "bg-red-600" },
      ],
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
      buttons: [
        { text: "View", color: "bg-green-800" },
        { text: "Cancel", color: "bg-red-600" },
      ],
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
              <section
                key={index}
                className={`${event.bgColor} p-4 rounded-lg shadow mb-4`}
              >
                <span
                  className={`${event.labelColor} text-white px-3 py-1 rounded-full text-xs`}
                >
                  {event.type}
                </span>
                <h4 className="text-lg font-bold mt-2">{event.title}</h4>
                <p className="text-sm">
                  {dayjs(event.date).format("DD MMM YYYY")}
                </p>
                <p className="text-sm">{event.location}</p>

                <p className="text-xs mt-3">RSVP Progress</p>
                <section className="bg-gray-300 h-1 rounded mt-1">
                  <section
                    className="bg-green-900 h-1 rounded"
                    style={{
                      width: `${(event.rsvpCurrent / event.rsvpTotal) * 100}%`,
                    }}
                  ></section>
                </section>
                <p className="text-xs mt-1">
                  {event.rsvpCurrent}/{event.rsvpTotal}
                </p>

                <section className="flex justify-between mt-3">
                  {event.buttons.map((btn, i) => (
                    <button
                      key={i}
                      className={`${btn.color} text-white px-6 py-1 rounded hover:opacity-90`}
                    >
                      {btn.text}
                    </button>
                  ))}
                </section>
              </section>
            ))}
          </section>
        </section>
      </section>
    </section>
  );
};

export default HomePage;
