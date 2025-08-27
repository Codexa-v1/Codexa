import { eventColors } from "../utils/eventColors";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event, setConfirmDeleteId }) => {
  const { bgColor, labelColor } = eventColors[event.category] || eventColors.Other;
  const navigate = useNavigate();

  return (
    <section
      className={`${bgColor} p-4 rounded-lg shadow mb-4 hover:-translate-y-2 transition-transform duration-300`}
    >
      <span
        className={`${labelColor} text-white px-3 py-1 rounded-full text-xs`}
      >
        {event.category}
      </span>
      <h4 className="text-lg font-bold mt-2">{event.title}</h4>
      <p className="text-sm">
        {event.date
          ? typeof event.date === "string"
            ? dayjs(event.date).format("DD MMM YYYY")
            : dayjs(event.date).format("DD MMM YYYY")
          : ""}
      </p>
      <p className="text-sm">{event.location}</p>

      <p className="text-xs mt-3">RSVP Progress</p>
      <section className="bg-gray-300 h-1 rounded mt-1">
        <section
          className="bg-green-900 h-1 rounded"
          style={{
            width: `${
              event.rsvpCurrent && event.rsvpTotal
                ? (event.rsvpCurrent / event.rsvpTotal) * 100
                : 0
            }%`,
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
          onClick={() => navigate(`/events/${event._id}`)}
        >
          View Event
        </button>
        <button
          className="bg-red-600 text-white px-6 py-1 rounded hover:opacity-90"
          onClick={() => setConfirmDeleteId(event._id)}
        >
          Cancel
        </button>
      </section>
    </section>
  );
};

export default EventCard;
