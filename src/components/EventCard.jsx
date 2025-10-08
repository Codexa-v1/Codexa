"use client"

import { eventColors } from "@/utils/eventColors"
import dayjs from "dayjs"
import { useNavigate } from "react-router-dom"

const EventCard = ({ event, setConfirmDeleteId }) => {
  const { bgColor, labelColor } = eventColors[event.category] || eventColors.Other
  const navigate = useNavigate()

  return (
    <section
      className={`${bgColor} p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100`}
    >
      <span className={`${labelColor} text-white px-3 py-1.5 rounded-full text-xs font-semibold inline-block`}>
        {event.category}
      </span>

      <h4 className="text-lg sm:text-xl font-bold mt-3 mb-2 text-gray-900">{event.title}</h4>

      <div className="space-y-1 mb-4">
        <p className="text-sm text-gray-600 font-medium">
          {event.date
            ? typeof event.date === "string"
              ? dayjs(event.date).format("DD MMM YYYY")
              : dayjs(event.date).format("DD MMM YYYY")
            : ""}
        </p>
        <p className="text-sm text-gray-600">{event.location}</p>
      </div>

      <section className="flex gap-3 mt-4">
        <button
          className="flex-1 bg-teal-700 hover:bg-teal-800 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
          onClick={() => navigate(`/events/${event._id}`)}
        >
          View Event
        </button>
        <button
          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
          onClick={() => setConfirmDeleteId(event._id)}
        >
          Cancel
        </button>
      </section>
    </section>
  )
}

export default EventCard
