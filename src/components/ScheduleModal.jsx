import React from "react";

export default function ScheduleModal({ schedule, onClose }) {
  if (!schedule) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-4">Event Schedule</h2>
        <ul className="list-disc list-inside">
          {schedule.map((item, index) => (
            <li key={index} className="mb-2">
              <strong>{item.time}:</strong> {item.activity}
            </li>
          ))}
        </ul>
        <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
