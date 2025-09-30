import React, { useState } from "react";
import { createEventSchedule } from "@/backend/api/EventSchedule";

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
    const res = await createEventSchedule(eventId, form);
    if (onScheduleUpdated) onScheduleUpdated();
    onClose();
  };

  return (
    <section className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2">
      <section
        className="
          bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative
          max-h-[90vh] overflow-y-auto
          max-md:p-4 max-sm:p-3
        "
      >
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl max-sm:text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Modal Title */}
        <h3
          className="
            text-2xl font-bold mb-6 text-yellow-900
            max-md:text-xl max-sm:text-lg max-sm:mb-4
          "
        >
          {initialData ? "Edit" : "Add"} Schedule Item
        </h3>

        {/* Form fields */}
        <section className="space-y-4 max-sm:space-y-3">
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="
              w-full border px-3 py-2 rounded resize-none
              max-sm:px-2 max-sm:py-1
            "
          />
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            className="
              w-full border px-3 py-2 rounded
              max-sm:px-2 max-sm:py-1
            "
          />
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            className="
              w-full border px-3 py-2 rounded
              max-sm:px-2 max-sm:py-1
            "
          />
        </section>

        {/* Save button */}
        <button
          className="
            mt-6 w-full px-4 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-800
            max-sm:mt-4 max-sm:px-3 max-sm:py-2
          "
          onClick={handleSave}
        >
          Save
        </button>
      </section>
    </section>
  );
}
