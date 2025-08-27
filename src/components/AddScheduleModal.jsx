import React, { useState, useEffect } from "react";
import { createEventSchedule } from "../backend/api/EventSchedule";

export default function AddScheduleModal({ eventId, onClose, onScheduleUpdated, initialData }) {
  const [form, setForm] = useState(initialData || {
    description: "",
    startTime: "",
    endTime: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSave = async () => {
    // call backend API to add or update schedule
    const res = await createEventSchedule(eventId, form);
    // after saving:
    if (onScheduleUpdated) {
      onScheduleUpdated(); // fetch updated schedule
    }
    onClose();
  };

  return (
    <section className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <section className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4 text-yellow-900">
          {initialData ? "Edit" : "Add"} Schedule Item
        </h3>

        <section className="space-y-2">
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border px-2 py-1 rounded"
          />
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
          />
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
          />
        </section>

        <button
          className="mt-4 px-4 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-800"
          onClick={handleSave}
        >
          Save
        </button>
      </section>
    </section>
  );
}
