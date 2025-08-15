import { eventColors } from "../utils/eventColors";
import dayjs from "dayjs";

const EventCard = ({ event }) => {
  const { bgColor, labelColor } = eventColors[event.type] || eventColors.Other;

  return (
    <section className={`${bgColor} p-4 rounded-lg shadow mb-4`}>
      <span
        className={`${labelColor} text-white px-3 py-1 rounded-full text-xs`}
      >
        {event.type}
      </span>
      <h4 className="text-lg font-bold mt-2">{event.title}</h4>
      <p className="text-sm">{dayjs(event.date).format("DD MMM YYYY")}</p>
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
        <button className="bg-green-800 text-white px-6 py-1 rounded hover:opacity-90">
          View
        </button>
        <button className="bg-red-600 text-white px-6 py-1 rounded hover:opacity-90">
          Cancel
        </button>
      </section>
    </section>
  );
};

export default EventCard;
