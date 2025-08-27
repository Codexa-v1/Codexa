import React, { useState, useEffect } from "react";
import { 
  getSchedule, 
  deleteEventSchedule, 
  updateEventSchedule 
} from "../backend/api/EventSchedule";

export default function ScheduleModal({ eventId, onClose, onAddSchedule, onEditSchedule }) {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await getSchedule(eventId);

        // Sort by startTime (HH:mm)
        const sorted = data.sort((a, b) => {
          const [aHour, aMin] = a.startTime.split(":").map(Number);
          const [bHour, bMin] = b.startTime.split(":").map(Number);
          return aHour !== bHour ? aHour - bHour : aMin - bMin;
        });

        setSchedule(sorted);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };
    fetchSchedule();
  }, [eventId]);


  // --- Handlers ---
  const handleEditSchedule = (index) => {
    const item = schedule[index];
    if (onEditSchedule) {
      // pass item to AddScheduleModal for editing
      onEditSchedule(item, async (updatedData) => {
        try {
          const updated = await updateEventSchedule(eventId, item._id, updatedData);

          // update local state with new data
          setSchedule((prev) =>
            prev.map((s) => (s._id === item._id ? updated : s))
          );

          console.log("Updated schedule:", updated);
        } catch (error) {
          console.error("Error updating schedule item:", error);
        }
      });
    }
  };

  const handleRemoveSchedule = async (index) => {
    const item = schedule[index];
    if (!item?._id) {
      console.error("No scheduleId found for:", item);
      return;
    }

    try {
      await deleteEventSchedule(eventId, item._id);
      setSchedule((prev) => prev.filter((_, i) => i !== index));
      console.log("Removed schedule item:", item._id);
    } catch (error) {
      console.error("Error removing schedule item:", error);
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-lg p-12 max-w-7xl w-full relative">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        onClick={onClose}
      >
        &times;
      </button>

      <h3 className="text-xl font-bold mb-4 text-yellow-900">Event Schedule</h3>

      <button
        className="mb-4 px-3 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-800"
        onClick={() => onAddSchedule(null)} // open AddScheduleModal for new
      >
        + Add Schedule Item
      </button>

      {schedule.length === 0 ? (
        <p>No schedule items added yet.</p>
      ) : (
        <ul className="space-y-2">
          {schedule.map((item, idx) => (
            <li key={item._id || idx} className="border rounded p-2 space-y-2">
              <p className="font-semibold">{item.description}</p>
              <p className="text-xs text-gray-500">
                {item.startTime} – {item.endTime}
              </p>
              <div className="flex space-x-2">
                <button
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm font-semibold"
                  onClick={() => handleEditSchedule(idx)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold"
                  onClick={() => handleRemoveSchedule(idx)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
