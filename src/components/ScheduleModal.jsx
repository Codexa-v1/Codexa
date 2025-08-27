import React, { useState } from "react";
import dayjs from "dayjs";
import { getSchedule } from "../backend/api/EventSchedule";

export default function ScheduleModal({ eventId, onClose, onAddSchedule }) {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await getSchedule(eventId);
        setSchedule(data);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };

    fetchSchedule();
  }, [eventId]);

  return (
    <section className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <section className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4 text-yellow-900">Event Schedule</h3>

        <button
          className="mb-4 px-3 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-800"
          onClick={onAddSchedule}
        >
          + Add Schedule Item
        </button>

        {schedule.length === 0 ? (
          <p>No schedule items added yet.</p>
        ) : (
          <ul className="space-y-2">
            {schedule.map((item, idx) => (
              <li key={idx} className="border rounded p-2">
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-gray-700">{item.description}</p>
                <p className="text-xs text-gray-500">
                  {dayjs(item.startTime).format("HH:mm")} - {dayjs(item.endTime).format("HH:mm")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}